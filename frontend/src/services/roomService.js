import api from './api';

export const roomService = {
  async getRooms() {
    const { data } = await api.get('/rooms');
    return data;
  },

  async createRoom(name) {
    const { data } = await api.post('/rooms', { name });
    return data;
  },

  async getRoomByInviteCode(inviteCode) {
    const { data } = await api.get(`/rooms/invite/${inviteCode}`);
    return data;
  },

  async joinRoom(inviteCode) {
    const { data } = await api.post(`/rooms/join/${inviteCode}`);
    return data;
  },

  async getFiles(inviteCode) {
    const { data } = await api.get(`/files/room/${inviteCode}`);
    return data;
  },

  async createFile(inviteCode, filename) {
    const { data } = await api.post(`/files/room/${inviteCode}`, { filename });
    return data;
  },

  async renameFile(fileId, filename) {
    const { data } = await api.put(`/files/${fileId}/rename`, { filename });
    return data;
  },

  async deleteFile(fileId) {
    await api.delete(`/files/${fileId}`);
  },

  async updateFileContent(fileId, content) {
    const { data } = await api.put(`/files/${fileId}/content`, { content });
    return data;
  },
};
