/**
 * Utility functions for the application
 */

/**
 * Get the full image URL from a filename
 * @param filename The filename of the image
 * @returns The full URL to the image
 */
export const getFullImageUrl = (filename: string): string => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  
  if (!filename) {
    return '';
  }
  
  // Handle already full URLs
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // Handle relative URLs
  if (filename.startsWith('/')) {
    return `${apiUrl}${filename}`;
  }
  
  return `${apiUrl}/assets/${filename}`;
};

/**
 * Format a price with currency
 * @param price The price to format
 * @param currency The currency to use (default: INR)
 * @returns The formatted price string
 */
export const formatPrice = (price: number, currency = 'INR'): string => {
  return `Rs. ${price.toFixed(2)}`;
};

/**
 * Truncate a string to a certain length with ellipsis
 * @param str The string to truncate
 * @param length The maximum length
 * @returns The truncated string
 */
export const truncateString = (str: string, length = 50): string => {
  if (!str || str.length <= length) {
    return str;
  }
  
  return `${str.substring(0, length)}...`;
};

/**
 * Generate a random string (useful for order numbers, etc.)
 * @param length The length of the string
 * @returns A random string
 */
export const generateRandomString = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}; 