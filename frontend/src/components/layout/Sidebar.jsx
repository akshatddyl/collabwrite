import { Users, FileCode } from 'lucide-react';
import useStore from '../../store';
import UserAvatar from './UserAvatar';
import FileTree from '../filetree/FileTree';

function Sidebar({ onFileSelect, onCreateFile, onRenameFile, onDeleteFile }) {
  const { connectedUsers, activeFile, files, currentRoom } = useStore();

  return (
    <aside className="w-64 bg-dark-800/60 backdrop-blur-xl border-r border-dark-600/20 flex flex-col h-full overflow-hidden">
      {/* Room Info */}
      <div className="p-3 border-b border-dark-600/20">
        <h2 className="text-sm font-semibold text-dark-200 truncate">
          {currentRoom?.name || 'Room'}
        </h2>
        <p className="text-xs text-dark-400 mt-0.5">
          {connectedUsers.length} online
        </p>
      </div>

      {/* Connected Users */}
      <div className="p-3 border-b border-dark-600/20">
        <div className="flex items-center gap-2 mb-2">
          <Users size={14} className="text-dark-400" />
          <span className="text-xs font-medium text-dark-400 uppercase tracking-wider">
            Online
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {connectedUsers.map((u, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-dark-700/60 rounded-full pl-1 pr-2.5 py-0.5">
              <UserAvatar username={u.username} color={u.color} size="sm" />
              <span className="text-xs text-dark-200">{u.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <FileCode size={14} className="text-dark-400" />
            <span className="text-xs font-medium text-dark-400 uppercase tracking-wider">
              Files
            </span>
          </div>
          <FileTree
            files={files}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            onCreateFile={onCreateFile}
            onRenameFile={onRenameFile}
            onDeleteFile={onDeleteFile}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
