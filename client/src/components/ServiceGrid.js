import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceGrid.css'; // സ്റ്റൈലിംഗിനായി

const ServiceGrid = () => {
    const navigate = useNavigate();

    const services = [
        { name: 'Salary Certificate', path: '/salary-certificate' },
        { name: 'Job Offer Letter', path: '/offer-letter' },
        { name: 'DAMAN Insurance', path: '/daman' },
        { name: 'MOA / POA Making', path: '/moa-poa' },
        { name: 'Tenancy Contract', path: '/tenancy-contract', special: true }
    ];

    return (
        <div className="service-grid">
            {services.map((service, index) => (
                <button 
                    key={index} 
                    className={`service-card ${service.special ? 'green-border' : ''}`}
                    onClick={() => navigate(service.path)}
                >
                    {service.name}
                </button>
            ))}
        </div>
    );
};

export default ServiceGrid;