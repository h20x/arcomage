const config = {
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '@ai': '<rootDir>/src/ai',
    '@game': '<rootDir>/src/game',
    '@lib': '<rootDir>/src/lib',
    '@model': '<rootDir>/src/model',
  },
};

module.exports = config;
