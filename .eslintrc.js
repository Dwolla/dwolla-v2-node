module.exports = {
  env: {
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": "error"
  },
  root: true
};
