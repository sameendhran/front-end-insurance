// src/services/customerService.js

import axios from 'axios';
import { extractData } from './apiUtils'; // Importing the central utility function

const API_BASE_URL = 'http://localhost:8080/api/customers';

// *** IMPORTANT: If you had a 'const extractData = (...)' function defined directly here, DELETE IT. ***
// It is now imported from './apiUtils'.

export const getAllCustomers = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    const result = extractData(response); // Using the imported helper
    if (result && result.customerListDTO) {
      return result.customerListDTO;
    } else {
      console.warn("getAllCustomers: Backend response did not contain customerListDTO. Returning empty array.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching customers:", error.response?.data?.failureMessage || error.message);
    throw error.response?.data?.failureMessage || "Failed to fetch customers.";
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    const result = extractData(response); // Using the imported helper
    if (result && result.customerDTO) {
      return result.customerDTO;
    } else {
      throw new Error("Customer data not found in response.");
    }
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error.response?.data?.failureMessage || error.message);
    throw error.response?.data?.failureMessage || `Failed to fetch customer with ID ${id}.`;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(API_BASE_URL, customerData);
    const result = extractData(response); // Using the imported helper
    if (result && result.customerDTO) {
      return result.customerDTO;
    } else {
      throw new Error("Created customer data not found in response.");
    }
  } catch (error) {
    console.error("Error creating customer:", error.response?.data?.failureMessage || error.message);
    throw error.response?.data?.failureMessage || "Failed to create customer.";
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, customerData);
    const result = extractData(response); // Using the imported helper
    if (result && result.customerDTO) {
      return result.customerDTO;
    } else {
      throw new Error("Updated customer data not found in response.");
    }
  } catch (error) {
    console.error(`Error updating customer with ID ${id}:`, error.response?.data?.failureMessage || error.message);
    throw error.response?.data?.failureMessage || `Failed to update customer with ID ${id}.`;
  }
};

