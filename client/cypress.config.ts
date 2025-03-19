import admin from "firebase-admin";
import { defineConfig } from "cypress";
import { plugin as cypressFirebasePlugin } from "cypress-firebase";
import * as dotenv from "dotenv";
import {
  deleteCustomerByField,
  getAllCustomers,
} from "./cypress/support/firebase-utils";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as unknown as string),
});

export const db = admin.firestore();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    env: {
      TEST_UID: process.env.CYPRESS_TEST_UID,
      CYPRESS_FIREBASE_API_KEY: process.env.CYPRESS_FIREBASE_API_KEY,
    },

    // NOTE: Add "supportFile" setting if separate location is used
    setupNodeEvents(on, config) {
      on("task", {
        getAllCustomers,
        deleteCustomerByField: (args: {
          fieldName: string;
          fieldValue: string;
        }) => {
          return deleteCustomerByField(args.fieldName, args.fieldValue);
        },
      });
      // e2e testing node events setup code
      return cypressFirebasePlugin(
        on,
        config,
        admin,
        { projectId: "erp-fire" },
        {
          protectProduction: {
            // when rtdb emulator isn't detected, a console warning will appear
            rtdb: "warn",
            // plugin will be indifferent to the firestore emulator running or not
            firestore: "none",
            // when auth emulator isn't detected, an error is thrown halting cypress
            auth: "error",
          },
          // Here is where you can pass special options.
          // If you have not set the GCLOUD_PROJECT environment variable, give the projectId here, like so:
          //    projectId: 'some-project',
          // if your databaseURL is not just your projectId plus ".firebaseio.com", then you _must_ give it here, like so:
          //    databaseURL: 'some-project-default-rtdb.europe-west1.firebasedatabase.app',
        }
      );
    },
  },
});
