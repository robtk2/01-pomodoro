module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testMatch: ["**/*.test.(ts|tsx|js|jsx)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "node_modules/(?!(expo.*|@expo.*|react-native|@react-native|react-navigation|@react-navigation/.*|@ungap|@react-native-async-storage)/)"
  ],
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.js"
  ],
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@application/(.*)$": "<rootDir>/src/application/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@presentation/(.*)$": "<rootDir>/src/presentation/$1",
    "^@theme$": "<rootDir>/src/theme/index.ts",
    "^@theme/(.*)$": "<rootDir>/src/theme/$1",
    "^@modules/(.*)$": "<rootDir>/modules/$1",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/types.ts",
    "!src/theme/**",
    "!src/presentation/**" // Omitimos la UI por ahora para enfocarnos en la lógica auditada
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"]
};
