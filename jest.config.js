const path = require("path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  verbose: true,
  transform: {
    ".(js|jsx|ts|tsx)": "ts-jest"
  },
  setupFilesAfterEnv: [path.resolve(__dirname, "./enzyme.config.js")],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.css$": "<rootDir>/__mocks__/styleMock.js"
  },
  coveragePathIgnorePatterns: ["node_modules", "./src/types.d.ts"],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx", "node", 'd.ts']
};
