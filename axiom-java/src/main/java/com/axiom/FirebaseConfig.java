package com.axiom;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.concurrent.ExecutionException;

/**
 * Firebase Configuration and Initialization for Axiom Java Ecosystem
 * Supports Advanced Java Scripting coursework integration
 */
public class FirebaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);
    private static Firestore firestore;
    private static boolean initialized = false;

    /**
     * Initialize Firebase with service account credentials
     */
    public static void initialize() {
        if (initialized) {
            logger.info("Firebase already initialized");
            return;
        }

        try {
            // Try to initialize with default credentials first
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.getApplicationDefault())
                .setProjectId("axiom-ecosystem")
                .build();

            FirebaseApp.initializeApp(options);
            firestore = FirestoreClient.getFirestore();
            initialized = true;
            
            logger.info("Firebase initialized successfully for project: axiom-ecosystem");
        } catch (IOException e) {
            logger.error("Failed to initialize Firebase: {}", e.getMessage());
            throw new RuntimeException("Firebase initialization failed", e);
        }
    }

    /**
     * Initialize Firebase with custom service account file
     * @param serviceAccountPath Path to service account JSON file
     */
    public static void initialize(String serviceAccountPath) {
        if (initialized) {
            logger.info("Firebase already initialized");
            return;
        }

        try {
            FileInputStream serviceAccount = new FileInputStream(serviceAccountPath);
            
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setProjectId("axiom-ecosystem")
                .build();

            FirebaseApp.initializeApp(options);
            firestore = FirestoreClient.getFirestore();
            initialized = true;
            
            logger.info("Firebase initialized with service account: {}", serviceAccountPath);
        } catch (IOException e) {
            logger.error("Failed to initialize Firebase with service account: {}", e.getMessage());
            throw new RuntimeException("Firebase initialization failed", e);
        }
    }

    /**
     * Get Firestore database instance
     * @return Firestore instance
     */
    public static Firestore getFirestore() {
        if (!initialized) {
            initialize();
        }
        return firestore;
    }

    /**
     * Check if Firebase is initialized
     * @return true if initialized, false otherwise
     */
    public static boolean isInitialized() {
        return initialized;
    }

    /**
     * Test Firebase connection
     * @return true if connection is successful
     */
    public static boolean testConnection() {
        try {
            Firestore db = getFirestore();
            // Try to access a collection to test connection
            db.collection("health_check").limit(1).get().get();
            logger.info("Firebase connection test successful");
            return true;
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Firebase connection test failed: {}", e.getMessage());
            return false;
        }
    }
}
