// src/components/AddCustomer/index.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './style.css'; // Assuming you have an AddCustomer/style.css

// Expects onActionComplete prop from App.jsx to handle navigation back
const AddCustomer = ({ onActionComplete }) => {

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    mobileNumber: '',
    cityId: '',
    stateId: '',
    countryId: '',
    occupationId: ''
    // Removed: email and address as per CustomerRequestDTO
  });

  const [cities, setCities] = useState([]);
  const [states] = useState([
    { id: 1, name: 'Tamil Nadu' }, { id: 2, name: 'California' },
    { id: 3, name: 'England' }, { id: 4, name: 'Ontario' },
    { id: 5, name: 'New South Wales' }, { id: 6, name: 'Bavaria' },
    { id: 7, name: 'Tokyo' }, { id: 8, name: 'Île-de-France' }
  ]);
  const [countries] = useState([
    { id: 1, name: 'India' }, { id: 2, name: 'USA' },
    { id: 3, name: 'UK' }, { id: 4, name: 'Canada' },
    { id: 5, name: 'Australia' }, { id: 6, name: 'Germany' },
    { id: 7, name: 'Japan' }, { id: 8, name: 'France' }
  ]);
  const [occupations] = useState([
    { id: 1, name: 'Engineer' }, { id: 2, name: 'Doctor' },
    { id: 3, name: 'Teacher' }, { id: 4, name: 'Business' },
    { id: 5, name: 'Student' }, { id: 6, name: 'Retired' }
  ]);

  const [popup, setPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch cities data on component mount
  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/cities');
        if (res.data && res.data.cityListDTO) {
          setCities(res.data.cityListDTO);
        } else {
          console.warn('City data not in expected format:', res.data);
          setPopup({ type: 'error', message: 'Failed to load cities data.' });
        }
      } catch (err) {
        console.error('Failed to fetch cities:', err);
        setPopup({ type: 'error', message: 'Error fetching cities. Check backend connection.' });
      }
    };
    fetchCitiesData();
  }, []);

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

    // Basic validation based on CustomerRequestDTO fields
    if (
      !form.firstName || !form.lastName ||
      !form.gender || !form.dob || !form.mobileNumber ||
      !form.cityId || !form.stateId ||
      !form.countryId || !form.occupationId
    ) {
      setPopup({ type: 'error', message: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    try {
      // Send the form data directly as the payload
      const res = await axios.post('http://localhost:8080/api/customers', form);

      if (res.data && res.data.successMessage) {
        setPopup({ type: 'success', message: res.data.successMessage });
        setTimeout(() => {
          setPopup(null);
          if (onActionComplete) {
            onActionComplete(); // Call parent to navigate back to customer list
          }
        }, 1500);
      } else if (res.data && res.data.failureMessage) {
        setPopup({ type: 'error', message: res.data.failureMessage });
        setIsSubmitting(false);
      } else {
        setPopup({ type: 'error', message: 'Unexpected response from server.' });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submit error:', err);
      let errorMessage = 'Something went wrong.';
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

  return (
    <div className="add-form">
      <h2 className="add-title">Add New Customer</h2>

      {popup && (
        <div
          className={`popup ${popup.type}`}
          style={{
            padding: '10px',
            marginBottom: '20px',
            color: '#fff',
            backgroundColor: popup.type === 'success' ? '#4caf50' : '#e74c3c',
            borderRadius: '6px',
            textAlign: 'center'
          }}
        >
          {popup.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>

        {/* Email field removed as per CustomerRequestDTO */}
        {/* Address Line field removed as per CustomerRequestDTO */}

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>City</label>
          <select name="cityId" value={form.cityId} onChange={handleChange} required>
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.cityId} value={c.cityId}>
                {c.cityName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>State</label>
          <select name="stateId" value={form.stateId} onChange={handleChange} required>
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Country</label>
          <select name="countryId" value={form.countryId} onChange={handleChange} required>
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Occupation</label>
          <select name="occupationId" value={form.occupationId} onChange={handleChange} required>
            <option value="">Select Occupation</option>
            {occupations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div className="btn-row">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Customer...' : 'Add Customer'}
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

export default AddCustomer;