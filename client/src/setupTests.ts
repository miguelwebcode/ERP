import { beforeAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import {
  RulesTestEnvironment,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";

export let testEnv: RulesTestEnvironment | null = null;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "erp-fire",
    hub: {
      host: "127.0.0.1",
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
