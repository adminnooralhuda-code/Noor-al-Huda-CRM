import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Companies from './components/Companies';
import AddCompany from './components/AddCompany';
import ViewCompany from './components/ViewCompany';
import UpdateCompany from './components/UpdateCompany';
import Employees from './components/Employees';
import AddEmployee from './components/AddEmployee';
import ViewEmployee from './components/ViewEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import ExpiryDashboard from './components/ExpiryDashboard';
import UserManagement from './components/UserManagement';
import CustomerManagement from './components/CustomerManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import SalaryCertificate from './components/services/SalaryCertificate';
import { Buffer } from 'buffer'; // ഇത് ഇൻസ്റ്റാൾ ചെയ്ത ശേഷം ഇംപോർട്ട് ചെയ്യുക

// വിൻഡോ ഒബ്‌ജക്റ്റിലേക്ക് ബഫർ ആഡ് ചെയ്യുന്നു
window.Buffer = Buffer;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // പേജ് ലോഡ് ആകുമ്പോൾ സ്റ്റേറ്റ് സെറ്റ് ചെയ്യുക
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Root path logic */}
          <Route path="/" element={
            isLoggedIn ? (
              localStorage.getItem('role') === 'admin' ? 
              <Navigate to="/admin-dashboard" replace /> : <Navigate to="/customer-dashboard" replace />
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute roleRequired="admin"><AdminDashboard onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/admin/companies" element={<ProtectedRoute roleRequired="admin"><Companies /></ProtectedRoute>} />
          <Route path="/add-company" element={<ProtectedRoute roleRequired="admin"><AddCompany /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute roleRequired="admin"><Employees /></ProtectedRoute>} />
          <Route path="/add-employee" element={<ProtectedRoute roleRequired="admin"><AddEmployee /></ProtectedRoute>} />
          <Route path="/admin/expiry" element={<ProtectedRoute roleRequired="admin"><ExpiryDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roleRequired="admin"><UserManagement onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/customer-management" element={<ProtectedRoute roleRequired="admin"><CustomerManagement onLogout={handleLogout} /></ProtectedRoute>} />
    
          {/* View/Update Routes */}
          <Route path="/view/:id" element={<ProtectedRoute><ViewCompany /></ProtectedRoute>} />
          <Route path="/update/:id" element={<ProtectedRoute roleRequired="admin"><UpdateCompany /></ProtectedRoute>} />
          <Route path="/view-employee/:id" element={<ProtectedRoute><ViewEmployee /></ProtectedRoute>} />
          <Route path="/update-employee/:id" element={<ProtectedRoute roleRequired="admin"><UpdateEmployee /></ProtectedRoute>} />

          <Route path="/salary-certificate" element={<ProtectedRoute roleRequired="admin"><SalaryCertificate /></ProtectedRoute>} />

          {/* Customer Route */}
          <Route path="/customer-dashboard" element={<ProtectedRoute roleRequired="customer"><CustomerDashboard onLogout={handleLogout} /></ProtectedRoute>} />
          


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;