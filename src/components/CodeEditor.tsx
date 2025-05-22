import React, { useEffect, useRef, useState } from 'react';
import { Snippet } from '../types';
import { RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  snippet: Snippet;
  userInput: string;
  onInputChange: (input: string) => void;
  errors: number;
  isCompleted: boolean;
  isDarkMode?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  snippet,
  userInput,
  onInputChange,
  errors,
  isCompleted,
  isDarkMode = true, // Default to dark mode if not provided
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const codeDisplayRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Track current line for auto-scrolling
  const [currentLine, setCurrentLine] = useState(0);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Focus the editor on mount and when completed changes
  useEffect(() => {
    if (editorRef.current && !isCompleted) {
      editorRef.current.focus();
    }
  }, [snippet, isCompleted]);

  // Handle input changes and auto-indent with advanced navigation
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    const prevValue = userInput;
    
    // Calculate current line first - this is critical for visual tracking
    const textUpToCursor = newValue.substring(0, cursorPos);
    const linesUpToCursor = textUpToCursor.split('\n');
    const actualLineIndex = linesUpToCursor.length - 1;
    
    // Always update current line immediately based on actual cursor position
    // Compare with previous to avoid unnecessary re-renders
    if (actualLineIndex !== currentLine) {
      setCurrentLine(actualLineIndex);
    }
    
    // Detect if user just added a new line
    if (newValue.length > prevValue.length && 
        newValue.charAt(cursorPos - 1) === '\n') {
      
      // We already know the current line index
      
      // Check if we need to find the next line with actual code
      const wasShiftEnterPressed = e.nativeEvent && (e.nativeEvent as any).shiftKey;
      
      // If Shift+Enter was pressed or we're at a line break, find the next meaningful line
      if (wasShiftEnterPressed || actualLineIndex < snippet.code.split('\n').length - 1) {
        // Get the actual target line index, skipping empty lines
        const targetLineIndex = findNextCodeLine(actualLineIndex);
        
        if (targetLineIndex < snippet.code.split('\n').length) {
          const targetLines = snippet.code.split('\n');
          const targetLine = targetLines[targetLineIndex];
          
          // Get indentation and content
          const indentation = targetLine.match(/^\s*/)?.[0] || '';
          const firstNonWhitespaceIndex = targetLine.search(/\S/);
          
          // Skip directly to where the content starts (first non-whitespace character)
          if (firstNonWhitespaceIndex >= 0) {
            // Create a new value that jumps directly to the next line with proper indentation
            let linesToKeep = newValue.split('\n').slice(0, actualLineIndex + 1);
            let linesAfter: string[] = [];
            
            // If there are more lines after the current cursor position, keep them
            if (newValue.split('\n').length > actualLineIndex + 1) {
              linesAfter = newValue.split('\n').slice(actualLineIndex + 1);
            }
            
            // If Shift+Enter was pressed and we're jumping lines, add empty lines in between
            if (wasShiftEnterPressed && targetLineIndex > actualLineIndex + 1) {
              const emptyLinesToAdd = targetLineIndex - (actualLineIndex + 1);
              for (let i = 0; i < emptyLinesToAdd; i++) {
                linesToKeep.push('');
              }
            }
            
            // Build the modified text with proper indentation
            const modifiedValue = [...linesToKeep, indentation + (linesAfter[0] || ''), ...linesAfter.slice(1)].join('\n');
            
            // Calculate new cursor position (exactly where the first non-whitespace character is)
            const newCursorPos = modifiedValue.split('\n').slice(0, targetLineIndex).join('\n').length + 1 + firstNonWhitespaceIndex;
            
            // Apply the changes
            onInputChange(modifiedValue);
            
            // Position cursor at the correct spot after indentation
            setTimeout(() => {
              if (editorRef.current) {
                editorRef.current.selectionStart = editorRef.current.selectionEnd = newCursorPos;
              }
            }, 0);
            
            // Update cursor position but keep tracking the actual displayed line
            setCursorPosition(newCursorPos);
            // Note: we don't set currentLine here, it should only reflect actual cursor position
            
            return;
          }
        }
      }
      
      // Standard indentation handling when not skipping lines
      if (actualLineIndex < snippet.code.split('\n').length) {
        const targetLines = snippet.code.split('\n');
        const targetLine = targetLines[actualLineIndex];
        
        // Calculate indentation and find first non-whitespace character
        const indentation = targetLine.match(/^\s*/)?.[0] || '';
        const firstNonWhitespaceIndex = targetLine.search(/\S/);
        
        if (firstNonWhitespaceIndex >= 0) {
          // Insert indentation at cursor position
          const modifiedValue = newValue.substring(0, cursorPos) + indentation + newValue.substring(cursorPos);
          
          // Update with indentation and set cursor at the first non-whitespace character
          onInputChange(modifiedValue);
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.selectionStart = editorRef.current.selectionEnd = cursorPos + firstNonWhitespaceIndex;
            }
          }, 0);
          
          // Update cursor position for highlighting
          setCursorPosition(cursorPos + firstNonWhitespaceIndex);
          
          // Calculate current line again to ensure accuracy
          const textUpToCursor = modifiedValue.substring(0, cursorPos + firstNonWhitespaceIndex);
          const linesUpToCursor = textUpToCursor.split('\n');
          setCurrentLine(linesUpToCursor.length - 1); // This is the real line number
          
          return;
        }
      }
    }
    
    // Standard handling when no auto-indent is needed
    onInputChange(newValue);
    setCursorPosition(cursorPos);
    
    // We already calculated and set currentLine at the beginning of this function
    // This ensures visual tracking is always based on the actual cursor position
  };

  // Auto-scroll to keep the cursor in view (vertical and horizontal)
  useEffect(() => {
    if (activeLineRef.current && codeDisplayRef.current) {
      // Get the position of the active line relative to the code display container
      const lineElement = activeLineRef.current;
      const container = codeDisplayRef.current;
      
      // Calculate the vertical position
      const lineTop = lineElement.offsetTop;
      const lineHeight = lineElement.offsetHeight;
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      
      // Check if the line is outside the visible vertical area
      if (lineTop < containerTop || lineTop + lineHeight > containerTop + containerHeight) {
        // Scroll vertically to keep the line in view with some padding
        container.scrollTo({
          top: lineTop - containerHeight / 3,
          behavior: 'smooth'
        });
      }
      
      // Find the active character position for horizontal scrolling
      if (userInput.length > 0 && cursorPosition >= 0) {
        // Find the element that contains the cursor
        const activeLine = lineElement;
        const activeCharElements = activeLine.querySelectorAll('span');
        
        if (activeCharElements.length > 0) {
          // Get the character at cursor position - use the current input text to calculate
          // This guarantees accuracy with the real cursor position
          const inputLines = userInput.split('\n');
          const linesBeforeCurrent = inputLines.slice(0, currentLine);
          const currentLineStartIndex = linesBeforeCurrent.join('\n').length + (currentLine > 0 ? 1 : 0);
          const positionInLine = cursorPosition - currentLineStartIndex;
          
          // Find the closest character element to our cursor position
          const activeCharElement = activeCharElements[Math.min(positionInLine, activeCharElements.length - 1)];
          
          if (activeCharElement) {
            const charLeft = activeCharElement.offsetLeft;
            const containerLeft = container.scrollLeft;
            const containerWidth = container.clientWidth;
            
            // Calculate how far from the left edge we want the cursor
            const targetLeftPosition = containerWidth / 3;
            
            // Check if the character is outside the visible horizontal area
            if (charLeft < containerLeft + targetLeftPosition || 
                charLeft > containerLeft + containerWidth - targetLeftPosition) {
              // Scroll horizontally to keep the cursor at 1/3 from the left edge
              container.scrollTo({
                left: Math.max(0, charLeft - targetLeftPosition),
                behavior: 'smooth'
              });
            }
          }
        }
      }
    }
  }, [cursorPosition, currentLine, userInput]);
  
  // Find the next non-empty line in the code
  const findNextCodeLine = (currentLineIndex: number, skipEmptyLines: boolean = true): number => {
    const targetLines = snippet.code.split('\n');
    let nextLineIndex = currentLineIndex + 1;
    
    // If we're not skipping empty lines or we've reached the end, return the next line
    if (!skipEmptyLines || nextLineIndex >= targetLines.length) {
      return nextLineIndex;
    }
    
    // Skip empty or whitespace-only lines
    while (nextLineIndex < targetLines.length) {
      const line = targetLines[nextLineIndex];
      const trimmedLine = line.trim();
      
      // If line has content, we found our target
      if (trimmedLine.length > 0) {
        return nextLineIndex;
      }
      
      nextLineIndex++;
    }
    
    return Math.min(nextLineIndex, targetLines.length - 1);
  };

  // Generate line numbers
  const lineNumbers = snippet.code.split('\n').map((_, i) => i + 1);

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Get file extension for the snippet language
  const getFileExtension = (language: string) => {
    switch (language) {
      case 'javascript': return 'js';
      case 'typescript': return 'ts';
      case 'python': return 'py';
      case 'java': return 'java';
      case 'go': return 'go';
      case 'ruby': return 'rb';
      case 'csharp': return 'cs';
      case 'cpp': return 'cpp';
      case 'php': return 'php';
      case 'rust': return 'rs';
      case 'sql': return 'sql';
      case 'html': return 'html';
      case 'css': return 'css';
      default: return language;
    }
  };

  // Highlight correct/incorrect characters
  const renderHighlightedCode = () => {
    const targetCode = snippet.code;
    const lines = targetCode.split('\n');
    
    // Add a cursor indicator
    const showCursorAt = showHint ? cursorPosition : -1;
    
    // Calculate overall character index for each line
    let charIndexOffset = 0;
    
    return lines.map((line, lineIdx) => {
      const chars = line.split('');
      // Detect if this is an empty line (only whitespace)
      const isEmpty = line.trim().length === 0;
      
      const lineResult = (
        <div 
          key={`line-${lineIdx}`} 
          className={`leading-6 whitespace-pre overflow-visible ${lineIdx === currentLine ? 'bg-gray-800/40 transition-colors duration-200' : ''}`}
          ref={lineIdx === currentLine ? activeLineRef : undefined}
          data-line-index={lineIdx}
        >
          {chars.map((char, charIdx) => {
            const index = charIndexOffset + charIdx;
            const isTyped = index < userInput.length;
            const style = getTokenStyle(char, index, isTyped, lineIdx);
            
            if (char === ' ') {
              return (
                <span key={`char-${index}`} className={style}>
                  {index === showCursorAt && <span className="bg-indigo-500 animate-pulse w-[2px] h-[1.15em] inline-block relative top-[0.2em] mx-[1px]"></span>}
                  &nbsp;
                </span>
              );
            }
            
            return (
              <span key={`char-${index}`} className={style}>
                {index === showCursorAt && <span className="bg-indigo-500 animate-pulse w-[2px] h-[1.15em] inline-block relative top-[0.2em] mx-[1px]"></span>}
                {char}
              </span>
            );
          })}
        </div>
      );
      
      // Increase offset for next line (add 1 for the newline character)
      charIndexOffset += line.length + 1;
      
      return lineResult;
    });
  };

  // Get token styling for syntax highlighting and typed/untyped status
  const getTokenStyle = (char: string, index: number, isTyped: boolean, lineIdx: number) => {
    // Add special case for active line to avoid false errors during navigation
    const isActiveLine = lineIdx === currentLine;
    
    // Basic styling for typed characters (correct/incorrect)
    if (isTyped) {
      // When the cursor moves to a new line via Shift+Enter, we don't want to show errors
      // in the previous line if we're still at the beginning of typing the current line
      if (isActiveLine && userInput.split('\n')[lineIdx]?.length <= 2) {
        // If we just started typing this line, don't show errors for whitespace
        if (char === ' ' || char === '\t' || char === '\n') {
          return 'opacity-70'; // Neutral styling
        }
      }
      
      // Skip whitespace check - don't mark spaces as errors
      if (char === ' ' || char === '\t') {
        return 'opacity-70'; // Neutral styling for spaces
      }
      
      // Special handling for newlines
      if (char === '\n' && (userInput[index] === '\n' || userInput[index] === undefined)) {
        return 'opacity-0'; // Hide newlines
      }
      
      // Check if typed character matches expected character
      if (userInput[index] === char) {
        return 'text-green-400 font-medium'; // Correct - brighter and bolder
      } else {
        // Skip red marking for special characters and spacing issues
        if (char === ' ' || char === '\t' || char === '\n') {
          return 'opacity-50'; // Less distracting for whitespace errors
        }
        
        // Don't show errors for characters that will be typed later in the navigation process
        if (isActiveLine && index > cursorPosition) {
          return isDarkMode ? 'opacity-40 transition-opacity duration-150 text-gray-300' : 'opacity-30 transition-opacity duration-150 text-gray-700';
        }
        
        return 'text-red-400 bg-red-900/30'; // Incorrect
      }
    }

    // Untyped text is significantly dimmed
    const baseClass = isDarkMode ? 'opacity-40 transition-opacity duration-150' : 'opacity-30 transition-opacity duration-150';
    
    // Simple syntax highlighting for untyped text
    if (char === '(' || char === ')' || char === '{' || char === '}' || char === '[' || char === ']') {
      return `${baseClass} text-yellow-400`;
    } else if (char === '=' || char === '+' || char === '-' || char === '*' || char === '/' || char === '>' || char === '<') {
      return `${baseClass} text-pink-400`;
    } else if (char === '"' || char === "'" || char === '`' ||
      (index > 0 && snippet.code[index - 1] === '/' && char === '/')) {
      return `${baseClass} text-green-500`;
    } else if (char === '.' || char === ':' || char === ';' || char === ',') {
      return `${baseClass} text-gray-400`;
    } else {
      return `${baseClass} text-gray-300`;
    }
  };

  // Remove unused firstContentIndex variable throughout the code
  useEffect(() => {
    // Check current line on focus events to ensure accuracy
    const handleFocus = () => {
      if (editorRef.current) {
        const cursorPos = editorRef.current.selectionStart;
        const text = editorRef.current.value;
        const textUpToCursor = text.substring(0, cursorPos);
        const actualLineNumber = textUpToCursor.split('\n').length - 1;
        
        // Important: Force refresh of line highlighting
        setCurrentLine(actualLineNumber);
        setCursorPosition(cursorPos); // Update cursor position too
      }
    };
    
    // Also handle clicks to immediately update current line
    const handleClick = () => {
      if (editorRef.current) {
        const cursorPos = editorRef.current.selectionStart;
        const text = editorRef.current.value;
        const textUpToCursor = text.substring(0, cursorPos);
        const actualLineNumber = textUpToCursor.split('\n').length - 1;
        
        setCurrentLine(actualLineNumber);
        setCursorPosition(cursorPos);
      }
    };
    
    // Add event listeners
    if (editorRef.current) {
      editorRef.current.addEventListener('focus', handleFocus);
      editorRef.current.addEventListener('click', handleClick);
      editorRef.current.addEventListener('mouseup', handleClick);
    }
    
    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('focus', handleFocus);
        editorRef.current.removeEventListener('click', handleClick);
        editorRef.current.removeEventListener('mouseup', handleClick);
      }
    };
  }, []);

  // Keyboard shortcuts for reset and advanced navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab key to reset
      if (e.key === 'Tab') {
        e.preventDefault();
        onInputChange('');
        return;
      }
      
      // Handle Shift+Enter for advanced navigation
      if (e.key === 'Enter' && e.shiftKey && editorRef.current) {
        e.preventDefault();
        
        // Get current cursor position and text
        const cursorPos = editorRef.current.selectionStart;
        const currentText = editorRef.current.value;
        
        // Calculate current line index
        const currentLineIndex = currentText.substr(0, cursorPos).split('\n').length - 1;
        
        // Find the next line that has actual code
        const nextLineIndex = findNextCodeLine(currentLineIndex);
        
        if (nextLineIndex < snippet.code.split('\n').length) {
          const targetLines = snippet.code.split('\n');
          const targetLine = targetLines[nextLineIndex];
          const indentation = targetLine.match(/^\s*/)?.[0] || '';
          const firstNonWhitespaceIndex = targetLine.search(/\S/);
          
          // Create new text with proper line jumps
          let newText = currentText;
          
          // Insert new lines if we're jumping multiple lines
          if (nextLineIndex > currentLineIndex + 1) {
            const currentLines = currentText.split('\n');
            const linesToAdd = nextLineIndex - (currentLineIndex + 1);
            
            // Add the current line up to cursor
            const beforeCursor = currentLines[currentLineIndex].substring(0, cursorPos - currentText.split('\n').slice(0, currentLineIndex).join('\n').length - (currentLineIndex > 0 ? 1 : 0));
            
            // Start building the new text
            let newLines = [
              ...currentLines.slice(0, currentLineIndex),
              beforeCursor
            ];
            
            // Add empty lines in between
            for (let i = 0; i < linesToAdd; i++) {
              newLines.push('');
            }
            
            // Add indentation for the target line
            newLines.push(indentation);
            
            // Add any remaining lines
            if (currentLines.length > currentLineIndex + 1) {
              newLines = [...newLines, ...currentLines.slice(currentLineIndex + 1)];
            }
            
            newText = newLines.join('\n');
          } else {
            // Just adding a single line with proper indentation
            newText = currentText.substring(0, cursorPos) + '\n' + indentation + currentText.substring(cursorPos);
          }
          
          // Calculate new cursor position (exactly at the first non-whitespace character)
          const newCursorPos = firstNonWhitespaceIndex >= 0 ?
            newText.split('\n').slice(0, nextLineIndex + 1).join('\n').length + firstNonWhitespaceIndex :
            newText.split('\n').slice(0, nextLineIndex + 1).join('\n').length + indentation.length;
          
          // Apply changes
          onInputChange(newText);
          
          // Position cursor at the correct spot
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.selectionStart = editorRef.current.selectionEnd = newCursorPos;
            }
          }, 0);
          
          // Update cursor position
          setCursorPosition(newCursorPos);
          
          // Update current line to match the ACTUAL cursor position, not the target line
          // This is crucial for visual tracking to be accurate
          setTimeout(() => {
            if (editorRef.current) {
              const text = editorRef.current.value;
              const cursorPos = editorRef.current.selectionStart;
              const textUpToCursor = text.substring(0, cursorPos);
              const actualLineNumber = textUpToCursor.split('\n').length - 1;
              
              // Important: Force refresh of highlighting by changing state
              setCurrentLine(prev => {
                if (prev !== actualLineNumber) {
                  return actualLineNumber;
                }
                return prev; // No need to update if it's the same
              });
            }
          }, 10);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInputChange, snippet.code]);

  return (
    <div className={`relative w-full rounded-lg overflow-hidden font-mono mb-4 shadow-lg ${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-300'}`}>
      {/* We don't need the hidden detector anymore */}
      <div className={`flex py-2 px-4 border-b justify-between items-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="flex space-x-1 flex-none">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className={`ml-2 text-xs truncate max-w-[200px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {snippet.language}/{snippet.title.toLowerCase().replace(/\s+/g, '_')}.{getFileExtension(snippet.language)}
            </span>
          </div>
          <div className="flex items-center space-x-2 flex-none">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(snippet.difficulty)} ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              {snippet.difficulty}
            </span>
          </div>
      </div>

      <div className="flex w-full overflow-hidden">
        {/* Line numbers */}
        <div className={`text-right p-4 select-none min-w-[3rem] flex-none ${isDarkMode ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-100/70 text-gray-400'}`}>
          {lineNumbers.map((num, idx) => (
            <div key={num} className={`leading-6 ${idx === currentLine ? 'text-gray-300 font-medium' : ''}`}>{num}</div>
          ))}
        </div>

        {/* Code display area (visible, shows highlighting) */}
        <div
          ref={codeDisplayRef}
          className="p-4 overflow-auto leading-6 flex-1 max-h-[400px]"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            overflowX: 'auto',
            scrollBehavior: 'smooth'
          }}
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.focus();
            }
          }}
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
        >
          <div style={{ display: 'inline-block', minWidth: '100%', width: 'max-content' }}>
            {renderHighlightedCode()}
          </div>
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

      {/* File status display */}
      <div className={`text-xs text-gray-500 p-2 border-t border-gray-800 flex justify-between items-center ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <span>
          {errors > 0 ? (
            <span className="text-red-400">Errors: {errors}</span>
          ) : userInput.length > 0 ? (
            <span className="text-green-400">Looking good!</span>
          ) : (
            <span>Start typing when ready</span>
          )}
        </span>
        <div className="flex items-center space-x-2">
          <span>{userInput.length}/{snippet.code.length} characters</span>
          <div className={`bg-gray-700 w-32 h-1.5 rounded-full overflow-hidden ${isDarkMode ? '' : 'bg-gray-200'}`}>
            <div
              className="bg-indigo-500 h-full rounded-full"
              style={{ width: `${(userInput.length / snippet.code.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 opacity-60 hover:opacity-100 transition-opacity">
        <button
          className="bg-gray-800 p-2 rounded-full"
          title="Reset typing test (or press Tab)"
          onClick={() => onInputChange('')}
        >
          <RotateCcw className="h-4 w-4 text-indigo-400" />
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;