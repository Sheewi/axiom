// pages/api/gemini/project-builder.js - AI Project Builder API
import GeminiAI from '../../../lib/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, projectType, requirements, buildContext } = req.body;

    // Generate project structure and code based on prompt
    const projectPlan = await GeminiAI.generateProjectPlan(prompt, projectType, requirements, buildContext);
    
    res.status(200).json({
      success: true,
      projectPlan,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Project Builder Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate project plan',
      details: error.message 
    });
  }
}
