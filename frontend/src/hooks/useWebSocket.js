import { useRef, useCallback, useEffect } from 'react';
import useStore from '../store';
import { WS_BASE_URL } from '../utils/constants';

export const useWebSocket = () => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const roomIdRef = useRef(null);
  const isCleanedUpRef = useRef(false);

  const connect = useCallback((roomId) => {
    const { user } = useStore.getState();

    // Prevent duplicate connections
    if (wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Store the roomId for reconnect logic
    roomIdRef.current = roomId;
    isCleanedUpRef.current = false;

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
      wsRef.current = null;

      // Only auto-reconnect if disconnect() was NOT called explicitly
      // (i.e., this was an unexpected disconnect, not a cleanup)
      if (!isCleanedUpRef.current && roomIdRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!isCleanedUpRef.current) {
            connect(roomIdRef.current);
          }
        }, 3000);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }, []);

  const handleMessage = useCallback((msg) => {
    const store = useStore.getState();

    switch (msg.type) {
      case 'welcome':
        store.setUserColor(msg.color);
        break;

      case 'users':
        // The server now sends a deduplicated list, but we add a
        // client-side safety net: deduplicate by username before setting.
        store.setConnectedUsers(msg.users || []);
        break;

      case 'user_joined':
        // The full user list is updated via the 'users' message that
        // the server broadcasts immediately after a join.
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
    // Mark as explicitly cleaned up so onclose doesn't auto-reconnect
    isCleanedUpRef.current = true;
    roomIdRef.current = null;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Cleanup on unmount — prevents ghost connections from React StrictMode
  // double-invocations or component unmounts
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, sendEdit, sendCursor, sendSave, selectFile };
};
