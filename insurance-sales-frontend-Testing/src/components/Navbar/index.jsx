import React, { useState, useEffect } from 'react';
import './style.css'; // This is where the magic happens for "pretty"

const Navbar = ({ onNavigate }) => {
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false);

  const handleNavLinkClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setCustomerDropdownOpen(false); // Close dropdowns after navigation
    setPolicyDropdownOpen(false);
  };

  const toggleCustomerDropdown = (e) => {
    e.stopPropagation();
    setCustomerDropdownOpen(!customerDropdownOpen);
    setPolicyDropdownOpen(false);
  };

  const togglePolicyDropdown = (e) => {
    e.stopPropagation();
    setPolicyDropdownOpen(!policyDropdownOpen);
    setCustomerDropdownOpen(false);
  };

  useEffect(() => {
    const closeAllDropdowns = () => {
      setCustomerDropdownOpen(false);
      setPolicyDropdownOpen(false);
    };
    document.addEventListener('click', closeAllDropdowns);
    return () => {
      document.removeEventListener('click', closeAllDropdowns);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="#" onClick={() => handleNavLinkClick('home')}>
          Insurance System
        </a>
      </div>
      <ul className="navbar-nav">

        {/* Customer Dropdown */}
        <li className="nav-item dropdown">
          <a
            href="#"
            className="dropbtn"
            onClick={toggleCustomerDropdown}
          >
            Customers
          </a>
          {/* IMPORTANT CHANGE HERE: Added className logic */}
          <div className={`dropdown-content ${customerDropdownOpen ? 'show' : ''}`}>
            <a href="#" onClick={() => handleNavLinkClick('customer-list')}>
              View All Customers
            </a>
            <a href="#" onClick={() => handleNavLinkClick('add-customer')}>
              Add New Customer
            </a>
          </div>
        </li>

        {/* Policy Dropdown */}
        <li className="nav-item dropdown">
          <a
            href="#"
            className="dropbtn"
            onClick={togglePolicyDropdown}
          >
            Policies
          </a>
          {/* IMPORTANT CHANGE HERE: Added className logic */}
          <div className={`dropdown-content ${policyDropdownOpen ? 'show' : ''}`}>
            <a href="#" onClick={() => handleNavLinkClick('policy-list')}>
              View All Policies
            </a>
            <a href="#" onClick={() => handleNavLinkClick('add-policy')}>
              Add New Policy
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;