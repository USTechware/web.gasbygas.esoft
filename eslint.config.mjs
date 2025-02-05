import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/display-name": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/no-children-prop": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "jsx-a11y/alt-text": "off",
      "@next/next/no-img-element": "off"
    }
  }
];

export default eslintConfig;
