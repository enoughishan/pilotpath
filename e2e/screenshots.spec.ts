import { test } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const outputDir = path.resolve('docs/screenshots')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const screens = [
  { name: '01_landing_page', path: '/' },
  { name: '02_pathway_board', path: '/app/pathway' },
  { name: '03_challenge_workspace', path: '/app/challenges/CH-014' },
  { name: '04_discovery_matching', path: '/app/challenges/CH-014?tab=startups' },
  { name: '05_eligibility_screening', path: '/app/challenges/CH-014?tab=screening' },
  { name: '06_evaluator_workspace', path: '/app/evaluator/queue' },
  { name: '07_finance_payments', path: '/app/finance/payments' },
  { name: '08_scaleup_decision', path: '/app/challenges/CH-004?tab=scaleup' },
  { name: '09_public_transparency', path: '/public' },
  { name: '10_admin_governance', path: '/app/admin/overview' },
]

test.describe('Automated Visual Showcase & Responsive Screenshot Capture', () => {
  test.beforeEach(async ({ page }) => {
    // Initialise IndexedDB mock seed
    await page.goto('/')
    await page.waitForTimeout(800)
  })

  for (const screen of screens) {
    test(`Capture ${screen.name} at 1440px desktop`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(screen.path)
      await page.waitForTimeout(1200)
      await page.screenshot({
        path: path.join(outputDir, `${screen.name}_1440px.png`),
        fullPage: false,
      })
    })

    test(`Capture ${screen.name} at 390px mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(screen.path)
      await page.waitForTimeout(1200)
      await page.screenshot({
        path: path.join(outputDir, `${screen.name}_390px.png`),
        fullPage: false,
      })
    })
  }

  test('Capture 01_landing_page dark theme at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark')
    })
    await page.waitForTimeout(400)
    await page.screenshot({
      path: path.join(outputDir, '01_landing_page_1440px_dark.png'),
    })
  })

  test('Capture 02_pathway_board dark theme at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/app/pathway')
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark')
    })
    await page.waitForTimeout(400)
    await page.screenshot({
      path: path.join(outputDir, '02_pathway_board_1440px_dark.png'),
    })
  })
})
