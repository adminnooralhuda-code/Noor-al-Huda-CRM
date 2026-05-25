import React, { useState, useEffect } from 'react';
import api from '../api'; 
import Layout from './Layout';

function CustomerDashboard({ onLogout }) {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const customerId = localStorage.getItem('customerId'); 
      
      // ID വാലിഡ് ആണോ എന്ന് ഉറപ്പുവരുത്തുക
      if (!customerId || customerId === 'undefined' || customerId === 'null') {
        console.error("No valid Customer ID found in Storage");
        setError("Session expired or invalid login. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/customers/profile/${customerId}`);
        setCustomerData(res.data);
        setError(null);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        if (err.response?.status === 401) {
          onLogout(); 
        } else {
          setError("Failed to load customer data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [onLogout]);

  if (loading) {
    return (
      <Layout onLogout={onLogout}>
        <div className="container mt-4">Loading your dashboard...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout onLogout={onLogout}>
        <div className="container mt-4 alert alert-danger">{error}</div>
      </Layout>
    );
  }

  if (!customerData) {
    return (
      <Layout onLogout={onLogout}>
        <div className="container mt-4">No data found!</div>
      </Layout>
    );
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="container mt-4">
        <h2>Welcome, {customerData.name || 'User'}</h2>
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h4>My Company Info</h4>
              <hr />
              <p><strong>Company (EN):</strong> {customerData.company?.companyNameEn || 'N/A'}</p>
              <p><strong>Company (AR):</strong> {customerData.company?.companyNameAr || 'N/A'}</p>
              <p><strong>Email:</strong> {customerData.email || 'N/A'}</p>
              <p><strong>Mobile:</strong> {customerData.mobileNo || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CustomerDashboard;