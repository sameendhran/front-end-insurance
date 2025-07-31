// src/services/policyService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Ensure this matches your backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to add a new policy
export const createPolicy = async (policyData) => {
    try {
        const response = await api.post('/policies', policyData);
        // Check for successMessage from your specific backend ResponseObject
        if (response.data.successMessage) {
            // Return the policyDTO field from your ResponseObject
            return response.data.policyDTO;
        } else if (response.data.failureMessage) {
            // If there's a failure message, throw an error
            throw new Error(response.data.failureMessage);
        } else {
            // Fallback for unexpected successful responses
            throw new Error("Unexpected success response format from server.");
        }
    } catch (error) {
        // Check for error.response.data.failureMessage for backend-thrown errors
        if (error.response && error.response.data && error.response.data.failureMessage) {
            throw new Error(error.response.data.failureMessage);
        } else if (error.response && error.response.data) {
            // Fallback for general error response data
            throw new Error(error.response.data.message || "An unknown error occurred during policy creation.");
        } else {
            throw new Error(error.message || "Network error or unhandled error.");
        }
    }
};

// Function to get all policies
export const getAllPolicies = async () => {
    try {
        const response = await api.get('/policies');
        // Check for policyListDTO from your specific backend ResponseObject
        if (response.data.policyListDTO) {
            return response.data.policyListDTO;
        } else if (response.data.failureMessage) {
             throw new Error(response.data.failureMessage);
        } else {
            // If no policies but also no failure message, return empty array
            return [];
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.failureMessage) {
            throw new Error(error.response.data.failureMessage);
        } else {
            throw new Error(error.message || "An error occurred while fetching policies.");
        }
    }
};

// Function to get a policy by ID
export const getPolicyById = async (id) => {
    try {
        const response = await api.get(`/policies/${id}`);
        if (response.data.policyDTO) {
            return response.data.policyDTO;
        } else if (response.data.failureMessage) {
            throw new Error(response.data.failureMessage);
        } else {
            throw new Error("Policy not found or unexpected response format.");
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.failureMessage) {
            throw new Error(error.response.data.failureMessage);
        } else {
            throw new Error(error.message || "An error occurred while fetching policy by ID.");
        }
    }
};

// You would similarly update other service calls if they exist,
// checking for `response.data.successMessage`, `response.data.failureMessage`,
// and the specific DTO field (e.g., `customerDTO`, `cityListDTO`, etc.)