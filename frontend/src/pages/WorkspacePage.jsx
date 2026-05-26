import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MonacoEditor from '../components/editor/MonacoEditor';
import EditorToolbar from '../components/editor/EditorToolbar';
import { useCollaboration } from '../hooks/useCollaboration';
import { roomService } from '../services/roomService';
import useStore from '../store';
import toast from 'react-hot-toast';

function WorkspacePage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setCurrentRoom, setFiles, setActiveFile, setEditorContent, activeFile, user } = useStore();

  const {
    handleEditorChange,
    handleCursorChange,
    handleSave,
    handleFileSelect,
    connect,
    disconnect,
  } = useCollaboration();

  // Load room data
  useEffect(() => {
    const initRoom = async () => {
      try {
        // Get room info
        const room = await roomService.getRoomByInviteCode(inviteCode);
        setCurrentRoom(room);

        // Join the room
        try {
          await roomService.joinRoom(inviteCode);
        } catch (e) {
          // Already a member, that's fine
        }

        // Load files
        const files = await roomService.getFiles(inviteCode);
        setFiles(files);

        // Select first file
        if (files.length > 0) {
          setActiveFile(files[0]);
          setEditorContent(files[0].content || '');
        }

        // Connect WebSocket
        connect(inviteCode);

        setLoading(false);
      } catch (err) {
        toast.error('Failed to load room');
        navigate('/dashboard');
      }
    };

    initRoom();

    return () => {
      disconnect();
      setCurrentRoom(null);
      useStore.getState().clearEditor();
    };
  }, [inviteCode]);

  // Select file from WebSocket
  useEffect(() => {
    if (activeFile) {
      const { selectFile } = useStore.getState();
    }
  }, [activeFile]);

  const onFileSelect = useCallback(async (file) => {
    handleFileSelect(file);
    setEditorContent(file.content || '');
  }, [handleFileSelect, setEditorContent]);

  const onCreateFile = useCallback(async (filename) => {
    try {
      const file = await roomService.createFile(inviteCode, filename);
      useStore.getState().addFile(file);
      toast.success(`Created ${filename}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create file');
    }
  }, [inviteCode]);

  const onRenameFile = useCallback(async (fileId, newName) => {
    try {
      await roomService.renameFile(fileId, newName);
      useStore.getState().updateFile(fileId, { filename: newName });
      toast.success('File renamed');
    } catch (err) {
      toast.error('Failed to rename file');
    }
  }, []);

  const onDeleteFile = useCallback(async (fileId) => {
    try {
      await roomService.deleteFile(fileId);
      useStore.getState().removeFile(fileId);
      toast.success('File deleted');
    } catch (err) {
      toast.error('Failed to delete file');
    }
  }, []);

  // Ctrl+S handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
        toast.success('Saved!', { duration: 1500 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-900 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onFileSelect={onFileSelect}
          onCreateFile={onCreateFile}
          onRenameFile={onRenameFile}
          onDeleteFile={onDeleteFile}
        />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorToolbar onSave={() => {
            handleSave();
            toast.success('Saved!', { duration: 1500 });
          }} />

          <div className="flex-1 overflow-hidden">
            {activeFile ? (
              <MonacoEditor
                onChange={handleEditorChange}
                onCursorChange={handleCursorChange}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-dark-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No file selected</p>
                  <p className="text-sm">Select a file from the sidebar or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspacePage;
