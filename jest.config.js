const config = {
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '@ai': '<rootDir>/src/ai',
    '@app': '<rootDir>/src/app',
    '@lib': '<rootDir>/src/lib',
    '@model': '<rootDir>/src/model',
  },
};

module.exports = config;
