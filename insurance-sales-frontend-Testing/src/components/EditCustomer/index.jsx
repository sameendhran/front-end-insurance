// src/components/EditCustomer/index.jsx

import React, { useState, useEffect } from 'react';
import { getCustomerById, updateCustomer } from '../../services/customerService'; // Only these are needed
import './style.css'; // Assuming you have an EditCustomer/style.css

const EditCustomer = ({ customer, onActionComplete }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If a customer object is directly passed, use it to populate the form
    if (customer) {
      setForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        dateOfBirth: customer.dateOfBirth || '', // Ensure format is YYYY-MM-DD for input type="date"
      });
      setLoading(false);
    } else {
      // Fallback: If customer prop is not directly provided, fetch by ID (less common for direct edit)
      // This part might not be needed depending on how you structure your app.
      // If you always pass the full customer object, you can remove the getCustomerById part.
      const fetchCustomer = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedCustomer = await getCustomerById(customer.customerId); // Assumes customer.customerId is available
          setForm({
            firstName: fetchedCustomer.firstName || '',
            lastName: fetchedCustomer.lastName || '',
            email: fetchedCustomer.email || '',
            phone: fetchedCustomer.phone || '',
            address: fetchedCustomer.address || '',
            dateOfBirth: fetchedCustomer.dateOfBirth || '',
          });
        } catch (err) {
          setError(err?.response?.data?.failureMessage || err?.message || 'Failed to fetch customer for editing.');
          console.error("Error in EditCustomer component:", err);
        } finally {
          setLoading(false);
        }
      };
      if (customer && customer.customerId) {
        fetchCustomer();
      } else {
        setError("No customer ID provided for editing.");
        setLoading(false);
      }
    }
  }, [customer]); // Re-run effect if the 'customer' prop changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup(null);
    setIsSubmitting(true);

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.dateOfBirth) {
      setPopup({ type: 'error', message: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const customerToUpdate = {
        ...form,
        customerId: customer.customerId, // Ensure the ID is included in the payload for update
        dateOfBirth: form.dateOfBirth,
      };

      console.log("Attempting to update customer with data:", customerToUpdate);
      await updateCustomer(customer.customerId, customerToUpdate);
      console.log("Customer updated successfully.");

      setPopup({ type: 'success', message: 'Customer updated successfully!' });

      setTimeout(() => {
        setPopup(null);
        onActionComplete(); // Navigate back to customer list
      }, 1500);

    } catch (err) {
      console.error("Error updating customer:", err);
      let errorMessage = 'Failed to update customer.';
      if (err.response) {
        errorMessage = err.response.data?.failureMessage || `Server Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network Error: No response from server. Check if backend is running.';
      } else {
        errorMessage = `Request Error: ${err.message}`;
      }
      setPopup({ type: 'error', message: errorMessage });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="edit-message">Loading customer details...</div>;
  }

  if (error) {
    return (
      <div className="edit-error-message">
        Error: {error}
        <button onClick={() => onActionComplete()} className="edit-back-button">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="edit-form">
      <h2 className="edit-title">Edit Customer</h2>

      {popup && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Customer'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onActionComplete}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;