import { defineConfig } from "@openapi-codegen/cli";
import {
  generateReactQueryComponents,
  generateSchemaTypes,
} from "@openapi-codegen/typescript";

export default defineConfig({
  api: {
    from: {
      source: "url",
      url: "https://spatial-laser-backend.onrender.com/api-docs.json",
    },
    outputDir: "./src/generated-api",
    to: async (context) => {
      const filenamePrefix = "api";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
  dev: {
    from: {
      source: "url",
      url: "http://localhost:8080/api-docs.json",
    },
    outputDir: "./src/generated-api",
    to: async (context) => {
      const filenamePrefix = "api";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
