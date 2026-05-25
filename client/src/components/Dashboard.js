import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // നിങ്ങളുടെ അപ്‌ഡേറ്റ് ചെയ്ത Axios instance ഇംപോർട്ട് ചെയ്യുക

function Dashboard() {
  const [stats, setStats] = useState({ empCount: 0, compCount: 0, expiryCount: 0, userCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Interceptor ഉള്ളതുകൊണ്ട് ഇവിടെ headers കൊടുക്കേണ്ടതില്ല
        const response = await api.get('/users/stats'); 
        
        setStats(response.data);
      } catch (err) {
        console.error('API Error:', err);
        // Unauthorized ആണെങ്കിൽ ലോഗിൻ പേജിലേക്ക് വിടുക
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px',
        marginTop: '20px' 
      }}>
        
        {/* Total Employees */}
        <div style={{ padding: '20px', background: '#3498db', color: 'white', borderRadius: '8px' }}>
          <h3>Total Employees</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.empCount}</p>
        </div>

        {/* Total Companies */}
        <div style={{ padding: '20px', background: '#2ecc71', color: 'white', borderRadius: '8px' }}>
          <h3>Total Companies</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.compCount}</p>
        </div>

        {/* Expiry Alerts */}
        <div 
          onClick={() => navigate('/admin/expiry')} 
          style={{ 
            padding: '20px', background: '#f12020', color: 'white', borderRadius: '8px', cursor: 'pointer',
            transition: 'transform 0.2s' 
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3>Expiry Alerts</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.expiryCount}</p>
          <p style={{ fontSize: '12px' }}>Documents expiring soon</p>
        </div>

        {/* User Management */}
        <div 
          onClick={() => navigate('/admin/users')} 
          style={{ 
            padding: '20px', background: '#9b59b6', color: 'white', borderRadius: '8px', cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3>User Management</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.userCount}</p>
          <p style={{ fontSize: '12px' }}>Manage System Users</p>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;