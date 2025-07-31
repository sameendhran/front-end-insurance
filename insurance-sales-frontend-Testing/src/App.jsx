// src/App.jsx

import React, { useState } from 'react';
import './App.css'; // Your main App CSS
import Navbar from './components/Navbar'; // Your Navbar component

// Customer Components
import CustomerList from './components/CustomerList';
import AddCustomer from './components/AddCustomer';
import EditCustomer from './components/EditCustomer'; // Assuming you have this

// NEW: Policy Components
import PolicyList from './components/PolicyList';
import AddPolicyForm from './components/AddPolicyForm'; // UPDATED IMPORT

function App() {
  // Current page state
  const [currentPage, setCurrentPage] = useState('customer-list'); // Or 'home' or 'policy-list'

  // State for editing a customer (if you have it)
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setEditingCustomer(null); // Reset editing state when navigating to a new page
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCurrentPage('edit-customer'); // Or whatever page name for edit customer
  };

  const handleCustomerActionComplete = () => {
    setEditingCustomer(null); // Clear editing state
    setCurrentPage('customer-list'); // Go back to customer list
  };

  const handlePolicyActionComplete = () => {
    setCurrentPage('policy-list'); // Go back to policy list after adding
  };


  return (
    <div className="App">
      {/* Pass the handleNavigate function to Navbar */}
      <Navbar onNavigate={handleNavigate} />

      <main className="main-content">
        {/* Conditional Rendering for Customers */}
        {currentPage === 'customer-list' && <CustomerList onEditCustomer={handleEditCustomer} />}
        {currentPage === 'add-customer' && <AddCustomer onActionComplete={handleCustomerActionComplete} />}
        {currentPage === 'edit-customer' && editingCustomer && (
          <EditCustomer customer={editingCustomer} onActionComplete={handleCustomerActionComplete} />
        )}

        {/* NEW: Conditional Rendering for Policies */}
        {currentPage === 'policy-list' && <PolicyList />}
        {currentPage === 'add-policy' && <AddPolicyForm onPolicyAdded={handlePolicyActionComplete} />} {/* UPDATED COMPONENT & PROP */}

        {/* You can add a default "home" page if currentPage doesn't match */}
        {currentPage === 'home' && (
          <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' }}>
            Welcome to the Insurance Management System!
            <p>Please use the navigation above.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;