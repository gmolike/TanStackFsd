import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to login', async ({ page }) => {
    // Gehe zur Login-Seite
    await page.goto('/login');

    // Überprüfe, ob das Login-Formular angezeigt wird
    await expect(page.getByTestId('login-form')).toBeVisible();

    // Fülle das Formular aus
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('test123');

    // Klicke auf den Login-Button
    await page.getByRole('button', { name: 'Login' }).click();

    // Überprüfe, ob wir zum Dashboard weitergeleitet wurden
    await expect(page).toHaveURL('/dashboard');

    // Überprüfe, ob das Dashboard-Element sichtbar ist
    await expect(page.getByTestId('dashboard')).toBeVisible();
  });

  test('should show an error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrong');

    await page.getByRole('button', { name: 'Login' }).click();

    // Überprüfe, ob wir immer noch auf der Login-Seite sind
    await expect(page).toHaveURL('/login');

    // Überprüfe, ob eine Fehlermeldung angezeigt wird
    await expect(page.getByTestId('login-error')).toBeVisible();
  });
});
