const express = require('express');
const axios = require('axios'); // Ganti fetch dengan axios
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 GANTI INI DENGAN TOKEN ANDA
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

app.post('/api/chatterbox', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    console.log('📥 Received text:', text);
    
    // Gunakan axios
    const response = await axios.post(
      'https://api.replicate.com/v1/models/resemble-ai/chatterbox/predictions',
      {
        input: {
          prompt: text,
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait',
        }
      }
    );
    
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
    
    // Return data sukses
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response) {
      // Error dari Replicate API
      return res.status(error.response.status).json(error.response.data);
    }
    
    // Error lainnya
    res.status(500).json({ 
      error: error.message 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 POST http://localhost:${PORT}/api/chatterbox`);
});