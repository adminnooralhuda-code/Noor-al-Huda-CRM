import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import Layout from './Layout';
import { getExpiryStatus } from '../utils/dateHelper';

function ExpiryDashboard({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getStatusBadgeStyle = (statusLabel) => {
    switch (statusLabel) {
      case 'Expired': return { backgroundColor: '#ff7675', color: 'white', padding: '5px 10px', borderRadius: '15px' };
      case 'Urgent': return { backgroundColor: '#fd9644', color: 'white', padding: '5px 10px', borderRadius: '15px' };
      case 'Follow up': return { backgroundColor: '#74b9ff', color: 'white', padding: '5px 10px', borderRadius: '15px' };
      default: return { backgroundColor: '#55efc4', color: 'black', padding: '5px 10px', borderRadius: '15px' };
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await api.get('/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error("Error:", err);
        if (err.response?.status === 401) onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [onLogout]);

  // എല്ലാ ഡോക്യുമെന്റുകളെയും ഒന്നിച്ച് എടുത്ത് സോർട്ട് ചെയ്യുന്നു
  const getAllDocumentRows = () => {
    let allDocs = [];
    
    employees.forEach(emp => {
      const docs = [
        { name: 'Passport', expiry: emp.passportExpiry, empId: emp._id, empName: emp.name, company: emp.company?.companyNameEn },
        { name: 'Emirates ID', expiry: emp.emiratesIdExpiry, empId: emp._id, empName: emp.name, company: emp.company?.companyNameEn },
        { name: 'Labour Card', expiry: emp.labourCardExpiry, empId: emp._id, empName: emp.name, company: emp.company?.companyNameEn },
        { name: 'Insurance', expiry: emp.insuranceExpiry, empId: emp._id, empName: emp.name, company: emp.company?.companyNameEn },
        { name: 'ILOE', expiry: emp.iloeExpiry, empId: emp._id, empName: emp.name, company: emp.company?.companyNameEn }
      ];
      
      docs.forEach(doc => {
        if (doc.expiry) allDocs.push(doc);
      });
    });

    // ഇവിടെയാണ് സോർട്ടിംഗ് നടക്കുന്നത് (തീയതി പ്രകാരം)
    return allDocs.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
  };

  const sortedDocs = getAllDocumentRows();

  return (
    <Layout onLogout={onLogout}>
      <div style={{ padding: '20px' }}>
        <h2>Expiry Tracking Dashboard</h2>
        {loading ? (
            <p>Loading data...</p>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
                <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th>Company</th>
                  <th>Document</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {sortedDocs.length > 0 ? (
                  sortedDocs.map((doc, index) => {
                    const status = getExpiryStatus(doc.expiry);
                    return (
                      <tr key={index}>
                        <td style={{ padding: '10px' }}>{doc.empName}</td>
                        <td>{doc.company || "N/A"}</td>
                        <td>{doc.name}</td>
                        <td>{new Date(doc.expiry).toLocaleDateString()}</td>
                        <td><span style={getStatusBadgeStyle(status.label)}>{status.label}</span></td>
                        <td>
                          <button onClick={() => navigate(`/update-employee/${doc.empId}`)} style={{ padding: '5px 10px', cursor: 'pointer' }}>Update</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>No data found.</td></tr>
                )}
            </tbody>
            </table>
        )}
      </div>
    </Layout>
  );
}

export default ExpiryDashboard;