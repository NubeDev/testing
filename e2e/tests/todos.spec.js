const { test, expect } = require('@playwright/test');

test.describe('Todos app', () => {
  test('loads the page with title and empty list', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Todos');
    await expect(page.locator('h1')).toHaveText('Todos');
    await expect(page.locator('#todo-input')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('adds a todo item', async ({ page }) => {
    await page.goto('/');
    await page.locator('#todo-input').fill('Buy groceries');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#todo-list li')).toContainText('Buy groceries');
    await expect(page.locator('#todo-input')).toHaveValue('');
  });

  test('adds multiple todo items', async ({ page }) => {
    await page.goto('/');
    const items = ['Walk the dog', 'Read a book'];
    for (const item of items) {
      await page.locator('#todo-input').fill(item);
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('#todo-list li').last()).toContainText(item);
    }
    const count = await page.locator('#todo-list li').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('deletes a todo item', async ({ page }) => {
    await page.goto('/');
    await page.locator('#todo-input').fill('Todo to delete');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#todo-list li')).toContainText('Todo to delete');

    const deleteBtn = page.locator('#todo-list li').filter({ hasText: 'Todo to delete' }).locator('.delete-btn');
    await deleteBtn.click();
    await expect(page.locator('#todo-list li')).not.toContainText('Todo to delete');
  });

  test('does not add empty todo', async ({ page }) => {
    await page.goto('/');
    const before = await page.locator('#todo-list li').count();
    await page.locator('#todo-input').fill('');
    // HTML required attribute prevents submission; input stays empty
    await page.locator('button[type="submit"]').click();
    const after = await page.locator('#todo-list li').count();
    expect(after).toBe(before);
  });
});
