import { useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import useStore from '../../store';
import CursorLabel from './CursorLabel';

function MonacoEditor({ onChange, onCursorChange }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);
  const isRemoteUpdateRef = useRef(false);
  const { editorContent, remoteCursors, activeFile, user } = useStore();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define dark theme
    monaco.editor.defineTheme('collabwrite-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'annotation', foreground: 'DCDCAA' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1e293b',
        'editor.selectionBackground': '#6366f140',
        'editor.inactiveSelectionBackground': '#6366f120',
        'editorCursor.foreground': '#6366f1',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editor.selectionHighlightBackground': '#6366f120',
        'editorBracketMatch.background': '#6366f130',
        'editorBracketMatch.border': '#6366f150',
        'editorGutter.background': '#0f172a',
        'editorWidget.background': '#1e293b',
        'editorWidget.border': '#334155',
        'input.background': '#1e293b',
        'dropdown.background': '#1e293b',
        'list.hoverBackground': '#334155',
      },
    });
    monaco.editor.setTheme('collabwrite-dark');

    // Cursor position change
    editor.onDidChangeCursorPosition((e) => {
      onCursorChange?.({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Content change
    editor.onDidChangeModelContent(() => {
      if (!isRemoteUpdateRef.current) {
        const value = editor.getValue();
        onChange?.(value);
      }
    });
  };

  // Update editor content from remote edits
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editorContent !== undefined) {
      const currentValue = editor.getValue();
      if (currentValue !== editorContent) {
        isRemoteUpdateRef.current = true;
        const position = editor.getPosition();
        editor.setValue(editorContent);
        if (position) editor.setPosition(position);
        isRemoteUpdateRef.current = false;
      }
    }
  }, [editorContent]);

  // Render remote cursors as decorations
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const newDecorations = [];
    Object.entries(remoteCursors).forEach(([username, cursor]) => {
      if (username === user?.username) return;
      if (cursor.fileId !== activeFile?.id?.toString()) return;

      const line = cursor.lineNumber || 1;
      const col = cursor.column || 1;

      // Cursor line highlight
      newDecorations.push({
        range: new monaco.Range(line, col, line, col + 1),
        options: {
          className: `remote-cursor-${username.replace(/[^a-zA-Z0-9]/g, '')}`,
          beforeContentClassName: `remote-cursor-line`,
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          overviewRuler: {
            color: cursor.color,
            position: monaco.editor.OverviewRulerLane.Full,
          },
        },
      });

      // Cursor decoration line
      newDecorations.push({
        range: new monaco.Range(line, col, line, col),
        options: {
          afterContentClassName: 'remote-cursor-widget',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      });
    });

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, [remoteCursors, activeFile, user]);

  // Inject cursor styles dynamically
  useEffect(() => {
    const styleId = 'remote-cursor-styles';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    let css = `.remote-cursor-line { border-left: 2px solid; }\n`;
    css += `.remote-cursor-widget { border-left: 2px solid; }\n`;

    Object.entries(remoteCursors).forEach(([username, cursor]) => {
      if (username === user?.username) return;
      const safeUsername = username.replace(/[^a-zA-Z0-9]/g, '');
      css += `.remote-cursor-${safeUsername} { background-color: ${cursor.color}30; border-left: 2px solid ${cursor.color}; }\n`;
    });

    style.textContent = css;
  }, [remoteCursors, user]);

  return (
    <div className="relative w-full h-full">
      <Editor
        height="100%"
        language="java"
        theme="collabwrite-dark"
        value={editorContent}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: true, scale: 1 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          padding: { top: 16 },
          lineNumbers: 'on',
          roundedSelection: true,
          automaticLayout: true,
          wordWrap: 'off',
          tabSize: 4,
          insertSpaces: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-dark-900">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <p className="text-sm text-dark-400">Loading editor...</p>
            </div>
          </div>
        }
      />

      {/* Remote cursor labels overlay */}
      <div className="absolute top-0 right-0 p-2 flex flex-col gap-1 z-10 pointer-events-none">
        {Object.entries(remoteCursors)
          .filter(([username]) => username !== user?.username)
          .filter(([, cursor]) => cursor.fileId === activeFile?.id?.toString())
          .map(([username, cursor]) => (
            <CursorLabel key={username} username={username} color={cursor.color} />
          ))}
      </div>
    </div>
  );
}

export default MonacoEditor;
