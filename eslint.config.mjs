import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend from Next.js base configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules override
  {
    rules: {
      "no-unused-vars": "off", // Disable unused variable warnings
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
