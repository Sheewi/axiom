// pages/api/gemini/chat.js - Gemini Chat API
import GeminiAI from '../../../lib/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, mode = 'chat', conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let response;

    switch (mode) {
      case 'code':
        response = await GeminiAI.generateCode('javascript', message, [
          'Clean, readable code',
          'Error handling',
          'Best practices'
        ]);
        break;

      case 'java':
        response = await GeminiAI.generateJavaCode('GeneratedClass', message, [
          'Modern Java patterns',
          'Documentation',
          'Unit tests'
        ]);
        break;

      case 'firebase':
        response = await GeminiAI.generateFirebaseFunction('generatedFunction', message);
        break;

      case 'analyze':
        response = await GeminiAI.analyzeCode(message, 'javascript');
        break;

      default:
        response = await GeminiAI.chat(message, conversationHistory);
        break;
    }

    res.status(200).json({
      success: true,
      response,
      mode,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
}
