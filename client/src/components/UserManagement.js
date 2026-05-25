import React, { useState, useEffect } from 'react';
import api from '../api'; // axios-ന് പകരം നമ്മുടെ api instance ഉപയോഗിക്കുക
import Layout from './Layout';
import { Modal, Button, Form } from 'react-bootstrap';

function UserManagement({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [show, setShow] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'customer', company: '' });

  useEffect(() => {
    fetchData();
  }, []);

  // ഒരേ സമയം ഡാറ്റ ഫെച്ച് ചെയ്യാൻ
  const fetchData = async () => {
    try {
      const [usersRes, companiesRes] = await Promise.all([
        api.get('/users'),
        api.get('/companies')
      ]);
      setUsers(usersRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) onLogout();
    }
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        role: formData.role,
        company: formData.role === 'customer' && formData.company !== "" ? formData.company : null
      };

      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, dataToSend);
        alert("User updated successfully");
      } else {
        const newUserData = { ...formData, company: dataToSend.company };
        await api.post('/users/add', newUserData);
        alert("User added successfully");
      }
      closeModal();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error processing request");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) onLogout();
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ 
      email: user.email, 
      role: user.role, 
      company: user.company?._id || '' 
    });
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'customer', company: '' });
  };

  return (
    <Layout onLogout={onLogout}>
      <div className="d-flex justify-content-between align-items-center">
        <h2>User Management</h2>
        <Button variant="primary" onClick={() => setShow(true)}>+ Add New User</Button>
      </div>

      <table className="table mt-3">
        <thead className="table-dark">
          <tr><th>Email</th><th>Role</th><th>Company</th><th>Action</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.company?.companyNameEn || "N/A"}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(user)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deleteUser(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {!editingUser && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </Form.Group>
              </>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            {formData.role === 'customer' && (
              <Form.Group className="mb-3">
                <Form.Label>Assign Company</Form.Label>
                <Form.Select value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}>
                  <option value="">Select a company</option>
                  {companies.map(c => <option key={c._id} value={c._id}>{c.companyNameEn}</option>)}
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>{editingUser ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}
export default UserManagement;