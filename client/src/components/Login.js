import React, { useState } from 'react';
import api from '../api'; 
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import './Login.css'; 

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role, id } = response.data;
            
            console.log("Login Response Data:", response.data); // ഡാറ്റ പരിശോധിക്കാൻ

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            // കൃത്യമായ കീ (customerId) ഉപയോഗിച്ച് സ്റ്റോർ ചെയ്യുന്നു
            if (id) {
                localStorage.setItem('customerId', id);
            }
            
            setIsLoggedIn(true);

            const from = location.state?.from?.pathname || 
                         (role === 'admin' ? '/admin-dashboard' : 
                          role === 'staff' ? '/staff-dashboard' : '/customer-dashboard');
            
            navigate(from, { replace: true });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed.';
            alert('Login failed: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={logo} alt="Company Logo" style={{ width: '150px' }} />
            </div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            </form>
        </div>
    );
}
export default Login;