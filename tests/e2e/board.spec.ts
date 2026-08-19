import { expect, test } from "@playwright/test";

test("an employee can submit and find a request but cannot curate it", async ({ page }) => {
  const title = `Playwright request ${Date.now()}`;

  await page.goto("/login");
  await page.getByLabel("Email").fill("employee@example.com");
  await page.getByLabel("Password").fill(process.env.SEED_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Internal Feature Request Board" })).toBeVisible();

  await page.getByRole("button", { name: "Submit Request" }).click();
  await page.getByLabel(/^Title/).fill(title);
  await page.getByLabel(/^Description/).fill("Created by the end-to-end test suite.");
  await page.getByRole("button", { name: "Submit Request", exact: true }).last().click();

  await page.getByLabel("Search").fill(title);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await page.getByRole("link", { name: new RegExp(title) }).click();
  await page.waitForURL(/\/requests\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit" })).toHaveCount(0);

  const requestId = new URL(page.url()).pathname.split("/").at(-1);
  const response = await page.request.put(`/api/feature-requests/${requestId}`, {
    data: { status: "planned" },
  });
  expect(response.status()).toBe(403);
});
