const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function runClient() {
  try {
    // Register user
    const regRes = await axios.post(`${API_URL}/register`, { username: 'clientuser', password: 'clientpass' });
    console.log('Registered:', regRes.data);
  } catch (err) {
    if (err.response && err.response.data.error === 'Username already exists') {
      console.log('User already registered.');
    } else if (err.response) {
      console.error('Registration error:', err.response.data);
      return;
    } else {
      console.error('Registration error:', err.message);
      return;
    }
  }

  let token;
  try {
    // Login
    const loginRes = await axios.post(`${API_URL}/login`, { username: 'clientuser', password: 'clientpass' });
    token = loginRes.data.token;
    console.log('Logged in, token:', token);
  } catch (err) {
    if (err.response) {
      console.error('Login error:', err.response.data);
    } else {
      console.error('Login error:', err.message);
    }
    return;
  }

  const auth = { headers: { Authorization: `Bearer ${token}` } };
  try {
    // CREATE
    const createRes = await axios.post(`${API_URL}/items`, { name: 'Client Item' }, auth);
    console.log('Created:', createRes.data);
    const itemId = createRes.data.id;

    // READ ALL
    const allRes = await axios.get(`${API_URL}/items`, auth);
    console.log('All Items:', allRes.data);

    // READ ONE
    const oneRes = await axios.get(`${API_URL}/items/${itemId}`, auth);
    console.log('Single Item:', oneRes.data);

    // UPDATE
    const updateRes = await axios.put(`${API_URL}/items/${itemId}`, { name: 'Updated Client Item' }, auth);
    console.log('Updated:', updateRes.data);

    // DELETE
    const deleteRes = await axios.delete(`${API_URL}/items/${itemId}`, auth);
    console.log('Deleted:', deleteRes.data);

    // READ ALL AGAIN
    const finalAllRes = await axios.get(`${API_URL}/items`, auth);
    console.log('All Items After Deletion:', finalAllRes.data);
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

runClient();