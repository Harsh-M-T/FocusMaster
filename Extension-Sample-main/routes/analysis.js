// routes/analysis.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// This endpoint receives a transcript, calls the OpenAI API, and returns an evaluation.
router.post('/', async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) return res.status(400).json({ message: 'Transcript is required' });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Evaluate the transcript to determine if the content is on-topic or distracting.' },
          { role: 'user', content: transcript }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const evaluation = response.data.choices[0].message.content;
    res.status(200).json({ evaluation });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error analyzing video transcript' });
  }
});

module.exports = router;
