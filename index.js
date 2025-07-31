// AdminUI/firebase-admin-backend/index.js

// 1. Load environment variables at the very beginning
require('dotenv').config(); // This loads variables from your .env file into process.env

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();

// Enable CORS for all routes (for development) - place this early
app.use(cors());
app.use(express.json()); // For parsing application/json bodies

console.log('Backend: Starting server initialization...');

// --- Firebase Initialization with comprehensive error handling ---
let db;
try {
    // 2. Access the key from process.env and parse it as JSON
    // Ensure the variable name in .env matches (e.g., FIREBASE_SERVICE_ACCOUNT_KEY)
    const firebaseServiceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!firebaseServiceAccountKey) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set or is empty in .env file!");
    }

    console.log(`process.env.FIREBASE_SERVICE_ACCOUNT_KEY type: ${typeof firebaseServiceAccountKey}`);
    console.log(`process.env.FIREBASE_SERVICE_ACCOUNT_KEY length: ${firebaseServiceAccountKey.length}`);

    // Parse the JSON string from the environment variable
    const serviceAccount = JSON.parse(firebaseServiceAccountKey);
    console.log(`JSON parsed successfully. Project ID from key: ${serviceAccount.project_id}`);


    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("Backend: Firebase Admin SDK initialized successfully!");

} catch (error) {
    console.error("\n--- CRITICAL ERROR: Firebase Admin SDK Initialization Failed! ---");
    console.error("This often means:");
    console.error("1. 'dotenv' is not installed or not configured correctly.");
    console.error("2. 'FIREBASE_SERVICE_ACCOUNT_KEY' is missing from your .env file.");
    console.error("3. The value of 'FIREBASE_SERVICE_ACCOUNT_KEY' in .env is not valid JSON.");
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    console.error("-----------------------------------------------------------------\n");
    process.exit(1);
}
// ------------------------------------------------------------------

// Test route for root path - helps confirm server is running and accessible
app.get('/', (req, res) => {
    console.log('Backend: Received GET request for /');
    res.send('Firebase Admin Backend is running and ready!');
});

// Users API endpoint - TEMPORARILY MODIFIED TO FETCH A SPECIFIC DOCUMENT
app.get('/users', async (req, res) => {
    console.log('Backend: Received GET request for /users endpoint.');
    try {
        if (!db) {
            console.error('Backend Error: Firestore database object is null or undefined!');
            throw new Error("Firestore database not initialized. Firebase setup likely failed.");
        }

        // Log the exact collection name being used
        console.log('Backend: Attempting to query collection:', 'Users');

        // --- TEMPORARY CHANGE: Fetching a specific document 'Andrew L.' ---
        const docIdToFetch = 'Andrew L.'; // Use the exact document ID from your screenshot
        const docRef = db.collection('Users').doc(docIdToFetch); // Ensure 'Users' is capitalized
        console.log(`Backend: Attempting to get specific document: ${docIdToFetch}`);

        const docSnapshot = await docRef.get(); // Try to get the specific document

        if (!docSnapshot.exists) {
            console.log(`Backend: Document "${docIdToFetch}" does not exist or is not accessible.`);
            return res.status(404).json({ message: `User "${docIdToFetch}" not found.` });
        }

        const userData = { id: docSnapshot.id, ...docSnapshot.data() };
        console.log('Backend: Successfully fetched specific user. Sending 200 OK.');
        return res.status(200).json([userData]); // Send it as an array for consistency with original expectation
        // --- END TEMPORARY CHANGE ---

    } catch (error) {
        console.error("\n--- Backend Error: Failed to fetch users from Firestore! ---");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Error Stack Trace:\n", error.stack);
        console.error("-----------------------------------------------------------\n");

        res.status(500).json({
            message: "Internal Server Error during user fetching.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// --- Catch-all for any unhandled errors in Express ---
app.use((err, req, res, next) => {
    console.error("\n--- Backend: Unhandled Express Error Caught by Middleware! ---");
    console.error("Error details:", err.stack || err);
    console.error("--------------------------------------------------------------\n");
    res.status(500).json({ message: "An unexpected error occurred on the server." });
});

// --- Catch-all for unhandled promise rejections (very important) ---
process.on('unhandledRejection', (reason, promise) => {
    console.error('\n--- Backend: Unhandled Rejection at:', promise, 'reason:', reason);
    console.error("This usually means a Promise was rejected but not caught.");
    console.error("----------------------------------------------------------\n");
    // process.exit(1); // Consider exiting if unhandled rejections should be fatal
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\nNode.js Backend Server running on port ${PORT}`);
    console.log(`Test direct backend access: http://localhost:${PORT}/`);
    console.log(`Test users endpoint directly: http://localhost:${PORT}/users\n`);
});