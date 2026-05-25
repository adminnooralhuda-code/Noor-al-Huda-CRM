import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // api instance
import Layout from './Layout';
import './Dashboard.css';

const UpdateCompany = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyNameEn: '', companyNameAr: '', companyNumber: '',
        estDate: '', issueDate: '', expiryDate: '',
        licenseExpiry: '', establishmentCardExpiry: '', eChannelExpiry: '', companyInsuranceExpiry: '',
        legalForm: 'L.L.C-S.P.C',
        ownerName: '', ownerRole: '', managerName: '', managerMobile: '',
        activity: '', leaseNo: '', leaseExpiry: '', email: '',
        icpCard: '', mohreNo: '', damanPolicy: '', contactName: '', contactMobile: ''
    });

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get(`/companies/${id}`);
                const data = res.data;
                const dateFields = ['estDate', 'issueDate', 'expiryDate', 'licenseExpiry', 
                                   'establishmentCardExpiry', 'eChannelExpiry', 'companyInsuranceExpiry', 'leaseExpiry'];
                
                let formattedData = { ...data };
                dateFields.forEach(field => {
                    if (data[field]) formattedData[field] = data[field].split('T')[0];
                });
                setFormData(formattedData);
            } catch (err) {
                if (err.response?.status === 401) onLogout();
            }
        };
        fetchCompany();
    }, [id, onLogout]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/companies/update/${id}`, formData);
            alert("കമ്പനി ഡീറ്റെയിൽസ് വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!");
            navigate('/admin/companies');
        } catch (err) {
            if (err.response?.status === 401) onLogout();
            else alert("അപ്‌ഡേറ്റ് പരാജയപ്പെട്ടു.");
        }
    };

    return (
        <Layout onLogout={onLogout}>
            <div className="form-container">
                <h2>Update Company - Step {step} of 4</h2>
                
                {step === 1 && (
                    <div className="form-step">
                        <label>Company Name (English):</label>
                        <input name="companyNameEn" value={formData.companyNameEn} onChange={handleInputChange} />
                        <label>Company Name (Arabic):</label>
                        <input name="companyNameAr" value={formData.companyNameAr} onChange={handleInputChange} />
                        <label>Company Number (CN):</label>
                        <input name="companyNumber" value={formData.companyNumber} onChange={handleInputChange} />
                        <h3>Expiry Details</h3>
                        <label>License Expiry:</label>
                        <input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleInputChange} />
                        <label>Establishment Card Expiry:</label>
                        <input type="date" name="establishmentCardExpiry" value={formData.establishmentCardExpiry} onChange={handleInputChange} />
                        <label>E-Channel Expiry:</label>
                        <input type="date" name="eChannelExpiry" value={formData.eChannelExpiry} onChange={handleInputChange} />
                        <label>Company Insurance Expiry:</label>
                        <input type="date" name="companyInsuranceExpiry" value={formData.companyInsuranceExpiry} onChange={handleInputChange} />
                        <button onClick={() => setStep(2)}>Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step">
                        <label>Legal Form:</label>
                        <select name="legalForm" value={formData.legalForm} onChange={handleInputChange}>
                            <option value="L.L.C-S.P.C">L.L.C-S.P.C</option>
                            <option value="Limited Liability Company">Limited Liability Company</option>
                            <option value="Establishment">Establishment</option>
                        </select>
                        <label>Owner/Partner Name:</label>
                        <input name="ownerName" value={formData.ownerName} onChange={handleInputChange} />
                        <label>Manager Name:</label>
                        <input name="managerName" value={formData.managerName} onChange={handleInputChange} />
                        <label>Manager Mobile:</label>
                        <input name="managerMobile" value={formData.managerMobile} onChange={handleInputChange} />
                        <button onClick={() => setStep(1)}>Back</button>
                        <button onClick={() => setStep(3)}>Next</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step">
                        <label>Activity:</label>
                        <input name="activity" value={formData.activity} onChange={handleInputChange} />
                        <label>Lease Contract Number:</label>
                        <input name="leaseNo" value={formData.leaseNo} onChange={handleInputChange} />
                        <label>Lease Expiry Date:</label>
                        <input type="date" name="leaseExpiry" value={formData.leaseExpiry} onChange={handleInputChange} />
                        <label>Company Email:</label>
                        <input name="email" value={formData.email} onChange={handleInputChange} />
                        <button onClick={() => setStep(2)}>Back</button>
                        <button onClick={() => setStep(4)}>Next</button>
                    </div>
                )}

                {step === 4 && (
                    <div className="form-step">
                        <label>Establishment Card No:</label>
                        <input name="icpCard" value={formData.icpCard} onChange={handleInputChange} />
                        <label>Mohre Number:</label>
                        <input name="mohreNo" value={formData.mohreNo} onChange={handleInputChange} />
                        <label>Daman Policy Number:</label>
                        <input name="damanPolicy" value={formData.damanPolicy} onChange={handleInputChange} />
                        <button onClick={() => setStep(3)}>Back</button>
                        <button className="submit-btn" onClick={handleUpdate}>Update All Details</button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UpdateCompany;