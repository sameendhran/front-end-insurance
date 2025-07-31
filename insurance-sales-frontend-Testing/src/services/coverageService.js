// src/services/coverageService.js
import axios from 'axios';
import { extractData, getErrorMessage } from './apiUtils';

const API_BASE_URL = 'http://localhost:8080/api/coverages';

export const getAllCoverages = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        const result = extractData(response); // This should be your ResponseObject.data
        // Assuming your backend returns data like { "coverageListDTO": [...] } inside ResponseObject.data
        if (result && result.coverageListDTO) {
            return result.coverageListDTO;
        } else {
            console.warn("getAllCoverages: Backend response did not contain coverageListDTO. Returning empty array.");
            return [];
        }
    } catch (error) {
        console.error('Error fetching coverages:', getErrorMessage(error));
        throw getErrorMessage(error); // Re-throw a user-friendly error message
    }
};