import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // api.js ഉപയോഗിക്കുന്നു
import Layout from './Layout';
import './Dashboard.css';

function ViewCompany({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/companies/${id}`); // api ഉപയോഗിക്കുന്നു
        setCompany(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id, onLogout]);

  if (loading) return <Layout onLogout={onLogout}><div>Loading company details...</div></Layout>;
  if (!company) return <Layout onLogout={onLogout}><div>Company not found!</div></Layout>;

  return (
    <Layout onLogout={onLogout}>
      <div className="container" style={{ padding: '30px', maxWidth: '1000px', margin: 'auto' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Company Overview</h2>
        
        <div style={{ 
          background: '#ffffff', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)', 
          border: '1px solid #ddd' 
        }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="field-group">
              <label style={{ fontWeight: 'bold', color: '#555' }}>Company Name (EN):</label>
              <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>{company.companyNameEn || 'N/A'}</div>
            </div>
            
            <div className="field-group">
              <label style={{ fontWeight: 'bold', color: '#555' }}>Company Name (AR):</label>
              <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>{company.companyNameAr || 'N/A'}</div>
            </div>

            <div className="field-group">
              <label style={{ fontWeight: 'bold', color: '#555' }}>CN Number:</label>
              <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>{company.companyNumber || 'N/A'}</div>
            </div>

            <div className="field-group">
              <label style={{ fontWeight: 'bold', color: '#555' }}>ICP Card:</label>
              <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>{company.icpCard || 'N/A'}</div>
            </div>

            <div className="field-group">
              <label style={{ fontWeight: 'bold', color: '#555' }}>MOHRE Number:</label>
              <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>{company.mohreNo || 'N/A'}</div>
            </div>

            <div className="field-group">
              <label style={{ fontWeight: 'bold', color: '#555' }}>Activity:</label>
              <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>{company.activity || 'N/A'}</div>
            </div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/admin/companies')} 
              style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Back to List
            </button>
            
            <button 
              onClick={() => navigate(`/update/${id}`)} 
              style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Update Details
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ViewCompany;