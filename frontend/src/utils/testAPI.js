// Utility to test API connection and database

export const testDatabase = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/test/db');
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message, connected: false };
  }
};

export const testEmailConfig = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/test/email');
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message, configured: false };
  }
};

export const testUsers = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/test/users');
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

