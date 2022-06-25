import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.tidio.com/panel/register");
});

export const getNewEmail = (): string =>
  `testing+${new Date().getTime()}@tidio.net`;

let password = (Math.random() + 1).toString(36).substring(2);

test.describe("Widget tests", () => {
  test("Send message from widget to panel and from panel to widget", async ({
    page,
  }) => {
    await test.step("Register new account", async () => {
      await page.locator('[placeholder="Email"]').fill(getNewEmail());
      await page.locator('[placeholder="Password"]').fill(password);
      await page.locator('[placeholder="Website"]').fill("example.com");
      await page.locator('[type="checkbox"]').click();
      await page.locator("button", { hasText: "Get started" }).click();
      await expect(
        page.locator("h3", { hasText: "Configure your live chat" })
      ).toBeVisible();
    });
    await test.step("Complete tour", async () => {
      const continueButton = page.locator("css=button >> text=Continue");
      await page.locator("//*[text()='Your name']/..//input").fill("user");
      await continueButton.click();
      await page
        .locator("//*[text()='Number of support agents']/..//input")
        .fill("5");
      await page.locator('//label[text()="What\'s your industry?"]/..').click();
      await page.locator('text="Online Store"').click();
      await page.locator('//label[text()="Number of customers"]/..').click();
      await page.locator('text="6-25"').click();
      await page
        .locator(
          "//*[contains(text(),'I want to have a customer service tool')]"
        )
        .click();
      await continueButton.click();
      await continueButton.click();
      await continueButton.click();
      await page.locator('text="Skip now & go to main dashboard"').click();
      await expect(page.locator("h2", { hasText: "News Feed" })).toBeVisible();
    });
    await test.step(
      "Simulate visitor and send message from widget to panel",
      async () => {
        await page.locator('data-test-id=conversations-section-button').click();
        const [popup] = await Promise.all([
          page.waitForEvent('popup'),
          page.locator('.btn-primary.undefined').click(),
        ]);
        const chat = popup.frameLocator('#tidio-chat-iframe');
        await expect(chat.locator('data-testid=flyMessage')).toBeVisible();
        await chat.locator('[title="No, thanks."]').click();
        await chat.locator('[data-testid="newMessageTextarea"]').fill('test message');
        await chat.locator('[data-testid="widgetButtonBody"]').click();
        await chat.locator('[type=email]').fill('qa@test.pl');
        await chat.locator('.user-data-modal-submit').click();
        await expect(page.locator('.visitor-list')).toBeVisible();
      }
    );
    await test.step("Send a reply message from the panel", async () => {
      await page.locator('.visitor-list').click();
      await page.locator('.btn-primary.undefined').first().click();
      await page.locator('data-test-id=new-message-textarea').fill('reply message');
      await page.keyboard.down('Enter');
      await expect(page.locator("span", { hasText: "reply message" })).toBeVisible();
    });
  });
});
