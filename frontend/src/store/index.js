import { create } from 'zustand';
import { createAuthSlice } from './authSlice';
import { createRoomSlice } from './roomSlice';
import { createEditorSlice } from './editorSlice';

const useStore = create((...args) => ({
  ...createAuthSlice(...args),
  ...createRoomSlice(...args),
  ...createEditorSlice(...args),
}));

export default useStore;
