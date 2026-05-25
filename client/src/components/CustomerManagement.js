import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import api from '../api'; // API utility for making requests with token handling

function CustomerManagement({ onLogout }) {
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCustomer, setNewCustomer] = useState({ name: '', mobileNo: '', email: '', password: '', company: '' });

  useEffect(() => {
    fetchCustomers();
    fetchCompanies();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      if (err.response?.status === 401) onLogout();
    }
  };

  const handleAddCustomer = async () => {
    try {
      await api.post('/customers', newCustomer);
      alert("Customer added successfully");
      setShow(false);
      setNewCustomer({ name: '', mobileNo: '', email: '', password: '', company: '' });
      fetchCustomers();
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      else alert(err.response?.data?.error || "Error adding customer");
    }
  };

  return (
    <Layout onLogout={onLogout}>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Customer Management</h2>
        <Button variant="primary" onClick={() => setShow(true)}>+ Add New Customer</Button>
      </div>

      {loading ? (
        <p className="mt-3">Loading customers...</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map(c => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.mobileNo}</td>
                  <td>{c.company?.companyNameEn || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center">No customers found</td></tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mobile No</Form.Label>
              <Form.Control value={newCustomer.mobileNo} onChange={(e) => setNewCustomer({...newCustomer, mobileNo: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={newCustomer.password} onChange={(e) => setNewCustomer({...newCustomer, password: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Select Company</Form.Label>
              <Form.Select value={newCustomer.company} onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}>
                <option value="">Choose a company...</option>
                {companies.map(comp => (
                  <option key={comp._id} value={comp._id}>{comp.companyNameEn}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddCustomer}>Save Customer</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default CustomerManagement;