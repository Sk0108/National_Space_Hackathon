import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button onClick={toggleSidebar} className="toggle-btn">
          {collapsed ? '☰' : '×'}
        </button>
        {!collapsed && (
          <ul>
            <li>Dashboard</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        )}
      </div>
      <div className="main-content">
        <Dashboard />
      </div>
    </div>
  );
}



export default App;


