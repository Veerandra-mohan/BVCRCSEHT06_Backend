const { onRequest } = require("firebase-functions/v2/https");
const app = require("./server"); // Import your Express app from server.js

exports.api = onRequest(app);
