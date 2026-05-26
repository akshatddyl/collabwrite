import { getInitials } from '../../utils/helpers';

function UserAvatar({ username, color, size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white shadow-lg transition-transform hover:scale-110`}
      style={{
        background: color || 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        boxShadow: color ? `0 0 12px ${color}40` : undefined,
      }}
      title={username}
    >
      {getInitials(username)}
    </div>
  );
}

export default UserAvatar;
