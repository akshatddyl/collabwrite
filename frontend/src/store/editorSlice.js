export const createEditorSlice = (set) => ({
  files: [],
  activeFile: null,
  editorContent: '',
  connectedUsers: [],
  remoteCursors: {},
  userColor: null,

  setFiles: (files) => set({ files }),

  setActiveFile: (file) => set({ activeFile: file }),

  addFile: (file) =>
    set((state) => ({ files: [...state.files, file] })),

  removeFile: (fileId) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== fileId),
      activeFile: state.activeFile?.id === fileId ? null : state.activeFile,
    })),

  updateFile: (fileId, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === fileId ? { ...f, ...updates } : f)),
    })),

  setEditorContent: (content) => set({ editorContent: content }),

  setConnectedUsers: (users) => set({ connectedUsers: users }),

  setRemoteCursors: (cursors) => set({ remoteCursors: cursors }),

  updateRemoteCursor: (username, cursor) =>
    set((state) => ({
      remoteCursors: { ...state.remoteCursors, [username]: cursor },
    })),

  removeRemoteCursor: (username) =>
    set((state) => {
      const cursors = { ...state.remoteCursors };
      delete cursors[username];
      return { remoteCursors: cursors };
    }),

  setUserColor: (color) => set({ userColor: color }),

  clearEditor: () =>
    set({
      files: [],
      activeFile: null,
      editorContent: '',
      connectedUsers: [],
      remoteCursors: {},
      userColor: null,
    }),
});
