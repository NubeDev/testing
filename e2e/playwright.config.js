const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:8081',
    headless: true,
  },
  webServer: [
    {
      command: 'node ../backend/server.js',
      url: 'http://localhost:3000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 10000,
    },
    {
      command: 'FRONTEND_PORT=8081 node serve-frontend.js',
      url: 'http://localhost:8081',
      reuseExistingServer: !process.env.CI,
      timeout: 10000,
    },
  ],
});
