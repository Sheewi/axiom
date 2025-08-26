const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin (check if already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Axiom-specific endpoints
exports.axiomHealth = functions.https.onRequest((request, response) => {
  functions.logger.info("Axiom health check");
  response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'axiom-codebase'
  });
});

// Ecosystem management
exports.getEcosystemStatus = functions.https.onRequest(async (request, response) => {
  try {
    const botsSnapshot = await admin.firestore().collection('bots').get();
    const usersSnapshot = await admin.firestore().collection('users').get();
    
    response.json({
      success: true,
      data: {
        totalBots: botsSnapshot.size,
        totalUsers: usersSnapshot.size,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    functions.logger.error('Error getting ecosystem status:', error);
    response.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Configuration management
exports.updateBotConfig = functions.https.onRequest(async (request, response) => {
  try {
    const { botId, config } = request.body;
    
    await admin.firestore().collection('bots').doc(botId).update({
      config,
      updated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    response.json({
      success: true,
      message: 'Bot configuration updated'
    });
  } catch (error) {
    functions.logger.error('Error updating bot config:', error);
    response.status(500).json({
      success: false,
      error: error.message
    });
  }
});
