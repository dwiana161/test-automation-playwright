import {test, expect} from "@playwright/test";
import { login } from "./helpers/login";

test('Success Login to Orange web', async ({ page }) => {
    await login(page)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
    