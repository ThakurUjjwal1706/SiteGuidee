const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', async (req, res) => {
  const { prompt, context } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Constructing an optimized prompt incorporating context if provided
    const fullPrompt = `
      You are SiteGuide AI, a helpful virtual assistant for construction engineers, architects, and project managers.
      You help with cost estimation, material suggestions, construction timelines, and risk mitigation.
      Keep answers professional, concise, and structured.
      
      Project Context: ${context ? JSON.stringify(context) : 'General Inquiry'}
      
      User Question: ${prompt}
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: 'Error generating AI response.' });
  }
});

module.exports = router;
