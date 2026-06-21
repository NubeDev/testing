const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ request }) => {
  // Clear all todos by fetching and deleting each one
  const res = await request.get('http://localhost:3000/api/todos');
  const todos = await res.json();
  for (const todo of todos) {
    await request.delete(`http://localhost:3000/api/todos/${todo.id}`);
  }
});

test('add a todo', async ({ page }) => {
  await page.goto('/');

  await page.fill('#todo-input', 'Buy groceries');
  await page.click('button[type="submit"]');

  await expect(page.locator('#todo-list li')).toHaveCount(1);
  await expect(page.locator('#todo-list li .todo-title')).toContainText('Buy groceries');
});

test('add multiple todos', async ({ page }) => {
  await page.goto('/');

  await page.fill('#todo-input', 'First task');
  await page.click('button[type="submit"]');

  await page.fill('#todo-input', 'Second task');
  await page.click('button[type="submit"]');

  await expect(page.locator('#todo-list li')).toHaveCount(2);
  await expect(page.locator('#todo-list li').nth(0).locator('.todo-title')).toContainText('First task');
  await expect(page.locator('#todo-list li').nth(1).locator('.todo-title')).toContainText('Second task');
});

test('edit a todo', async ({ page }) => {
  await page.goto('/');

  // Add a todo first
  await page.fill('#todo-input', 'Original title');
  await page.click('button[type="submit"]');
  await expect(page.locator('#todo-list li')).toHaveCount(1);

  // Click Edit
  await page.locator('#todo-list li .edit-btn').click();

  // The edit input should appear with the current title
  const editInput = page.locator('#todo-list li .edit-input');
  await expect(editInput).toBeVisible();
  await expect(editInput).toHaveValue('Original title');

  // Change the title and save
  await editInput.fill('Updated title');
  await page.locator('#todo-list li .save-btn').click();

  // Should show the updated title
  await expect(page.locator('#todo-list li .todo-title')).toContainText('Updated title');
  await expect(page.locator('#todo-list li .todo-title')).not.toContainText('Original title');
});

test('edit todo via Enter key', async ({ page }) => {
  await page.goto('/');

  await page.fill('#todo-input', 'Press enter to save');
  await page.click('button[type="submit"]');
  await expect(page.locator('#todo-list li')).toHaveCount(1);

  await page.locator('#todo-list li .edit-btn').click();
  const editInput = page.locator('#todo-list li .edit-input');
  await editInput.fill('Saved with Enter');
  await editInput.press('Enter');

  await expect(page.locator('#todo-list li .todo-title')).toContainText('Saved with Enter');
});

test('cancel edit restores original title', async ({ page }) => {
  await page.goto('/');

  await page.fill('#todo-input', 'Keep this title');
  await page.click('button[type="submit"]');
  await expect(page.locator('#todo-list li')).toHaveCount(1);

  await page.locator('#todo-list li .edit-btn').click();
  const editInput = page.locator('#todo-list li .edit-input');
  await editInput.fill('Discard this');
  await page.locator('#todo-list li .cancel-btn').click();

  await expect(page.locator('#todo-list li .todo-title')).toContainText('Keep this title');
});

test('delete a todo', async ({ page }) => {
  await page.goto('/');

  await page.fill('#todo-input', 'Delete me');
  await page.click('button[type="submit"]');
  await expect(page.locator('#todo-list li')).toHaveCount(1);

  await page.locator('#todo-list li .delete-btn').click();
  await expect(page.locator('#todo-list li')).toHaveCount(0);
});
