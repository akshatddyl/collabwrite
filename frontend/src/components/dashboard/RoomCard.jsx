import { Users, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';

function RoomCard({ room }) {
  const navigate = useNavigate();

  return (
    <div
      id={`room-card-${room.id}`}
      className="glass-card cursor-pointer group"
      onClick={() => navigate(`/room/${room.inviteCode}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/20">
          <span className="text-white font-bold text-sm">
            {room.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <ArrowRight
          size={18}
          className="text-dark-400 group-hover:text-accent group-hover:translate-x-1 transition-all"
        />
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
  );
}

export default RoomCard;
