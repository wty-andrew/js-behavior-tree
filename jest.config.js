module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['jest-extended'],
}
