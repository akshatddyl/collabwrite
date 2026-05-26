export const createRoomSlice = (set) => ({
  rooms: [],
  currentRoom: null,

  setRooms: (rooms) => set({ rooms }),

  setCurrentRoom: (room) => set({ currentRoom: room }),

  addRoom: (room) =>
    set((state) => ({ rooms: [...state.rooms, room] })),

  clearRooms: () => set({ rooms: [], currentRoom: null }),
});
