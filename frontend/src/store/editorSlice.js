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

  /**
   * Sets the connected users list with client-side deduplication.
   * The server already sends a deduplicated list, but this is a safety net
   * in case of race conditions or message ordering issues.
   * Deduplicates by username — if duplicates exist, the last occurrence wins.
   */
  setConnectedUsers: (users) => {
    const uniqueMap = new Map();
    for (const user of users) {
      uniqueMap.set(user.username, user);
    }
    set({ connectedUsers: Array.from(uniqueMap.values()) });
  },

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
