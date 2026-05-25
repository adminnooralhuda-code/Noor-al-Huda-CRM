import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ onLogout }) { // onLogout props ആയി സ്വീകരിക്കുന്നു
  return (
    <nav className="sidebar">
      <div className="sidebar-menu">
        <h4 className="sidebar-title">Admin Portal</h4>
        <ul>
          <li><Link to="/admin-dashboard">Dashboard</Link></li>
          <li><Link to="/admin/companies">Companies</Link></li>
          <li><Link to="/admin/employees">Employees</Link></li>
          <li><Link to="/admin/users">User Management</Link></li>
        </ul>
      </div>
      
      {/* Logout ബട്ടൺ താഴെ വരുന്നു */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Sidebar;