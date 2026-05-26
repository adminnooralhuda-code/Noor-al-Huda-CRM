import React, { useState } from 'react';
import api from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import loginBg from '../assets/uae-bg.jpg'; 

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
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            if (id) localStorage.setItem('customerId', id);
            setIsLoggedIn(true);
            const from = location.state?.from?.pathname || 
                         (role === 'admin' ? '/admin-dashboard' : role === 'staff' ? '/staff-dashboard' : '/customer-dashboard');
            navigate(from, { replace: true });
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || 'Error occurred.'));
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        page: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, #9fccfa, #0974f1), url(${loginBg})`,
            backgroundBlendMode: 'overlay',
            backgroundSize: 'cover',
            padding: '20px'
        },
        container: {
            display: 'flex',
            maxWidth: '900px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        },
        leftSide: {
            flex: 1,
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#0974f1'
        },
        rightSide: {
            width: '400px',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff'
        },
        input: {
            width: '100%', padding: '15px', margin: '10px 0', border: '1px solid #ddd',
            borderRadius: '15px', fontSize: '1rem'
        },
        button: {
            width: '100%', padding: '15px', marginTop: '20px',
            background: '#0974f1', color: '#fff', border: 'none',
            borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Left Side: Info */}
                <div style={styles.leftSide}>
                    <img src={logo} alt="Logo" style={{ width: '120px', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2.8rem', margin: '0' }}>Noor al Huda</h1>
                    <h2 style={{ fontSize: '1.4rem', color: '#555', margin: '10px 0' }}>Typing and Photocopying Services</h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Advanced Management System</p>
                </div>

                {/* Right Side: Login Form */}
                <div style={styles.rightSide}>
                    <h2 style={{ marginBottom: '20px' }}>Sign In</h2>
                    <form onSubmit={handleLogin}>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;