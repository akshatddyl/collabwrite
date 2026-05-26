import { useState } from 'react';
import { Users, Clock, ArrowRight, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import useStore from '../../store';

function RoomCard({ room, onDelete, onLeave }) {
  const navigate = useNavigate();
  const { user } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const isOwner = user?.username === room.ownerUsername;

  const handleAction = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
    
    if (isOwner) {
      if (onDelete) onDelete(room.id);
    } else {
      if (onLeave) onLeave(room.id);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <>
      <div
        id={`room-card-${room.id}`}
        className="glass-card cursor-pointer group relative"
        onClick={() => navigate(`/room/${room.inviteCode}`)}
      >
        {/* Action Buttons — top right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            id={`room-action-${room.id}`}
            onClick={handleAction}
            title={isOwner ? 'Delete room' : 'Leave room'}
            className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 ${
              isOwner
                ? 'hover:bg-red-500/20 text-dark-400 hover:text-red-400'
                : 'hover:bg-amber-500/20 text-dark-400 hover:text-amber-400'
            }`}
          >
            {isOwner ? <Trash2 size={15} /> : <LogOut size={15} />}
          </button>
          <ArrowRight
            size={18}
            className="text-dark-400 group-hover:text-accent group-hover:translate-x-1 transition-all"
          />
        </div>

        <div className="mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/20">
            <span className="text-white font-bold text-sm">
              {room.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-dark-100 mb-1 truncate">
          {room.name}
        </h3>

        <p className="text-xs text-dark-400 mb-4 font-mono truncate">
          {room.inviteCode}
        </p>

        <div className="flex items-center justify-between text-xs text-dark-400">
          <div className="flex items-center gap-1.5">
            <Users size={13} />
            <span>{room.memberCount} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{formatDate(room.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCancel}
        >
          <div
            className="bg-dark-800 border border-dark-600/50 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isOwner
                    ? 'bg-red-500/15 text-red-400'
                    : 'bg-amber-500/15 text-amber-400'
                }`}
              >
                {isOwner ? <Trash2 size={20} /> : <LogOut size={20} />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-dark-100">
                  {isOwner ? 'Delete Room' : 'Leave Room'}
                </h3>
                <p className="text-xs text-dark-400">{room.name}</p>
              </div>
            </div>

            <p className="text-sm text-dark-300 mb-6 leading-relaxed">
              {isOwner
                ? 'This will permanently delete the room, all files, and remove all members. This action cannot be undone.'
                : 'You will be removed from this room. You can rejoin later with an invite code.'}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-dark-300 hover:text-dark-100 transition rounded-lg hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  isOwner
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'
                }`}
              >
                {isOwner ? 'Delete Room' : 'Leave Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RoomCard;
