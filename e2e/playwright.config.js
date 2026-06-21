const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8081',
    headless: true,
  },
  webServer: [
    {
      command: 'node ../backend/server.js',
      port: 3000,
      reuseExistingServer: true,
    },
    {
      command: 'PORT=8081 node serve-frontend.js',
      port: 8081,
      reuseExistingServer: true,
    },
  ],
});
