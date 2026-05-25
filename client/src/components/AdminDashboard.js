import React, { useState, useEffect } from 'react';
import api from '../api'; 
import Layout from './Layout';
import Dashboard from './Dashboard'; 

function AdminDashboard({ onLogout }) {
  const [expiryList, setExpiryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpiryData = async () => {
      try {
        setLoading(true);
        // ബാക്കെൻഡ് അപ്‌ഡേറ്റ് ചെയ്തതുകൊണ്ട് റൂട്ട് പാത്ത് കൃത്യമാണെന്ന് ഉറപ്പുവരുത്തുക
        const res = await api.get('/companies/expiry-list'); 
        
        // ബാക്കെൻഡ് റെസ്പോൺസ് ചെക്ക് ചെയ്യുന്നു
        // റെസ്പോൺസ് നേരിട്ട് അറേ ആണോ അതോ ഒബ്ജക്റ്റിനുള്ളിൽ ഉള്ളതാണോ എന്ന് ഉറപ്പാക്കാൻ
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setExpiryList(data);
        
      } catch (err) {
        console.error("Error fetching expiry list:", err);
        // 401 എറർ ആണെങ്കിൽ മാത്രം ലോഗൗട്ട് ചെയ്യുക
        if (err.response?.status === 401) {
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpiryData();
  }, [onLogout]); // Dependency-ൽ onLogout ചേർക്കുന്നത് നല്ലതാണ്

  return (
    <Layout onLogout={onLogout}>
      <Dashboard /> 

      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-4">Upcoming Expiry Tracking (Top 15)</h4>
          {loading ? (
            <p>Loading alerts...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expiryList.length > 0 ? (
                    expiryList.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name || 'N/A'}</td> 
                        <td>{item.type || 'N/A'}</td>
                        <td>
                          {item.expiryDate 
                            ? new Date(item.expiryDate).toLocaleDateString('en-GB') // 'en-GB' ഫോർമാറ്റ് കൂടുതൽ ക്ലിയർ ആണ്
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No upcoming expiries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;