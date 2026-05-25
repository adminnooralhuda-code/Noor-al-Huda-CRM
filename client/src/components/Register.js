import React, { useState } from 'react';
import api from '../api';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', formData);
      alert('Admin user created successfully!');
    } catch (error) {
      alert('Registration failed: ' + error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Create Admin User</h2>
      <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
      <button type="submit">Create Admin</button>
    </form>
  );
}

export default Register;