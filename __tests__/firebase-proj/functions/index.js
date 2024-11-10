const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const groupedFunctions = require("./grouped");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");

exports.helloWorldJs01 = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

exports.onDocWrittenJs01 = onDocumentWritten("my-collection/{docId}", (event) => {
    /* ... */
});

exports.groups = groupedFunctions;

// This should not be listed as a function.
exports.test = () => {

}