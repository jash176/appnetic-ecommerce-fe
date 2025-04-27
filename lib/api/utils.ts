/**
 * Utility functions for working with the Payload API
 */

/**
 * Create a document formatter that handles ID conversions and other common tasks
 * @param data The data to format for a Payload create operation
 * @returns The properly formatted payload
 */
export const formatCreatePayload = <T>(data: T) => {
  return {
    doc: data
  };
};

/**
 * Format a document for update operations
 * @param id The document ID
 * @param data The data to update
 * @returns The properly formatted payload
 */
export const formatUpdatePayload = <T>(id: string | number, data: T) => {
  return {
    id: typeof id === 'number' ? id.toString() : id,
    patch: data
  };
};

/**
 * Extract the ID from a Payload response
 * @param response The response object
 * @returns The ID of the created/updated document
 */
export const extractId = (response: any): number => {
  if (response && response.id) {
    if (typeof response.id === 'number') {
      return response.id;
    }
    if (typeof response.id === 'string') {
      return parseInt(response.id, 10);
    }
  }
  return 0;
};

/**
 * Convert any ID to a number
 * @param id The ID to convert
 * @returns A numeric ID
 */
export const toNumericId = (id: string | number): number => {
  if (typeof id === 'number') {
    return id;
  }
  return parseInt(id, 10);
}; 