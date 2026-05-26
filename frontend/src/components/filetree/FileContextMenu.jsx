import { useEffect, useRef, useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';

function FileContextMenu({ x, y, file, onRename, onDelete, onClose }) {
  const menuRef = useRef(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(file.filename);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleRename = () => {
    if (newName.trim() && newName !== file.filename) {
      onRename(file.id, newName.trim());
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed glass rounded-lg shadow-2xl py-1 min-w-[160px] z-50 animate-scale-in"
      style={{ left: x, top: y }}
    >
      {renaming ? (
        <div className="px-3 py-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') onClose();
            }}
            className="w-full bg-dark-700 border border-accent/50 rounded px-2 py-1 text-xs text-dark-100 focus:outline-none"
            autoFocus
          />
        </div>
      ) : (
        <>
          <button
            onClick={() => setRenaming(true)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-200 hover:bg-dark-700/60 transition-colors"
          >
            <Edit3 size={14} />
            Rename
          </button>
          <button
            onClick={() => { onDelete(file.id); onClose(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export default FileContextMenu;
