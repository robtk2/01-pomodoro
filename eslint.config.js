const expo = require("eslint-config-expo/flat");

module.exports = [
  ...expo,
  {
    ignores: [
      "**/node_modules/**",
      ".expo/**",
      "android/**",
      "ios/**",
      "docs/**",
      "coverage/**",
      "reportes/**",
      "*.config.js",
      "*.config.cjs"
    ],
  },
  {
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "react-native/no-inline-styles": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
