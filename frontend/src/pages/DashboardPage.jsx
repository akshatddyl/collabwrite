import { useState, useEffect } from 'react';
import { Plus, Search, Code2, Copy, Check } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import RoomCard from '../components/dashboard/RoomCard';
import CreateRoomModal from '../components/dashboard/CreateRoomModal';
import { roomService } from '../services/roomService';
import useStore from '../store';
import toast from 'react-hot-toast';

function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(null);
  const { rooms, setRooms } = useStore();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (err) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (name) => {
    const room = await roomService.createRoom(name);
    setRooms([...rooms, room]);
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }
    try {
      await roomService.joinRoom(joinCode.trim());
      toast.success('Joined room!');
      loadRooms();
      setJoinCode('');
    } catch (err) {
      toast.error('Invalid invite code');
    }
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${code}`);
    setCopied(code);
    toast.success('Link copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark-100">Your Rooms</h1>
            <p className="text-sm text-dark-400 mt-1">
              Create or join a room to start collaborating
            </p>
          </div>
          <button
            id="open-create-modal"
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Room
          </button>
        </div>

        {/* Search & Join */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              id="search-rooms"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
              placeholder="Search rooms..."
            />
          </div>
          <div className="flex gap-2">
            <input
              id="join-code-input"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="input-field"
              placeholder="Paste invite code to join..."
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
            <button
              id="join-room-btn"
              onClick={handleJoinRoom}
              className="btn-secondary whitespace-nowrap"
            >
              Join
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20">
            <Code2 size={48} className="mx-auto text-dark-500 mb-4" />
            <h3 className="text-lg font-medium text-dark-300 mb-2">
              {rooms.length === 0 ? 'No rooms yet' : 'No matching rooms'}
            </h3>
            <p className="text-sm text-dark-400 mb-6">
              {rooms.length === 0
                ? 'Create your first room to start collaborating!'
                : 'Try a different search term'}
            </p>
            {rooms.length === 0 && (
              <button onClick={() => setShowModal(true)} className="btn-primary">
                <Plus size={18} className="inline mr-2" />
                Create First Room
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </main>

      <CreateRoomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}

export default DashboardPage;
