import React, { useState, useEffect } from 'react';
import api from '../api'; // api.js instance
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

function AddEmployee({ onLogout }) {
  const [emp, setEmp] = useState({});
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        setCompanies(res.data);
      } catch (err) {
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchCompanies();
  }, [onLogout]);

  const handleChange = (e) => {
    setEmp({ ...emp, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emp.company || emp.company === "Select Company") {
        alert("Please select a company!");
        return;
    }
    try {
        await api.post('/employees/add', emp);
        alert("Employee Added Successfully!");
        navigate('/admin/employees');
    } catch (err) { 
        console.error("Error:", err.response?.data); 
        if (err.response?.status === 401) onLogout();
        else alert("Failed to save.");
    }
  };

  const fields = [
    { label: 'Company', name: 'company', type: 'select' },
    { label: 'Name', name: 'name' },
    { label: 'Designation', name: 'designation' },
    { label: 'Nationality', name: 'nationality' },
    { label: 'Passport No', name: 'passportNo' },
    { label: 'Passport Expiry', name: 'passportExpiry', type: 'date' },
    { label: 'Emirates ID No', name: 'emiratesIdNo' },
    { label: 'Emirates ID Expiry', name: 'emiratesIdExpiry', type: 'date' },
    { label: 'Labour Card No', name: 'labourCardNo' },
    { label: 'Labour Card Expiry', name: 'labourCardExpiry', type: 'date' },
    { label: 'ILOE Expiry', name: 'iloeExpiry', type: 'date' },
    { label: 'Insurance', name: 'insurance' },
    { label: 'Insurance Expiry', name: 'insuranceExpiry', type: 'date' },
    { label: 'Date of Birth', name: 'dob', type: 'date' },
    { label: 'Mobile No', name: 'mobileNo' },
    { label: 'Email', name: 'email' }
  ];

  return (
    <Layout onLogout={onLogout}>
      <div style={{ padding: '20px', background: '#fff', borderRadius: '10px' }}>
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {fields.map((field) => (
            <div key={field.name}>
              <label style={{ fontWeight: 'bold' }}>{field.label}</label>
              {field.type === 'select' ? (
                <select name={field.name} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option>Select Company</option>
                  {companies.map(c => <option key={c._id} value={c._id}>{c.companyNameEn}</option>)}
                </select>
              ) : (
                <input type={field.type || 'text'} name={field.name} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              )}
            </div>
          ))}
          <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Save Employee
          </button>
        </form>
      </div>
    </Layout>
  );
}
export default AddEmployee;