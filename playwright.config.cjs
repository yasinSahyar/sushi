const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  projects: [
    {
      name: "Desktop Chrome",
      use: { browserName: "chromium", viewport: { width: 1280, height: 720 } },
    },
    {
      name: "Mobile Chrome",
      use: { browserName: "chromium", viewport: { width: 375, height: 667 } },
    },
    {
      name: "Desktop Firefox",
      use: { browserName: "firefox", viewport: { width: 1280, height: 720 } },
    },
    {
      name: "Mobile Firefox",
      use: { browserName: "firefox", viewport: { width: 375, height: 667 } },
    },
    {
      name: "Desktop Safari",
      use: { browserName: "webkit", viewport: { width: 1280, height: 720 } },
    },
    {
      name: "Mobile Safari",
      use: { browserName: "webkit", viewport: { width: 375, height: 667 } },
    },
  ],
  testDir: "./tests-examples",
});
