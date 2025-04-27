// Fetch your Store ID from environment variable
const STORE_ID = process.env.EXPO_PUBLIC_STORE_ID;

if (!STORE_ID) {
  console.error("⚠️ STORE_ID is missing. Please set it in your .env file.");
}

export const getStoreId = () => parseInt(STORE_ID || '0');