import React, { useEffect, useRef } from 'react';
import { Snippet } from '../types';

interface CodeEditorProps {
  snippet: Snippet;
  userInput: string;
  onInputChange: (input: string) => void;
  errors: number;
  isCompleted: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  snippet,
  userInput,
  onInputChange,
  errors,
  isCompleted,
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const codeDisplayRef = useRef<HTMLDivElement>(null);

  // Focus the editor on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [snippet]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
  };

  // Generate line numbers
  const lineNumbers = snippet.code.split('\n').map((_, i) => i + 1);

  // Highlight correct/incorrect characters
  const renderHighlightedCode = () => {
    const targetCode = snippet.code;
    const chars = targetCode.split('');

    return chars.map((char, index) => {
      let className = 'text-gray-400'; // Default (not yet typed)
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = 'text-green-400'; // Correct
        } else {
          className = 'text-red-500 bg-red-900/30'; // Incorrect
        }
      }
      
      if (char === '\n') {
        return <br key={index} />;
      }
      
      if (char === ' ') {
        return <span key={index} className={className}>&nbsp;</span>;
      }
      
      return <span key={index} className={className}>{char}</span>;
    });
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gray-900 border border-gray-800 font-mono">
      <div className="flex">
        {/* Line numbers */}
        <div className="text-right p-4 bg-gray-800 text-gray-500 select-none">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">{num}</div>
          ))}
        </div>
        
        {/* Code display area (visible, shows highlighting) */}
        <div 
          ref={codeDisplayRef}
          className="p-4 overflow-x-auto whitespace-pre leading-6 min-w-0 flex-1"
        >
          {renderHighlightedCode()}
        </div>
        
        {/* Invisible textarea for capturing input */}
        <textarea
          ref={editorRef}
          value={userInput}
          onChange={handleInputChange}
          className="absolute inset-0 h-full w-full opacity-0 cursor-text resize-none"
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          disabled={isCompleted}
        />
      </div>
      
      {/* File path display */}
      <div className="text-xs text-gray-500 p-2 border-t border-gray-800 flex justify-between">
        <span>{snippet.language}/{snippet.title.toLowerCase().replace(/\s+/g, '_')}.{snippet.language === 'python' ? 'py' : snippet.language}</span>
        <span>{errors > 0 ? `Errors: ${errors}` : ''}</span>
      </div>
    </div>
  );
};

export default CodeEditor;