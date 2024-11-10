/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";
import { groupedHelloWorldJsEs01, groupedHelloWorldJsEs02 } from "./grouped/index.js"

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

export const helloWorldJsEs01 = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});


export const groups = {
    groupedHelloWorldJsEs01,
    groupedHelloWorldJsEs02
}