import { test, expect } from '@playwright/test';
import { enterTableView } from '~/shared/testing/e2e/helpers/navigation';

test.describe("create & update person", () => {
test.beforeEach(enterTableView);

test("create and update", async ({ page }) => {
await page.getByRole("heading", { name: "Personenverwaltung" }).getByRole("button").click();
await page.getByRole("menuitem", { name: "Neue Person erstellen" }).click();
await expect(page.getByRole("textbox", { name: "Name", exact: true })).toBeVisible();

    await page.getByRole("textbox", { name: "Name", exact: true }).click();
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Mustermann");
    await page.getByRole("textbox", { name: "Name", exact: true }).press("Tab");

    await page.getByRole("textbox", { name: "PersNr" }).fill("12345678");

    await page.getByRole("textbox", { name: "Vorname" }).click();
    await page.getByRole("textbox", { name: "Vorname" }).fill("Mustermann");

    await page.getByRole("textbox", { name: "BMWK PK" }).click();
    await page.getByRole("textbox", { name: "BMWK PK" }).fill("123456");

    await page.getByTestId("person-rank-combobox").click();
    await page.getByRole("option", { name: "Gefreiter", exact: true }).click();
    await expect(page.getByTestId("person-rank-combobox")).toContainText("Gefreiter");

    await page.getByRole("textbox", { name: "Titel" }).click();
    await page.getByRole("textbox", { name: "Titel" }).fill("title");

    await page.getByRole("textbox", { name: "Telefon Mil" }).click();
    await page.getByRole("textbox", { name: "Telefon Mil" }).fill("12345");
    await page.getByRole("textbox", { name: "Telefon Mil" }).press("Tab");

    await page.getByRole("textbox", { name: "Telefon ziv" }).fill("456");
    await page.getByRole("textbox", { name: "Telefon ziv" }).press("Tab");

    await page.getByRole("textbox", { name: "Email" }).fill("max@gmail.com");

    await page.getByTestId("person-security-combobox").click();
    await page.getByRole("option", { name: "S2" }).click();
    await expect(page.getByTestId("person-security-combobox")).toContainText("S2");

    await page.getByTestId("date-security").click();
    await page.getByLabel("Today").click();

    await page.getByTestId("date-security-s3-start").click();
    await page.getByLabel("Today").click();

    await page.getByRole("button", { name: "Erstellen" }).click();
    await expect(page.getByText("Person erfolgreich erstellt")).toBeVisible();

    await page.getByRole("searchbox", { name: "Suche..." }).click();
    await page.getByRole("searchbox", { name: "Suche..." }).fill("mustermann");
    await expect(page.getByRole("cell", { name: "Mustermann" }).first()).toBeVisible();

    await page.getByRole("cell", { name: "Mustermann" }).first().click();
    await expect(page.getByTestId("person-details")).toBeVisible();

    await page.getByTestId("person-details").getByRole("button").click();
    await page.getByRole("menuitem", { name: "Person bearbeiten" }).click();

    await page.getByRole("link").filter({ hasText: /^$/ }).click();
    await expect(page.getByText("Mustermann").first()).toBeVisible();

    await page.getByRole("searchbox", { name: "Suche..." }).click();
    await page.getByRole("searchbox", { name: "Suche..." }).fill("mustermann");

    await page.getByRole("cell", { name: "Mustermann" }).first().click();

    await page.getByTestId("person-details").getByRole("button").click();
    await page.getByRole("menuitem", { name: "Person bearbeiten" }).click();

    await expect(page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("Mustermann");

    await page.getByRole("textbox", { name: "Name", exact: true }).click();
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Neuer Name");

    await page.getByRole("button", { name: "Aktualisieren" }).click();
    await expect(page.getByText("Person erfolgreich aktualisiert")).toBeVisible();

    await page.getByRole("searchbox", { name: "Suche..." }).click();
    await page.getByRole("searchbox", { name: "Suche..." }).fill("neuer name");

    await expect(page.getByRole("cell", { name: "Neuer Name" })).toBeVisible();

});

test("basic navigation", async ({ page }) => {
await page.getByRole("heading", { name: "Personenverwaltung" }).getByRole("button").click();
await page.getByRole("menuitem", { name: "Neue Person erstellen" }).click();
await expect(page.getByRole("button", { name: "Erstellen" })).toBeVisible();

    await page.getByRole("link").filter({ hasText: /^$/ }).click();
    await expect(page.getByRole("heading", { name: "Personenverwaltung" })).toBeVisible();

    await page.getByRole("heading", { name: "Personenverwaltung" }).getByRole("button").click();
    await page.getByRole("link", { name: "Neue Person erstellen" }).click();
    await expect(page.getByRole("button", { name: "Erstellen" })).toBeVisible();

    await page.getByRole("button", { name: "Verwerfen" }).click();
    await expect(page.getByText("Änderungen verwerfen?")).toBeVisible();

    await page.getByRole("button", { name: "Ja, verwerfen" }).click();
    await expect(page.getByRole("heading", { name: "Personenverwaltung" })).toBeVisible();

});
});
