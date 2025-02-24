const config = {
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '@app': '<rootDir>/src/app',
    '@lib': '<rootDir>/src/lib',
    '@model': '<rootDir>/src/model',
  },
};

module.exports = config;
