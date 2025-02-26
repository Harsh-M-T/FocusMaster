const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint to analyze video content
app.post('/analyze', async (req, res) => {
  const { transcribedText, searchFeed } = req.body;

  console.log(transcribedText);
  console.log(searchFeed);
  // Validate input
  if (!transcribedText || !searchFeed) {
    return res.status(400).json({ message: 'Transcribed text and search feed are required' });
  }

  try {
    // Compare transcribed text with search feed using OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Compare transcribed text with search feed and determine if they are related. Respond with "MATCH" if they are related and "NO_MATCH" otherwise',
          },
          {
            role: 'user',
            content: `Search Feed: ${searchFeed}\n\nTranscribed Text: ${transcribedText}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the analysis result from OpenAI's response
    const analysisResult = response.data.choices[0].message.content.trim();
    const isMatch = analysisResult === 'MATCH';

    // Return the analysis result to the frontend
    res.status(200).json({
      match: isMatch,
      alert: isMatch ? 'This video matches your search feed!' : 'This video does not match your search feed!',
      analysisResult,
    });
  } catch (error) {
    console.error('Error analyzing video:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error analyzing video content' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});