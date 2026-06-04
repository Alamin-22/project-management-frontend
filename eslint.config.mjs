import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "no-unused-vars": "error", // Errors on unused variables (JS/JSX)
      "@typescript-eslint/no-unused-vars": "error", // Errors on unused variables (TS/TSX)
      "no-unused-expressions": "error", // Errors on code that does nothing
      "prefer-const": "error", // Forces 'const'

      // --- Type Safety ---
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
