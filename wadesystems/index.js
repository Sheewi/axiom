const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin (check if already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Wade Systems specific endpoints
exports.wadesystemsHealth = functions.https.onRequest((request, response) => {
  functions.logger.info("Wade Systems health check");
  response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'wadesystems-codebase'
  });
});

// System analytics
exports.getSystemAnalytics = functions.https.onRequest(async (request, response) => {
  try {
    const interactionsSnapshot = await admin.firestore()
      .collection('ai_interactions')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    const analytics = {
      totalInteractions: interactionsSnapshot.size,
      recentInteractions: interactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })),
      timestamp: new Date().toISOString()
    };
    
    response.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    functions.logger.error('Error getting system analytics:', error);
    response.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Performance monitoring
exports.getPerformanceMetrics = functions.https.onRequest(async (request, response) => {
  try {
    // Placeholder for performance metrics
    const metrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
    
    response.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    functions.logger.error('Error getting performance metrics:', error);
    response.status(500).json({
      success: false,
      error: error.message
    });
  }
});
