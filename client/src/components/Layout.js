import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // ലോഗോ പാത്ത് ശരിയാണെന്ന് ഉറപ്പാക്കുക
import './Layout.css'; 

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', background: '#2c3e50', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div className="logo-container">
            <img src={logo} alt="Company Logo" style={{ width: '100%' }} />
        </div>
        
        <h3 style={{ textAlign: 'center', marginTop: '10px' }}>
            {userRole === 'admin' ? 'Admin Portal' : 'Customer Portal'}
        </h3>

        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px', flexGrow: 1 }}>
          <li style={{ marginBottom: '15px' }}>
            <Link to={userRole === 'admin' ? '/admin-dashboard' : '/customer-dashboard'} style={{ color: '#fff', textDecoration: 'none' }}>
                {userRole === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
            </Link>
          </li>

          {userRole === 'admin' && (
            <>
              <li style={{ marginBottom: '15px' }}><Link to="/admin/companies" style={{ color: '#fff', textDecoration: 'none' }}>Companies</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/admin/employees" style={{ color: '#fff', textDecoration: 'none' }}>Employees</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/admin/users" style={{ color: '#fff', textDecoration: 'none' }}>User Management</Link></li>
            </>
          )}
        </ul>

        <div style={{ cursor: 'pointer', color: '#ff7675', fontWeight: 'bold', marginTop: 'auto' }} onClick={handleLogout}>
          Logout
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', background: '#ecf0f1' }}>
        <div style={{ textAlign: 'right', marginBottom: '10px', color: '#555', fontWeight: '600' }}>{dateTime}</div>
        {children}
      </div>
    </div>
  );
}

export default Layout; // ഇത് നിർബന്ധമാണ്