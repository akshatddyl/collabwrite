export const createRoomSlice = (set) => ({
  rooms: [],
  currentRoom: null,

  setRooms: (rooms) => set({ rooms }),

  setCurrentRoom: (room) => set({ currentRoom: room }),

  addRoom: (room) =>
    set((state) => ({ rooms: [...state.rooms, room] })),

  removeRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((r) => r.id !== roomId),
      currentRoom: state.currentRoom?.id === roomId ? null : state.currentRoom,
    })),

  clearRooms: () => set({ rooms: [], currentRoom: null }),
});
