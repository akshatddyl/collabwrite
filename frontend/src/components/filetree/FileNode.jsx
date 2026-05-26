import { FileCode } from 'lucide-react';

function FileNode({ file, isActive, onClick, onContextMenu }) {
  return (
    <div
      id={`file-node-${file.id}`}
      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm transition-all
        ${isActive
          ? 'bg-accent/10 text-accent border-l-2 border-accent'
          : 'text-dark-300 hover:bg-dark-700/40 hover:text-dark-100 border-l-2 border-transparent'
        }`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <FileCode size={14} className={isActive ? 'text-accent' : 'text-dark-400'} />
      <span className="truncate font-mono text-xs">{file.filename}</span>
    </div>
  );
}

export default FileNode;
