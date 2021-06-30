module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['jest-extended'],
}
