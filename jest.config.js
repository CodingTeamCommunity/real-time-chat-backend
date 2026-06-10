// jest.config.js (Ensure your package.json has "type": "module")
import { createDefaultEsmPreset } from "ts-jest";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  // Use the default ESM preset supplied by ts-jest
  ...createDefaultEsmPreset(),

  testEnvironment: "node",

  // Treat .ts extensions as native ES Modules
  extensionsToTreatAsEsm: [".ts"],

  // Crucial: Maps your relative './file.js' imports to find the actual './file.ts' source
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true, // Tells ts-jest to emit ESM syntax instead of CommonJS
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(name-of-problem-package|another-esm-package)/)",
  ],
};

export default config;
