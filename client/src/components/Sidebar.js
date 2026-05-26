import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function Sidebar({ onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Modern Clean Styles
  const styles = {
    sidebar: {
      width: '260px',
      height: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #eef2f7',
      position: 'fixed',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      zIndex: 1000
    },
    header: { padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid #f8fafc' },
    logo: { width: '100px', marginBottom: '15px' },
    title: { fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', margin: 0 },
    menu: { flexGrow: 1, padding: '20px 15px' },
    list: { listStyle: 'none', padding: 0 },
    item: { marginBottom: '10px' },
    link: (active) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '14px 20px',
      borderRadius: '10px',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s',
      backgroundColor: active ? '#4f46e5' : 'transparent',
      color: active ? '#ffffff' : '#64748b',
    }),
    footer: { padding: '20px', borderTop: '1px solid #f1f5f9' },
    logoutBtn: {
      background: '#fee2e2',
      color: '#ef4444',
      border: 'none',
      padding: '12px',
      width: '100%',
      borderRadius: '10px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: '0.3s'
    }
  };

  return (
    <nav style={styles.sidebar}>
      <div style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h4 style={styles.title}>Noor-Al-Huda</h4>
      </div>
      
      <div style={styles.menu}>
        <ul style={styles.list}>
          <li style={styles.item}><Link to="/admin-dashboard" style={styles.link(isActive('/admin-dashboard'))}>Dashboard</Link></li>
          <li style={styles.item}><Link to="/admin/companies" style={styles.link(isActive('/admin/companies'))}>Companies</Link></li>
          <li style={styles.item}><Link to="/admin/employees" style={styles.link(isActive('/admin/employees'))}>Employees</Link></li>
          <li style={styles.item}><Link to="/admin/users" style={styles.link(isActive('/admin/users'))}>Users</Link></li>
        </ul>
      </div>
      
      <div style={styles.footer}>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Sidebar;