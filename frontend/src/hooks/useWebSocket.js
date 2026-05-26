import { useRef, useCallback, useEffect } from 'react';
import useStore from '../store';
import { WS_BASE_URL } from '../utils/constants';

export const useWebSocket = () => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const {
    user,
    setConnectedUsers,
    updateRemoteCursor,
    removeRemoteCursor,
    setEditorContent,
    setUserColor,
    activeFile,
  } = useStore();

  const connect = useCallback((roomId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_BASE_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({
        type: 'join',
        roomId,
        username: user?.username,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleMessage(msg);
      } catch (e) {
        console.error('Failed to parse WS message:', e);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Auto-reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect(roomId);
      }, 3000);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }, [user]);

  const handleMessage = useCallback((msg) => {
    const store = useStore.getState();

    switch (msg.type) {
      case 'welcome':
        store.setUserColor(msg.color);
        break;

      case 'users':
        store.setConnectedUsers(msg.users || []);
        break;

      case 'user_joined':
        // users list will be updated via 'users' message
        break;

      case 'user_left':
        store.removeRemoteCursor(msg.username);
        break;

      case 'edit':
        // Only apply if it's for the current file
        if (msg.fileId === store.activeFile?.id?.toString()) {
          store.setEditorContent(msg.content);
        }
        break;

      case 'cursor':
        store.updateRemoteCursor(msg.username, {
          lineNumber: msg.lineNumber,
          column: msg.column,
          color: msg.color,
          username: msg.username,
          fileId: msg.fileId,
        });
        break;

      case 'file_content':
        if (msg.fileId === store.activeFile?.id?.toString()) {
          store.setEditorContent(msg.content);
        }
        break;

      case 'error':
        console.error('Server error:', msg.content);
        break;

      default:
        break;
    }
  }, []);

  const sendEdit = useCallback((fileId, content) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'edit',
        fileId: fileId?.toString(),
        content,
      }));
    }
  }, []);

  const sendCursor = useCallback((fileId, lineNumber, column) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor',
        fileId: fileId?.toString(),
        lineNumber,
        column,
      }));
    }
  }, []);

  const sendSave = useCallback((fileId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'save',
        fileId: fileId?.toString(),
      }));
    }
  }, []);

  const selectFile = useCallback((fileId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'select_file',
        fileId: fileId?.toString(),
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, sendEdit, sendCursor, sendSave, selectFile };
};
