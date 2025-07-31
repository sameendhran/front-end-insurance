// src/services/policyTypeService.js
import axios from 'axios';
import { extractData, getErrorMessage } from './apiUtils';

const API_BASE_URL = 'http://localhost:8080/api/policy-types'; // Correct URL with hyphen

export const getAllPolicyTypes = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        const result = extractData(response); // This should be your ResponseObject.data
        // Assuming your backend returns data like { "policyTypeListDTO": [...] } inside ResponseObject.data
        if (result && result.policyTypeListDTO) {
            return result.policyTypeListDTO;
        } else {
            console.warn("getAllPolicyTypes: Backend response did not contain policyTypeListDTO. Returning empty array.");
            return [];
        }
    } catch (error) {
        console.error('Error fetching policy types:', getErrorMessage(error));
        throw getErrorMessage(error);
    }
};