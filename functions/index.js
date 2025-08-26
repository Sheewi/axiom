const admin = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Health check endpoint
exports.healthCheck = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info("Health check requested");
    response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'axiom-functions'
    });
  });
});

// Bot management functions
exports.createBot = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const { name, type, config } = request.body;
      
      functions.logger.info("Creating bot", { name, type });
      
      const botData = {
        name,
        type,
        config,
        created: admin.firestore.FieldValue.serverTimestamp(),
        status: 'active'
      };
      
      const docRef = await admin.firestore().collection('bots').add(botData);
      
      response.json({
        success: true,
        botId: docRef.id,
        message: 'Bot created successfully'
      });
    } catch (error) {
      functions.logger.error('Error creating bot:', error);
      response.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});

// AI interaction endpoint
exports.processAIRequest = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const { prompt, botId, context } = request.body;
      
      functions.logger.info("Processing AI request", { botId });
      
      // Placeholder for AI processing
      const aiResponse = {
        response: `Processed: ${prompt}`,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
        botId
      };
      
      // Log to Firestore
      await admin.firestore().collection('ai_interactions').add({
        prompt,
        response: aiResponse.response,
        botId,
        context,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      response.json({
        success: true,
        data: aiResponse
      });
    } catch (error) {
      functions.logger.error('Error processing AI request:', error);
      response.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});

// User management
exports.createUser = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const { email, displayName, uid } = request.body;
      
      const userData = {
        email,
        displayName,
        uid,
        created: admin.firestore.FieldValue.serverTimestamp(),
        lastActive: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await admin.firestore().collection('users').doc(uid).set(userData);
      
      response.json({
        success: true,
        message: 'User created successfully'
      });
    } catch (error) {
      functions.logger.error('Error creating user:', error);
      response.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});
