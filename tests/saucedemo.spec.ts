import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
    // const loginData = {
    //     url: 'https://www.saucedemo.com/',
    //     username: 'standard_user',
    //     password: 'secret_sauce',
    //     usernameLocator: '[data-test="username"]',
    //     passwordLocator: '[data-test="password"]',
    //     loginButtonLocator: '[data-test="login-button"]',
    //     expectedUrlRegex: /inventory/
    // };
    test.beforeEach(async ({ page }) => {
      // Go to the starting url before each test.
        await page.goto('https://www.saucedemo.com/');
    });
    
    test('main navigation', async ({ page }) => {
      // Assertions use the expect API.
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

// test('Positive: Login with valid username and password', async ({ page }) => {
//     await page.locator(loginData.usernameLocator).fill(loginData.username);
//     await page.locator(loginData.passwordLocator).fill(loginData.password);
//     await page.locator(loginData.loginButtonLocator).click();
//     await expect(page).toHaveURL(loginData.expectedUrlRegex);
// });

    test('Positive: Login with valid username and password', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await expect(page).toHaveTitle(/Swag Labs/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Products');
    });

    test('Positive: Login with valid username but locked-out user password', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('locked_out_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');});

    test('Positive: Login with problem user', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('problem_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await expect(page).toHaveTitle(/Swag Labs/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Products');
        await expect(page.locator('[data-test="inventory-item-sauce-labs-backpack-img"]')).toBeVisible('sl-404.168b1cce.jpg');
    });

    test('Positive: Login with performance glitch user', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('performance_glitch_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await expect(page).toHaveTitle(/Swag Labs/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Products');
    });

    test('Positive: Login with error user', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('error_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="inventory-item-sauce-labs-bike-light-img"]').click();
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');
        await expect(page.locator('[data-test="inventory-item-desc"]')).toBeVisible('A description should be here, but it failed to render! This error has been reported to Backtrace.');

    });

    test('Positive: Login with visual user', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('visual_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await expect(page).toHaveTitle(/Swag Labs/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Products');
        //visual user จะสุ่มราคาทุกครั้งที่รีเฟรชหน้าจอ
        const items = await page.locator('.inventory_item_price').all();
        const randomIndex = Math.floor(Math.random() * items.length);
        const randomItemPrice = await items[randomIndex].innerText();
        await expect(randomItemPrice).toMatch(/^\$\d+\.\d{2}$/);
    });


    test('Negative: Login with invalid uesrname', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('invalid_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test('Negative: Login with invalid password', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('wrong_password');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test('Negative: Login with empty field', async ({ page }) => {
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    });

    test('Negative: Login with empty username field', async ({ page }) => {
        await page.locator('[data-test="password"]').fill('wrong_password');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    });

    test('Negative: Login with empty password field', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');
    });

    test('Positive: Check the products are displayed correctly', async ({ page}) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);

        const productTitles = [
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ];
        for (let i = 0; i < productTitles.length; i++) {
            await expect(page.locator(`[data-test="item-${i}-title-link"]`)).toHaveText(productTitles[i]);
        }
        // await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
        // await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
        // await expect(page.locator('[data-test="item-1-title-link"]')).toHaveText('Sauce Labs Bolt T-Shirt');
        // await expect(page.locator('[data-test="item-5-title-link"]')).toHaveText('Sauce Labs Fleece Jacket');
        // await expect(page.locator('[data-test="item-2-title-link"]')).toHaveText('Sauce Labs Onesie');
        // await expect(page.locator('[data-test="item-3-title-link"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
    });

    test('Positive: Add product "Sauce Labs Backpack" to the cart' , async ({ page}) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);

        const backpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        await backpackButton.click();
        // await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
    });

    test('Positive: Add product"Sauce Labs Bike Light" to the cart' , async ({ page}) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toHaveText('Remove');
    });

    test('Positive: Sort products by price from low to high', async ({ page }) => {

        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.selectOption('.product_sort_container', { label: 'Price (low to high)' });
        await page.waitForSelector('.inventory_item');
    //  ตรวจสอบว่า item 3 อย่างแรกถูกต้อง Array แปลงข้อมูลเป็น float แล้วตัด $ กับช่องว่างออก
        const prices = await page.$$eval('.inventory_item_price', prices => prices.map(price => parseFloat(price.textContent.replace('$', '').trim())));
    //  เช็คว่า items 3 อย่างแรกถูกต้องตามลำดับ low-high
        await expect(prices[0]).toBeLessThanOrEqual(prices[1]);
        await expect(prices[1]).toBeLessThanOrEqual(prices[2]);
    });

    test('Positive: Sort products by price from high to low', async ({ page }) => {

        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.selectOption('.product_sort_container', { label: 'Price (high to low)' });
        await page.waitForSelector('.inventory_item');
    //  ตรวจสอบว่า item 3 อย่างแรกถูกต้อง Array แปลงข้อมูลเป็น float แล้วตัด $ กับช่องว่างออก
        const prices = await page.$$eval('.inventory_item_price', prices => prices.map(price => parseFloat(price.textContent.replace('$', '').trim())));
    //  เช็คว่า items 3 อย่างแรกถูกต้องตามลำดับ high-low
        await expect(prices[0]).toBeGreaterThanOrEqual(prices[1]);
        await expect(prices[1]).toBeGreaterThanOrEqual(prices[2]);
    });

    test('Positive: Verify that product descriptions are visible', async ({ page}) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="inventory-item-sauce-labs-backpack-img"]').click();
        await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
    });

    test('Positive: Verify that user can go to the cart page' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');   
    });

    test('Positive: Remove an item from the cart' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);

        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await expect(page.locator('removed_cart_item')).toBeHidden();
    });

    test('Positive: Verify that user can proceed to checkout' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);

        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');
    });

    test('Positive: Enter valid information for checkout' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');

        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Nonlen');
        await page.locator('[data-test="postalCode"]').fill('80000');
        await page.locator('[data-test="continue"]').click();
        await expect(page).toHaveURL(/step-two/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Overview');
        await expect(page.locator('[data-test="payment-info-label"]')).toBeVisible('Payment Information:');
        await expect(page.locator('[data-test="shipping-info-label"]')).toBeVisible('Shipping Information:');
        await expect(page.locator('[data-test="total-info-label"]')).toBeVisible('Price Total');
    });

    test('Negative: Enter invalid information for checkout (empty first name)' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');

        await page.locator('[data-test="lastName"]').fill('Nonlen');
        await page.locator('[data-test="postalCode"]').fill('80000');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toBeVisible('Error: First Name is required');
    });

    test('Negative: Enter invalid information for checkout (empty last name)' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');

        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="postalCode"]').fill('80000');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toBeVisible('Error: Last Name is required');
    });

    test('Negative: Enter invalid information for checkout (empty zip/postal code)' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');

        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Nonlen');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toBeVisible('Error: Postal Code is required');
    });

    test('Positive: Verify order summary' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');

        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Nonlen');
        await page.locator('[data-test="postalCode"]').fill('80000');
        await page.locator('[data-test="continue"]').click();
        await expect(page).toHaveURL(/step-two/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Overview');
        await expect(page.locator('[data-test="inventory-item-name"]')).toBeVisible(/29.99/);
        await expect(page.locator('[data-test="inventory-item-price"]')).toBeVisible(/29.99/);
        await expect(page.locator('[data-test="payment-info-label"]')).toBeVisible('Payment Information:');
        await expect(page.locator('[data-test="payment-info-value"]')).toBeVisible('SauceCard #31337');
        await expect(page.locator('[data-test="shipping-info-label"]')).toBeVisible('Shipping Information:');
        await expect(page.locator('[data-test="shipping-info-value"]')).toBeVisible('Free Pony Express Delivery!');
        await expect(page.locator('[data-test="total-info-label"]')).toBeVisible('Price Total');
        await expect(page.locator('[data-test="inventory-item-price"]')).toBeVisible(/29.99/);
    });

    test('Positive: Complete the order' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');

        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Nonlen');
        await page.locator('[data-test="postalCode"]').fill('80000');
        await page.locator('[data-test="continue"]').click();
        await expect(page).toHaveURL(/step-two/);
        await page.locator('[data-test="finish"]').click();
        await expect(page).toHaveURL(/checkout-complete/);
        await expect(page.locator('[data-test="complete-header"]')).toBeVisible('Thank you for your order!');
    });

    test('Positive: Return to homepage after completing order' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');

        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Nonlen');
        await page.locator('[data-test="postalCode"]').fill('80000');
        await page.locator('[data-test="continue"]').click();
        await expect(page).toHaveURL(/step-two/);
        await page.locator('[data-test="finish"]').click();
        await expect(page).toHaveURL(/checkout-complete/);
        await page.locator('[data-test="back-to-products"]').click();
        await expect(page).toHaveURL(/inventory/);
        await expect(page).toHaveTitle(/Swag Labs/);
    });

    test('Positive: Complete the entire purchase flow from login to order completion' , async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory/);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/step-one/);
        await expect(page.locator('[data-test="title"]')).toBeVisible('Checkout: Your Information');
        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Nonlen');
        await page.locator('[data-test="postalCode"]').fill('80000');
        await page.locator('[data-test="continue"]').click();
        await expect(page).toHaveURL(/step-two/);
        await page.locator('[data-test="finish"]').click();
        await expect(page).toHaveURL(/checkout-complete/);
        await expect(page.locator('[data-test="complete-header"]')).toBeVisible('Thank you for your order!');
    });
});