import { Undo2, Redo2, Download, Save } from 'lucide-react';
import useStore from '../../store';
import { downloadFile } from '../../utils/helpers';

function EditorToolbar({ onSave }) {
  const { activeFile, editorContent } = useStore();

  const handleDownload = () => {
    if (activeFile && editorContent) {
      downloadFile(editorContent, activeFile.filename);
    }
  };

  return (
    <div className="h-10 bg-dark-800/80 border-b border-dark-600/20 flex items-center justify-between px-3">
      <div className="flex items-center gap-1">
        <span className="text-xs text-dark-400 font-mono">
          {activeFile ? (
            <>
              <span className="text-accent">☕</span>{' '}
              <span className="text-dark-200">{activeFile.filename}</span>
            </>
          ) : (
            'No file selected'
          )}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          id="save-btn"
          onClick={onSave}
          disabled={!activeFile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-dark-300 hover:text-dark-100 hover:bg-dark-700/60 transition-all disabled:opacity-30"
          title="Save (Ctrl+S)"
        >
          <Save size={14} />
          Save
        </button>

        <div className="h-4 w-px bg-dark-600 mx-1" />

        <button
          id="download-btn"
          onClick={handleDownload}
          disabled={!activeFile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-dark-300 hover:text-dark-100 hover:bg-dark-700/60 transition-all disabled:opacity-30"
          title="Download .java file"
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
