const path = require('path');

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/api/database/**/*.[tj]s',
    '<rootDir>/api/routes/**/*.[tj]s',
  ],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js'],
  rootDir: path.join(__dirname, '../..'),
  setupFiles: ['<rootDir>/api/config/jest.setup.js'],
  testEnvironment: 'node',
  testMatch: [path.join(__dirname, '../../**/?(*.)+(spec|test).[tj]s')],
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
};
