import {test, expect} from "@playwright/test";
import { login } from "./helpers/login";

const ADD_USER: string[] = [
  'J',
  'Nina12',
  'test123',
  'test123'
] as const;

test('Search Admin', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Admin' }).click()
    await page.getByRole('textbox').nth(1).fill('Admin')

    await page.locator('.oxd-select-text').first().click()
    const option = page.getByRole('option', { name: 'Admin' })
    await expect(option).toBeVisible()
    await option.click()

    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByText('Admin').nth(2)).toBeVisible()

})

test('Reset Searching', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Admin' }).click()
    await page.getByRole('textbox').nth(1).fill('Admin')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByText('Record Found')).toBeVisible()

    await page.getByRole('button', { name: 'Reset' }).click()
    await expect(page.getByText('Records Found')).toBeVisible()
})

test('Success Add User', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Admin' }).click()
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible()
    await page.locator('.oxd-select-text').first().click()
    await page.getByRole('option', { name: 'Admin' }).click()
    // await expect(page.locator('form').getByText('Admin')).toHaveText('Admin')

    await page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2).click()
    await page.getByRole('option', { name: 'Enabled' }).click()
    await expect(page.getByText('Enabled')).toBeVisible()

    const fieldName = page.getByRole('textbox', { name: 'Type for hints...' })
    await fieldName.click()
    await fieldName.fill(ADD_USER[0])
    await expect(page.getByText('James Butler').first()).toBeVisible()
    await page.getByText('James Butler').first().click()

    await page.getByRole('textbox').nth(2).fill(ADD_USER[1])
    await page.getByRole('textbox').nth(3).fill(ADD_USER[2])
    await page.getByRole('textbox').nth(4).fill(ADD_USER[3])

    await page.getByRole('button', { name: 'Save' }).click()

    const errorVisible = await page.getByText('Already exists').isVisible()

    if(errorVisible) {
        let userName = ADD_USER[1]
        userName = 'Cacha1';
        await page.getByRole('textbox').nth(2).fill(ADD_USER[1])
        await page.getByRole('button', { name: 'Save' }).click()
        await expect(page.locator('.oxd-loading-spinner')).toBeVisible()
        await expect(page.getByText('Cacha1')).toBeVisible()
    }else {
        // await expect(page.locator('p')).toContainText('Success')
        await expect(page.locator('.oxd-loading-spinner')).toBeVisible()
        await expect(page.getByText('Nina12')).toBeVisible()
    }
})

test('Success Delete User', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Admin' }).click()

    await page.getByRole('row').nth(5).getByRole('button').first().click()
    await expect(page.getByText('Are you Sure?')).toBeVisible()
    await page.getByRole('button', { name: 'Yes, Delete' }).click()
    await expect(page.getByRole('table').locator('div').nth(2)).toBeVisible()
    await expect(page.getByRole('row').nth(5).getByRole('button').first()).toBeHidden()
})

test('Edit data user', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Admin' }).click()

    await page.getByRole('row').nth(3).getByRole('button').last().click()
    await page.getByRole('textbox').nth(2).fill('Yesaya')
    await page.getByRole('button', { name: 'Save' }).click()
    // await expect(page.locator('p')).toContainText('Success')

    const errorVisible = await page.getByText('Already exists').isVisible()

    if(errorVisible) {
        await page.getByRole('textbox').nth(2).fill('Chika12')
        await page.getByRole('button', { name: 'Save' }).click()
        await expect(page.locator('.oxd-loading-spinner')).toBeVisible()
        await expect(page.getByText('Chika12')).toBeVisible()
    } else {
        await expect(page.locator('.oxd-loading-spinner')).toBeVisible()
        await expect(page.getByText('Yesaya')).toBeVisible()
    }
})

test('Click menu job', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Admin' }).click()
    await page.getByRole('listitem').filter({ hasText: 'Job' }).click()
    await expect(page.getByRole('menuitem', { name: 'Job Titles' })).toBeVisible()
    await page.getByRole('listitem').filter({ hasText: /^Job Titles$/ }).click()
    await expect(page.getByRole('heading', { name: 'Job Titles' })).toBeVisible()
})