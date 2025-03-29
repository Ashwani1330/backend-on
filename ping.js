require('dotenv').config();
const axios = require('axios');

async function pingRenderBackend() {
  const RENDER_URL = process.env.RENDER_URL;
  
  if (!RENDER_URL) {
    console.error('Error: RENDER_URL environment variable is not set');
    process.exit(1);
  }
  
  console.log(`Pinging Render backend at ${RENDER_URL}...`);
  
  try {
    const response = await axios.get(RENDER_URL, {
      timeout: 30000 // 30 second timeout
    });
    console.log(`Ping successful! Status: ${response.status}`);
    return response;
  } catch (error) {
    console.error(`Ping failed: ${error.message}`);
    throw error; // Don't exit process here
  }
}

// Execute ping and exit
(async () => {
  try {
    await pingRenderBackend();
    console.log('Ping completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Ping operation failed:', error.message);
    process.exit(1);
  }
})();