// src/services/apiUtils.js

/**
 * Extracts the main data payload from a successful Axios response.
 * Assumes backend responses are either a direct data object or wrapped
 * in a standard ResponseObject with 'data' field, 'successMessage', or specific DTOs.
 *
 * @param {object} response - The Axios response object.
 * @returns {object|array|null} The extracted data, or null if not found.
 */
export const extractData = (response) => {
    if (!response || !response.data) {
        console.warn("extractData: Response or response.data is null/undefined.");
        return null;
    }

    // Case 1: If the response is your generic ResponseObject (e.g., for lists, single items)
    // It's structured like { success: true, message: "...", data: {...} }
    if (typeof response.data === 'object' && response.data !== null && 'success' in response.data) {
        return response.data.data; // Return the 'data' field of the ResponseObject
    }

    // Case 2: If the response is the specific structure for policy creation as you provided
    // e.g., { successMessage: "...", policyDTO: {...} }
    if (typeof response.data === 'object' && response.data !== null && 'successMessage' in response.data) {
        return response.data; // For policy creation, we return the whole object to access successMessage later
    }

    // Case 3: If the response is just the direct data payload (e.g., plain list or DTO)
    return response.data;
};

/**
 * Extracts an appropriate error message from an Axios error object.
 * Assumes backend error responses might have a 'failureMessage' or 'message' field in data.
 *
 * @param {object} error - The Axios error object.
 * @returns {string} The extracted error message.
 */
export const getErrorMessage = (error) => {
    if (error.response && error.response.data) {
        // Check for a specific 'failureMessage' field as seen in your logs
        if (error.response.data.failureMessage) {
            return error.response.data.failureMessage;
        }
        // Check for a generic 'message' field
        if (error.response.data.message) {
            return error.response.data.message;
        }
        // If it's just a string error from backend
        if (typeof error.response.data === 'string') {
            return error.response.data;
        }
    }
    // Fallback to error.message (e.g., network error) or a generic message
    return error.message || "An unexpected error occurred.";
};