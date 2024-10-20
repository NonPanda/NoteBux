import React from 'react';
import './Blackbox.css'; // Ensure you have the CSS imported

// Import SVG Icons
import SaveIcon from '../assets/icons/create/Save.svg';
import ClockIcon from '../assets/icons/create/Daily.svg';
import BoldIcon from '../assets/icons/create/textbold.svg';
import ItalicIcon from '../assets/icons/create/textitalic.svg';
import UnderlineIcon from '../assets/icons/create/textunderline.svg';
import AlignLeftIcon from '../assets/icons/create/textalignjustifyleft.svg';
import AlignCenterIcon from '../assets/icons/create/textaligncenter.svg';
import AlignRightIcon from '../assets/icons/create/textalignjustifyright.svg';
import JustifyIcon from '../assets/icons/create/textalignjustifycenter.svg'; // Assuming justify, replace if necessary
import ClipboardIcon from '../assets/icons/create/clipboardtext.svg';
import HeartIcon from '../assets/icons/create/heart.svg';
import DarkHeartIcon from '../assets/icons/create/heartdark.svg';
import BulletIcon from '../assets/icons/create/list.svg';
import DeleteIcon from '../assets/icons/create/delete.svg';

const StickyToolbar = ({ onSave, onToggleFavourite, onSetDaily, favourited, onClipboardClick, onDelete }) => {
  const handleCommand = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="sticky-toolbar">
      {/* Left Icons */}
      <div className="left-icons">
        <button className="toolbar-button" title="Save" onClick={onSave}>
          <img src={SaveIcon} alt="Save" />
        </button>
        <button className="toolbar-button" title="Clock" onClick={onSetDaily}>
          <img src={ClockIcon} alt="Clock" />
        </button>
        <button className="toolbar-button" title="Delete" onClick={onDelete}>
          <img src = {DeleteIcon} alt="Delete" />
        </button>
      </div>

      {/* Center Formatting Icons */}
      <div className="center-icons">
        <button onClick={() => handleCommand('bold')} className="toolbar-button" title="Bold">
          <img src={BoldIcon} alt="Bold" />
        </button>
        <button onClick={() => handleCommand('italic')} className="toolbar-button" title="Italic">
          <img src={ItalicIcon} alt="Italic" />
        </button>
        <button onClick={() => handleCommand('underline')} className="toolbar-button" title="Underline">
          <img src={UnderlineIcon} alt="Underline" />
        </button>
        <button onClick={() => handleCommand('insertUnorderedList')} className="toolbar-button" title="Bullet">
          <img src={BulletIcon} alt="Bullet" />
        </button>
        <button onClick={() => handleCommand('justifyLeft')} className="toolbar-button" title="Align Left">
          <img src={AlignLeftIcon} alt="Align Left" />
        </button>
        <button onClick={() => handleCommand('justifyCenter')} className="toolbar-button" title="Align Center">
          <img src={AlignCenterIcon} alt="Align Center" />
        </button>
        <button onClick={() => handleCommand('justifyRight')} className="toolbar-button" title="Align Right">
          <img src={AlignRightIcon} alt="Align Right" />
        </button>
        <button onClick={() => handleCommand('justifyFull')} className="toolbar-button" title="Justify">
          <img src={JustifyIcon} alt="Justify" />
        </button>
      </div>

      {/* Right Icons */}
      <div className="right-icons">
        <button className="toolbar-button" title="Clipboard" onClick={onClipboardClick}>
          <img src={ClipboardIcon} alt="Clipboard" />
        </button>
        <button className="toolbar-button" title="Favorite" onClick={onToggleFavourite}>
          <img src={favourited ? HeartIcon : DarkHeartIcon} alt="Favorite" /> {/* Toggle heart icon based on favourited state */}
        </button>
      </div>
    </div>
  );
};

export default StickyToolbar;
