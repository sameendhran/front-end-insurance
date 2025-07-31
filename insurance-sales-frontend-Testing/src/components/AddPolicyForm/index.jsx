// src/components/AddPolicyForm/index.jsx
import React, { useState, useEffect } from 'react';
import { createPolicy } from '../../services/policyService';
import { getAllCustomers } from '../../services/customerService';
import { getAllCoverages } from '../../services/coverageService';
import { getAllPolicyTypes } from '../../services/policyTypeService';

import "./style.css";

const AddPolicyForm = ({ onPolicyAdded }) => {
    const [formData, setFormData] = useState({
        // policyNumber has been removed as it's now backend generated
        premium: '',
        coverageId: '',
        policyTypeId: '',
        customerId: ''
    });
    const [customers, setCustomers] = useState([]);
    const [coverages, setCoverages] = useState([]);
    const [policyTypes, setPolicyTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching initial form data (customers, coverages, policy types)...");
                const fetchedCustomers = await getAllCustomers();
                const fetchedCoverages = await getAllCoverages();
                const fetchedPolicyTypes = await getAllPolicyTypes();

                setCustomers(fetchedCustomers || []);
                setCoverages(fetchedCoverages || []);
                setPolicyTypes(fetchedPolicyTypes || []);
                console.log("Fetched Customers:", fetchedCustomers);
                console.log("Fetched Coverages:", fetchedCoverages);
                console.log("Fetched Policy Types:", fetchedPolicyTypes);

            } catch (err) {
                setError('Failed to load form data: ' + err.message);
                console.error('Error during initial data fetch:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Crucial: Prevents default form submission (page reload)
        setError(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        // Updated simple validation: policyNumber check removed
        if (!formData.premium || !formData.coverageId || !formData.policyTypeId || !formData.customerId) {
            setError('Please fill in all required fields.');
            return;
        }

        console.log('Attempting to add policy with formData:', formData); // Log data before sending

        try {
            const newPolicy = await createPolicy(formData);
            console.log('Policy created successfully:', newPolicy); // Log success response

            // newPolicy should now include the backend-generated policyNumber
            setSuccessMessage('Policy added successfully! Policy Number: ' + newPolicy.policyNumber);
            if (onPolicyAdded) {
                onPolicyAdded(newPolicy);
            }
            // Reset form fields
            setFormData({
                premium: '',
                coverageId: '',
                policyTypeId: '',
                customerId: ''
            });
        } catch (err) {
            console.error('Error caught in AddPolicyForm handleSubmit:', err); // Log the error object
            setError('Failed to add policy: ' + (err.message || "An unknown error occurred."));
        }
    };

    if (loading) return <div className="loading-message">Loading form data...</div>;

    return (
        <div className="add-policy-form-container">
            <h2>Add New Policy</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                {/* Policy Number Input - REMOVED from here */}

                <div className="form-group">
                    <label htmlFor="customerId">Customer:</label>
                    <select
                        id="customerId"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                            <option key={customer.customerId} value={customer.customerId}>
                                {customer.firstName} {customer.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="coverageId">Coverage Type:</label>
                    <select
                        id="coverageId"
                        name="coverageId"
                        value={formData.coverageId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Coverage</option>
                        {coverages.map(coverage => (
                            <option key={coverage.coverageId} value={coverage.coverageId}>
                                {coverage.coverageName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="policyTypeId">Policy Type:</label>
                    <select
                        id="policyTypeId"
                        name="policyTypeId"
                        value={formData.policyTypeId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Policy Type</option>
                        {policyTypes.map(type => (
                            <option key={type.typeId} value={type.typeId}>
                                {type.typeName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="premium">Premium Amount:</label>
                    <input
                        type="number"
                        id="premium"
                        name="premium"
                        value={formData.premium}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Add Policy</button>
            </form>
        </div>
    );
};

export default AddPolicyForm;