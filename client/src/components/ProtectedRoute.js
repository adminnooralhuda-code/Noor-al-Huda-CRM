import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  // ടോക്കൺ ഇല്ലെങ്കിൽ ലോഗിൻ പേജിലേക്ക്
  if (!token) {
    // ലോഗിൻ ചെയ്ത ശേഷം പഴയ പേജിലേക്ക് തന്നെ പോകാൻ 'state' സേവ് ചെയ്യുന്നു
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // റോൾ സ്പെസിഫിക് ആണെങ്കിൽ മാത്രം ചെക്ക് ചെയ്യുക
  // ലോഗിൻ ചെയ്ത യൂസർ തെറ്റായ റൂട്ടിൽ ആണെങ്കിൽ അവരെ അവരുടെ ഡാഷ്‌ബോർഡിലേക്ക് വിടുക
  if (roleRequired && userRole !== roleRequired) {
    const dashboardPath = userRole === 'admin' ? '/admin-dashboard' :
                          userRole === 'staff' ? '/staff-dashboard' : '/customer-dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;