/** @type {import('jest').Config} */
const config = {
  verbose: true,
  transformIgnorePatterns: ["/node_modules/(?!(chalk)/)"],
};

module.exports = config;
