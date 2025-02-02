import { beforeAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import {
  RulesTestEnvironment,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";

// Luego donde se usa esta variable? Me falta algo más en otro archivo?
export let testEnv: RulesTestEnvironment | null = null;

beforeAll(async () => {
  // Se usa testEnv en vez de db en los tests?
  testEnv = await initializeTestEnvironment({
    projectId: "erp-fire",
    hub: {
      host: "127.0.0.1",
      // Es el PORT que toca en mi caso? Tengo que consultar mi firebase.json?
      port: 4000,
    },
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterEach(() => {
  cleanup();
});
