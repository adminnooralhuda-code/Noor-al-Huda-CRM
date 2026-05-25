import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // api.js ഉപയോഗിക്കുന്നു
import Layout from './Layout';

function ViewEmployee({ onLogout }) {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
        if (err.response?.status === 401) onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, onLogout]);

  if (loading) return <Layout onLogout={onLogout}><div style={{padding: '20px'}}>Loading details...</div></Layout>;
  if (!employee) return <Layout onLogout={onLogout}><div style={{padding: '20px'}}>Employee not found!</div></Layout>;

  return (
    <Layout onLogout={onLogout}>
      <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>Employee Details</h2>
        <div style={{ lineHeight: '2.5' }}>
            <p><strong>Employee ID:</strong> {employee.employeeId || 'N/A'}</p>
            <p><strong>Name:</strong> {employee.name || 'N/A'}</p>
            <p><strong>Company: </strong> {employee.company?.companyNameEn || "No Company"}</p>
            <p><strong>Designation:</strong> {employee.designation || 'N/A'}</p>
            <p><strong>Passport No:</strong> {employee.passportNo || 'N/A'}</p>
        </div>
        
        <button 
            onClick={() => navigate('/admin/employees')} 
            style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Back to List
        </button>
      </div>
    </Layout>
  );
}

export default ViewEmployee;