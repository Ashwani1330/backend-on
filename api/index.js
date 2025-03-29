require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;
const RENDER_URL = process.env.RENDER_URL;
const PING_INTERVAL = process.env.PING_INTERVAL || '*/10 * * * *'; // Default: every 10 minutes

if (!RENDER_URL) {
  console.error('Error: RENDER_URL environment variable is not set');
  process.exit(1);
}

// Basic middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint to manually trigger a ping
app.post('/ping', async (req, res) => {
  try {
    await pingRenderBackend();
    res.status(200).json({ status: 'success', message: 'Ping sent successfully' });
  } catch (error) {
    console.error('Manual ping failed:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Function to ping the Render backend
async function pingRenderBackend() {
  console.log(`Pinging Render backend at ${RENDER_URL}...`);
  try {
    const response = await axios.get(RENDER_URL);
    console.log(`Ping successful! Status: ${response.status}`);
    return response;
  } catch (error) {
    console.error(`Ping failed: ${error.message}`);
    throw error;
  }
}

// Schedule regular pings using cron
cron.schedule(PING_INTERVAL, async () => {
  try {
    await pingRenderBackend();
  } catch (error) {
    console.error('Scheduled ping failed:', error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Render backend will be pinged according to schedule: ${PING_INTERVAL}`);
});
