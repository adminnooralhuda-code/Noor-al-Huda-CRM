import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Layout.css';

function Layout({ children, onLogout }) {
  const [dateTime, setDateTime] = useState('');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('userName') || 'User'; // ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് പേര് എടുക്കുന്നു

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(`${now.toLocaleDateString('en-GB')} | ${now.toLocaleTimeString()}`);
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <div className="sidebar">
        <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
        </div>
        
        {/* User Profile Section */}
        <div className="user-profile">
            <h3 className="user-name">{userName}</h3>
            <span className="user-role-badge">
                {userRole === 'admin' ? 'Administrator' : 'Staff Member'}
            </span>
        </div>

        <ul className="menu-list">
          <li className="menu-item">
            <Link to={userRole === 'admin' ? '/admin-dashboard' : '/customer-dashboard'} className="menu-link">Dashboard</Link>
          </li>
          {userRole === 'admin' && (
            <>
              <li className="menu-item"><Link to="/admin/companies" className="menu-link">Companies</Link></li>
              <li className="menu-item"><Link to="/admin/employees" className="menu-link">Employees</Link></li>
              <li className="menu-item"><Link to="/admin/users" className="menu-link">User Management</Link></li>
            </>
          )}
        </ul>

        <div className="logout-btn" onClick={handleLogout}>Logout</div>
      </div>

      <div className="main-content">
        <div className="date-display">{dateTime}</div>
        {children}
      </div>
    </div>
  );
}

export default Layout;