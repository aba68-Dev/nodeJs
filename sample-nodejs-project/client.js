const axios = require('axios');

const API_URL = 'http://localhost:3000/items';

async function runClient() {
  try {
    // CREATE
    const createRes = await axios.post(API_URL, { name: 'Client Item' });
    console.log('Created:', createRes.data);
    const itemId = createRes.data.id;

    // READ ALL
    const allRes = await axios.get(API_URL);
    console.log('All Items:', allRes.data);

    // READ ONE
    const oneRes = await axios.get(`${API_URL}/${itemId}`);
    console.log('Single Item:', oneRes.data);

    // UPDATE
    const updateRes = await axios.put(`${API_URL}/${itemId}`, { name: 'Updated Client Item' });
    console.log('Updated:', updateRes.data);

    // DELETE
    const deleteRes = await axios.delete(`${API_URL}/${itemId}`);
    console.log('Deleted:', deleteRes.data);

    // READ ALL AGAIN
    const finalAllRes = await axios.get(API_URL);
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