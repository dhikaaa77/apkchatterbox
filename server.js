require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Validasi token agar tidak error saat dijalankan
if (!REPLICATE_API_TOKEN) {
  console.error('❌ Error: REPLICATE_API_TOKEN tidak ditemukan di environment.');
  process.exit(1);
}

app.post('/api/chatterbox', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('📥 Received text:', text);

    const response = await axios.post(
      'https://api.replicate.com/v1/models/resemble-ai/chatterbox/predictions',
      {
        input: { prompt: text },
      },
      {
        headers: {
          'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait',
        },
      }
    );

    console.log('✅ Success response');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ error: error.message });
  }
});

// 🚀 Penting: gunakan '0.0.0.0' agar bisa diakses dari mana pun (bukan hanya localhost)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Endpoint: /api/chatterbox`);
});
