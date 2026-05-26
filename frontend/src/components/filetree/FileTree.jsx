import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import FileNode from './FileNode';
import FileContextMenu from './FileContextMenu';

function FileTree({ files, activeFile, onFileSelect, onCreateFile, onRenameFile, onDeleteFile }) {
  const [contextMenu, setContextMenu] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file,
    });
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      let name = newFileName.trim();
      if (!name.endsWith('.java')) name += '.java';
      onCreateFile(name);
      setNewFileName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-0.5">
      {files.map((file) => (
        <FileNode
          key={file.id}
          file={file}
          isActive={activeFile?.id === file.id}
          onClick={() => onFileSelect(file)}
          onContextMenu={(e) => handleContextMenu(e, file)}
        />
      ))}

      {isCreating && (
        <div className="pl-2 py-1">
          <input
            ref={inputRef}
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFile();
              if (e.key === 'Escape') setIsCreating(false);
            }}
            onBlur={handleCreateFile}
            className="w-full bg-dark-700 border border-accent/50 rounded px-2 py-1 text-xs text-dark-100 focus:outline-none"
            placeholder="Filename.java"
          />
        </div>
      )}

      <button
        id="create-file-btn"
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-1.5 px-2 py-1.5 mt-1 w-full text-xs text-dark-400 hover:text-accent hover:bg-dark-700/40 rounded transition-all"
      >
        <Plus size={14} />
        New File
      </button>

      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          file={contextMenu.file}
          onRename={onRenameFile}
          onDelete={onDeleteFile}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default FileTree;
