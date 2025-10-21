require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const PORT = process.env.PORT || 3000;

// ✅ Tambahkan route ini untuk Railway health check
app.get('/', (req, res) => {
  res.status(200).json({ message: '✅ Chatterbox API is running!' });
});

// ✅ Endpoint utama API kamu
app.post('/api/chatterbox', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('📥 Received text:', text);

    const response = await axios.post(
      'https://api.replicate.com/v1/models/resemble-ai/chatterbox/predictions',
      { input: { prompt: text } },
      {
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          Prefer: 'wait',
        },
      }
    );

    console.log('✅ Response OK');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: error.message });
  }
});

// ✅ Wajib: gunakan 0.0.0.0 agar Railway bisa akses
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
