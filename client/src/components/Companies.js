import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // api.js ഉപയോഗിക്കുന്നു
import Layout from './Layout';
import './Companies.css';

function Companies({ onLogout }) {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      // 401 Unauthorized ആണെങ്കിൽ ലോഗൗട്ട് ചെയ്യുക
      if (err.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout onLogout={onLogout}><div className="container">Loading companies...</div></Layout>;

  return (
    <Layout onLogout={onLogout}>
      <div className="container">
        <h2>Company List</h2>
        <button className="add-btn" onClick={() => navigate('/add-company')}>
          + Add New Company
        </button>

        <table className="company-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name And Code</th>
              <th>Details (CN/Est/Mohre)</th>
              <th>Expiry Dates</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, index) => (
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>
                  <strong>Code:</strong> {c.companyCode || 'N/A'}<br />
                  {c.companyNameEn}<br />
                  {c.companyNameAr}
                </td>
                <td>
                  <div><strong>CN:</strong> {c.companyNumber || 'N/A'}</div>
                  <div><strong>Est.Card:</strong> {c.icpCard || 'N/A'}</div>
                  <div><strong>Mohre:</strong> {c.mohreNo || 'N/A'}</div>
                </td>
                <td>
                  <div><strong>License:</strong> {c.licenseExpiry ? new Date(c.licenseExpiry).toLocaleDateString() : 'N/A'}</div>
                  <div><strong>Est:</strong> {c.establishmentCardExpiry ? new Date(c.establishmentCardExpiry).toLocaleDateString() : 'N/A'}</div>
                  <div><strong>E-Channel:</strong> {c.eChannelExpiry ? new Date(c.eChannelExpiry).toLocaleDateString() : 'N/A'}</div>
                </td>
                <td>
                  <div className="action-btns">
                    <button onClick={() => navigate(`/view/${c._id}`)}>VIEW</button>
                    <button onClick={() => navigate(`/update/${c._id}`)}>UPDATE</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Companies;