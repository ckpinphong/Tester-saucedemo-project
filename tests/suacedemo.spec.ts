import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Go to the starting url before each test.
    await page.goto('https://www.saucedemo.com/');
    });
    
    test('main navigation', async ({ page }) => {
      // Assertions use the expect API.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
});

test('Login with valid user', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').click();
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').click();
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveTitle(/Swag Labs/);
});



test('Login with invalid user', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').click();
    await page.locator('[data-test="username"]').fill('johnjohn');
    await page.locator('[data-test="password"]').click();
    await page.locator('[data-test="password"]').fill('pasdpasd');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
});

test('Login with blank field', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
});

test('Log in with only enter username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').click();
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');
});

test('Add an item to the cart' , async ({ page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // const backpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    // const bikeLightButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    // const boltShirtButton = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    // await backpackButton.click();
    // await bikeLightButton.click();
    // await boltShirtButton.click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toHaveText('Remove');
    await expect(page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')).toHaveText('Remove');

})

test('Go to cart page' , async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
})

test('Remove an item from the cart' , async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    await page.locator('[data-test="shopping-cart-link"]').click();

    await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
    // await expect(page.locator('cart_item')).not.toContainText('Sauce Labs Bolt T-Shirt');
    // await expect(page.locator('[data-test="inventory-item]')).not.toContainText('Sauce Labs Bolt T-Shirt');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    await expect(page.locator('removed_cart_item')).toBeHidden();
})