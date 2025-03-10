/// <reference types="cypress" />
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import { attachCustomCommands } from "cypress-firebase";

const fbConfig = {
  // Your config from Firebase Console
  apiKey: "AIzaSyDDZ_LRemHgQdbG3pJA7IOGUbABqOJaFgA",
  authDomain: "erp-fire.firebaseapp.com",
  projectId: "erp-fire",
  storageBucket: "erp-fire.firebasestorage.app",
  messagingSenderId: "440327598939",
  appId: "1:440327598939:web:faba0f28a17db1f6fc607e",
};

firebase.initializeApp(fbConfig);

const firestoreSettings = {
  experimentalForceLongPolling: false,
};
// Pass long polling setting to Firestore when running in Cypress
if (window.Cypress) {
  // Needed for Firestore support in Cypress (see https://github.com/cypress-io/cypress/issues/6350)
  firestoreSettings.experimentalForceLongPolling = true;
}
// powershell -Command "$env:SERVICE_ACCOUNT = Get-Content -Path .\sa_dev.json -Raw; npx cypress open""
const shouldUseEmulator = window.location.hostname === "localhost";
if (shouldUseEmulator) {
  firebase.firestore().settings({
    host: "localhost:8080",
    ssl: false,
  });
}

if (shouldUseEmulator) {
  firebase.auth().useEmulator("http://127.0.0.1:9099");
  console.debug("Using Auth emulator");
}

attachCustomCommands({ Cypress, cy, firebase });
