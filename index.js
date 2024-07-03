const express = require('express');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
const port = 8000;

// Middleware to parse JSON requests
app.use(express.json());

// Example key storage (in-memory dictionary)
const keys = {};

// SPEKE /keys endpoint
app.post('/keys', (req, res) => {
    const requestData = req.body;

    // Parse the request (e.g., content ID, system ID)
    const contentId = requestData.resourceId; // Use resourceId as contentId
    const systemIds = requestData.systemIds;

    // Generate or retrieve encryption keys
    if (!keys[contentId]) {
        keys[contentId] = {
            keyId: uuidv4(),
            keyValue: crypto.randomBytes(16).toString('hex') // Generate a 128-bit key
        };
    }

    const keyInfo = keys[contentId];

    // Prepare the SPEKE response
    const response = {
        contentId: contentId,
        keys: systemIds.map(systemId => ({
            keyId: keyInfo.keyId,
            keyValue: keyInfo.keyValue,
            systemIds: [systemId]
        }))
    };

    res.json(response);
});

// Start the server
app.listen(port, () => {
    console.log(`SPEKE Key Server running at https://localhost:${port}`);
});
