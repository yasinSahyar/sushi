import { test, expect } from "@playwright/test";

import { get_userdata } from "../src/database.js";
import bcrypt from "bcryptjs";

// Nav test
test.describe("Navigation test", () => {
  test("Navigation functioning corrrectly", async ({ page }) => {
    await page.goto("http://localhost:3000/home");
    await page.click(".fa-solid"); // Open navlinks in mobile
    await page.click("text=Menu"); // Click navlink
    await expect(page).toHaveURL("http://localhost:3000/menu"); // Check if correct page
    await page.click(".fa-solid"); // Open navlinks in mobile
    await page.click("text=Contact"); // Click navlink
    await expect(page).toHaveURL("http://localhost:3000/contact"); // Check if correct page
    await page.click(".fa-solid"); // Open navlinks in mobile
    await page.click("text=About"); // Click navlink
    await expect(page).toHaveURL("http://localhost:3000/about"); // Check if correct page
    await page.click(".fa-solid"); // Open navlinks in mobile
    await page.click("text=Home"); // Click navlink
    await expect(page).toHaveURL("http://localhost:3000/home"); // Check if correct page
  });
});

//Visual comparison tests
test("Visual comparison of home page in desktop", async ({ page }) => {
  await page.goto("http://localhost:3000/home");
  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot("home.png");
});

test("Visual comparison of home page in mobile", async ({ page }) => {
  await page.goto("http://localhost:3000/home");
  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot("mobilehome.png");
});

// Form test (register)
test("Form submission saves data to database", async ({ page }) => {
  await page.goto("http://localhost:3000/register");
  await page.fill("#name", "name");
  await page.fill("#surname", "surname");
  await page.fill("#email", "test@hotmail.fi");
  await page.fill("#phone", "0123456789");
  await page.fill("#password", "Playwright1");
  await page.fill("#confirmPassword", "Playwright1");
  await page.click("text=Register"); // Login
  await expect(page).toHaveURL("http://localhost:3000/api/users/register"); // Check if correct page

  // Verify data in the database
  const [rows] = await get_userdata("test@hotmail.fi"); // Query the database for the submitted email
  expect(rows.length).toBe(1); // Ensure one record exists
  expect(rows[0].name).toBe("name"); // Verify name
  expect(rows[0].surname).toBe("surname"); // Verify surname
  expect(rows[0].email).toBe("test@hotmail.fi"); // Verify email
  expect(rows[0].phonenumber).toBe("0123456789"); // Verify phonenumber

  // Verify password
  const isPasswordCorrect = await bcrypt.compare(
    "Playwright1",
    result[0].password
  );
  expect(isPasswordCorrect).toBe(true);
});

// Login test
test.describe("Login test", () => {
  test("User can login", async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto("http://localhost:3000/home");
      await page.click("#login_icon"); // Click login icon
      await page.click("#login_register_option"); // Open login modal
      await page.fill("#loginemail", "test@hotmail.fi");
      await page.fill("#loginpassword", "Playwright1");
      await page.click("#login_button"); // Login
      await expect(page).toHaveURL("http://localhost:3000/home"); // Check if correct page
    } else {
    }
  });
});

// Authentication test
test.describe("Authentication test", () => {
  let page;
  // Login
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("http://localhost:3000/home");
    await page.click("#login_icon");
    await page.click("#login_register_option");
    await page.fill("#loginemail", "test@hotmail.fi");
    await page.fill("#loginpassword", "Playwright1");
    await page.click("#login_button");
  });
  // Test if user can access protected content
  test("User can view protected content after login", async () => {
    // Try to access protected content
    await page.goto("http://localhost:3000/home");
    await page.click("#login_icon"); // Click login icon
    await page.click("#profile_option"); // Click on the profile option
    await expect(page).toHaveURL("http://localhost:3000/profile"); // Verify correct URL
  });
});
