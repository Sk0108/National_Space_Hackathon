import React, { useState } from 'react';
import './Sidebar.css'; // We'll create this too

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '<' : '>'}
      </button>
      {isOpen && (
        <ul className="sidebar-menu">
          <li>Dashboard</li>
          <li>Cargos</li>
          <li>Settings</li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
