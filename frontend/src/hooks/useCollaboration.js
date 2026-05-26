import { useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import useStore from '../store';

export const useCollaboration = () => {
  const { sendEdit, sendCursor, sendSave, selectFile, connect, disconnect } = useWebSocket();
  const { user, activeFile, editorContent, userColor } = useStore();
  const debounceRef = useRef(null);

  const handleEditorChange = useCallback((value) => {
    useStore.getState().setEditorContent(value);

    // Debounce sending edits to avoid flooding
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const file = useStore.getState().activeFile;
      if (file) {
        sendEdit(file.id, value);
      }
    }, 50); // 50ms debounce for responsive collab
  }, [sendEdit]);

  const handleCursorChange = useCallback((position) => {
    const file = useStore.getState().activeFile;
    if (file && position) {
      sendCursor(file.id, position.lineNumber, position.column);
    }
  }, [sendCursor]);

  const handleSave = useCallback(() => {
    const file = useStore.getState().activeFile;
    if (file) {
      sendSave(file.id);
    }
  }, [sendSave]);

  const handleFileSelect = useCallback((file) => {
    useStore.getState().setActiveFile(file);
    selectFile(file.id);
  }, [selectFile]);

  return {
    handleEditorChange,
    handleCursorChange,
    handleSave,
    handleFileSelect,
    connect,
    disconnect,
  };
};
