import React from 'react';
import './Blackbox.css'; // Ensure you have the CSS imported

const StickyToolbar = ({ onSave, onToggleFavourite, onSetDaily, favourited, onClipboardClick }) => {
  const handleCommand = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="sticky-toolbar">
      {/* Left Icons */}
      <div className="left-icons">
        <button className="toolbar-button" title="Save" onClick={onSave}>
          💾 {/* Save Icon */}
        </button>
        <button className="toolbar-button" title="Clock" onClick={onSetDaily}>
          ⏰ {/* Clock Icon */}
        </button>
      </div>

      {/* Center Formatting Icons */}
      <div className="center-icons">
        <button onClick={() => handleCommand('bold')} className="toolbar-button" title="Bold">
          B
        </button>
        <button onClick={() => handleCommand('italic')} className="toolbar-button" title="Italic">
          I
        </button>
        <button onClick={() => handleCommand('underline')} className="toolbar-button" title="Underline">
          U
        </button>
        <button onClick={() => handleCommand('insertUnorderedList')} className="toolbar-button" title="Bullet">
          • {/* Bullet Points */}
        </button>
        <button onClick={() => handleCommand('justifyLeft')} className="toolbar-button" title="Align Left">
          ⬅️ {/* Align Left */}
        </button>
        <button onClick={() => handleCommand('justifyCenter')} className="toolbar-button" title="Align Center">
          ⬆️ {/* Align Center */}
        </button>
        <button onClick={() => handleCommand('justifyRight')} className="toolbar-button" title="Align Right">
          ➡️ {/* Align Right */}
        </button>
        <button onClick={() => handleCommand('justifyFull')} className="toolbar-button" title="Justify">
          ⬇️ {/* Justify */}
        </button>
      </div>

      {/* Right Icons */}
      <div className="right-icons">
        <button className="toolbar-button" title="Clipboard" onClick={onClipboardClick}>
          📋 {/* Clipboard Icon */}
        </button>
        <button className="toolbar-button" title="Favorite" onClick={onToggleFavourite}>
          {favourited ? '🤍' : '🧡'} {/* Toggle heart icon based on favourited state */}
        </button>
        <button className="toolbar-button" title="Share">
          📤 {/* Share Icon */}
        </button>
      </div>
    </div>
  );
};

export default StickyToolbar;
