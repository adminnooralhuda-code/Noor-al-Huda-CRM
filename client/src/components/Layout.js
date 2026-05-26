import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Layout({ children, onLogout }) {
  const [dateTime, setDateTime] = useState('');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

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

  const strokeColor = '#5d0915'; // Darker stroke color

  const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#f4f7f6' },
    sidebar: { 
      width: '260px', 
      background: 'linear-gradient(180deg, #880d1e 0%, #dd2d4a 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      position: 'sticky', 
      top: 0,
      color: '#fff' 
    },
    logoContainer: { padding: '30px 20px', textAlign: 'center' },
    logoCircle: { 
      width: '90px', 
      height: '90px', 
      borderRadius: '50%', 
      border: `4px solid ${strokeColor}`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      margin: '0 auto',
      backgroundColor: '#ffffff' // ലോഗോയ്ക്ക് ചുറ്റുമുള്ള സർക്കിൾ വൈറ്റ്
    },
    title: { textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', marginTop: '15px', color: '#fff' },
    menuList: { listStyle: 'none', padding: '10px 15px', flexGrow: 1, margin: 0 },
    menuItem: { 
      borderBottom: `1px solid ${strokeColor}`, 
      padding: '5px 0' 
    },
    link: { 
      display: 'block', 
      padding: '14px 10px', 
      color: '#fff', 
      textDecoration: 'none', 
      fontWeight: '500' 
    },
    logout: { 
      cursor: 'pointer', 
      color: '#fff', 
      fontWeight: '700', 
      padding: '15px', 
      margin: '20px',
      textAlign: 'center',
      backgroundColor: strokeColor, 
      borderRadius: '8px',
      transition: '0.3s'
    },
    mainContent: { flex: 1, padding: '30px' },
    dateDisplay: { textAlign: 'right', marginBottom: '20px', color: '#555', fontWeight: '600' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
            <div style={styles.logoCircle}>
                <img src={logo} alt="Logo" style={{ width: '60px', borderRadius: '50%' }} />
            </div>
        </div>
        <h3 style={styles.title}>{userRole === 'admin' ? 'Admin Portal' : 'Customer Portal'}</h3>

        <ul style={styles.menuList}>
          <li style={styles.menuItem}>
            <Link to={userRole === 'admin' ? '/admin-dashboard' : '/customer-dashboard'} style={styles.link}>
              Dashboard
            </Link>
          </li>
          {userRole === 'admin' && (
            <>
              <li style={styles.menuItem}><Link to="/admin/companies" style={styles.link}>Companies</Link></li>
              <li style={styles.menuItem}><Link to="/admin/employees" style={styles.link}>Employees</Link></li>
              <li style={styles.menuItem}><Link to="/admin/users" style={styles.link}>User Management</Link></li>
            </>
          )}
        </ul>

        <div 
          style={styles.logout} 
          onClick={handleLogout}
          onMouseOver={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.color = strokeColor; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = strokeColor; e.target.style.color = '#fff'; }}
        >
          Logout
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.dateDisplay}>{dateTime}</div>
        {children}
      </div>
    </div>
  );
}

export default Layout;