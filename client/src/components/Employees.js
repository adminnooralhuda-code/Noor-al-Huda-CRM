import React, { useEffect, useState } from 'react';
import api from '../api'; // api.js ഉപയോഗിക്കുന്നു
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

function Employees({ onLogout }) { // onLogout പ്രോപ്പ് ചേർത്തു
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
        alert("Employee deleted successfully!");
      } catch (err) {
        console.error("Delete Error:", err);
        if (err.response?.status === 401) onLogout();
        else alert("Failed to delete.");
      }
    }
  };

  return (
    <Layout onLogout={onLogout}>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#2c3e50' }}>Employee List</h2>
          <button 
            onClick={() => navigate('/add-employee')} 
            style={{ padding: '8px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            + Add New Employee
          </button>
        </div>

        {loading ? <p>Loading employees...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Emp ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Designation</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Passport No</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{emp.employeeId}</td>
                  <td style={{ padding: '12px' }}>{emp.name}</td>
                  <td style={{ padding: '12px' }}>{emp.company?.companyNameEn || "No Company"}</td>
                  <td style={{ padding: '12px' }}>{emp.designation}</td>
                  <td style={{ padding: '12px' }}>{emp.passportNo}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => navigate(`/view-employee/${emp._id}`)} style={{ marginRight: '5px', background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>View</button>
                    <button onClick={() => navigate(`/update-employee/${emp._id}`)} style={{ marginRight: '5px', background: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteEmployee(emp._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default Employees;