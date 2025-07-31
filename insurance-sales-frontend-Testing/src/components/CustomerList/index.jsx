// src/components/CustomerList/index.jsx

import React, { useEffect, useState } from 'react';
import { getAllCustomers } from '../../services/customerService';
import './style.css';

// Props: onAddCustomerClick is removed, only onEditCustomerClick remains
function CustomerList({ onEditCustomerClick }) { // UPDATED PROPS
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err || 'Failed to fetch customers.');
      console.error("Error in CustomerList component:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-message">Loading customers...</div>
    );
  }

  if (error) {
    return (
      <div className="customer-error-message">
        Error: {error}
        <button
          onClick={fetchCustomers}
          className="customer-retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="customer-list-header-row">
        <h2 className="customer-list-title">Customer List</h2>
        {/* THE "Add New Customer" BUTTON IS REMOVED FROM HERE */}
      </div>

      {customers.length === 0 ? (
        <p className="customer-message">No customers found. Use the dropdown to add a new one!</p>
      ) : (
        <div className="customer-table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.customerId}</td>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>{customer.gender}</td>
                  <td>{customer.dob}</td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.cityName}</td>
                  <td className="customer-actions-cell">
                    <button
                      onClick={() => onEditCustomerClick(customer.customerId)}
                      className="customer-edit-button"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerList;