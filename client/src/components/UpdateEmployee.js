import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // api.js ഉപയോഗിക്കുന്നു
import Layout from './Layout';

function UpdateEmployee({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    passportNumber: '',
    passportExpiry: '',
    emiratesId: '',
    emiratesIdExpiry: '',
    labourCardNo: '',
    labourCardExpiry: '',
    insuranceExpiry: '',
    iloeExpiry: '',
    company: ''
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        const data = res.data;
        const dateFields = ['passportExpiry', 'emiratesIdExpiry', 'labourCardExpiry', 'insuranceExpiry', 'iloeExpiry'];
        
        let formattedData = { ...data };
        dateFields.forEach(field => {
          if (data[field]) formattedData[field] = data[field].split('T')[0];
        });
        
        setEmployee({
          ...formattedData,
          company: data.company?._id || ''
        });
      } catch (err) {
        console.error("Error fetching employee:", err);
        if (err.response?.status === 401) onLogout();
      }
    };
    fetchEmployee();
  }, [id, onLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.put(`/employees/update/${id}`, employee);
        alert("Employee updated successfully!");
        navigate('/admin/employees'); 
    } catch (err) {
        console.error("Error updating:", err);
        if (err.response?.status === 401) onLogout();
        else alert("അപ്‌ഡേറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല, ദയവായി വീണ്ടും ശ്രമിക്കുക.");
    }
  };

  return (
    <Layout onLogout={onLogout}>
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <h2>Update Employee Details</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <label>Employee Name:</label>
          <input type="text" value={employee.name} onChange={(e) => setEmployee({...employee, name: e.target.value})} />
          
          <label>Passport Number:</label>
          <input type="text" value={employee.passportNumber} onChange={(e) => setEmployee({...employee, passportNumber: e.target.value})} />
          
          <label>Passport Expiry:</label>
          <input type="date" value={employee.passportExpiry} onChange={(e) => setEmployee({...employee, passportExpiry: e.target.value})} />
          
          <label>Emirates ID:</label>
          <input type="text" value={employee.emiratesId} onChange={(e) => setEmployee({...employee, emiratesId: e.target.value})} />

          <label>Emirates ID Expiry:</label>
          <input type="date" value={employee.emiratesIdExpiry} onChange={(e) => setEmployee({...employee, emiratesIdExpiry: e.target.value})} />

          <label>Labour Card Number:</label>
          <input type="text" value={employee.labourCardNo} onChange={(e) => setEmployee({...employee, labourCardNo: e.target.value})} />

          <label>Labour Card Expiry:</label>
          <input type="date" value={employee.labourCardExpiry} onChange={(e) => setEmployee({...employee, labourCardExpiry: e.target.value})} />
          
          <label>Insurance Expiry:</label>
          <input type="date" value={employee.insuranceExpiry} onChange={(e) => setEmployee({...employee, insuranceExpiry: e.target.value})} />
          
          <label>ILOE Expiry:</label>
          <input type="date" value={employee.iloeExpiry} onChange={(e) => setEmployee({...employee, iloeExpiry: e.target.value})} />
          
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Update Employee
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default UpdateEmployee;