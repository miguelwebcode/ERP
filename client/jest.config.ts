export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/?(*.)+(jest.test).[jt]s?(x)", // Busca archivos con sufijo .jest.test.ts o .jest.test.tsx
  ],
};
