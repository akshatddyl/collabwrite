function CursorLabel({ username, color }) {
  return (
    <div
      className="cursor-label animate-fade-in"
      style={{
        backgroundColor: color,
        boxShadow: `0 2px 8px ${color}40`,
      }}
    >
      <span className="flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-soft"
          style={{ backgroundColor: '#fff' }}
        />
        {username}
      </span>
    </div>
  );
}

export default CursorLabel;
