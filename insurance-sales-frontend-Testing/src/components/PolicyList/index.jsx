// src/components/PolicyList/index.jsx

import React, { useEffect, useState } from 'react';
import { getAllPolicies } from '../../services/policyService'; // Import the new policy service
import './style.css'; // This CSS file will be created in the next step

function PolicyList() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPolicies();
      setPolicies(data);
    } catch (err) {
      setError(err?.response?.data?.failureMessage || err?.message || 'Failed to fetch policies.');
      console.error("Error in PolicyList component:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="policy-message">Loading policies...</div>
    );
  }

  if (error) {
    return (
      <div className="policy-error-message">
        Error: {error}
        <button
          onClick={fetchPolicies}
          className="policy-retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="policy-list-container">
      <div className="policy-list-header-row">
        <h2 className="policy-list-title">Policy List</h2>
        {/* We won't add an "Add New Policy" button here; it will be in the Navbar */}
      </div>

      {policies.length === 0 ? (
        <p className="policy-message">No policies found. Add a new one!</p>
      ) : (
        <div className="policy-table-wrapper">
          <table className="policy-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Policy No.</th>
                <th>Premium</th>
                <th>Customer ID</th>
                <th>Policy Type ID</th>
                <th>Coverage ID</th>
                <th>Created Date</th>
                {/* Add other columns as needed from PolicyResponseDTO if applicable */}
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.policyId}>
                  <td>{policy.policyId}</td>
                  <td>{policy.policyNumber}</td>
                  <td>{policy.premium}</td>
                  <td>{policy.customerId}</td>
                  <td>{policy.policyTypeId}</td>
                  <td>{policy.coverageId}</td>
                  <td>{policy.createdDate}</td>
                  {/* Render other policy details */}
                  {/* For now, no edit/delete buttons, we can add them later */}
                </tr>
              ))}
            </tbody>
          </table>
        </div> 
      )}
    </div>
  );
}

export default PolicyList;