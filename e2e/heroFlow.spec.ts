import { test, expect } from '@playwright/test'

/**
 * Full 12-step hero flow (docs/DEMO_SCRIPT.md), end to end, fully offline.
 *
 * The journey walks every role persona through the 10-stage lifecycle: gate
 * failure, challenge creation, discovery, screening, blind evaluation, ranking,
 * pilot design, contract, monitoring, milestone payment release, validation,
 * scale-up adoption, the public ledger, and audit-chain verification/tampering.
 *
 * Guardrails asserted at the end:
 *  - no network request ever leaves the local dev server (offline),
 *  - no console/page errors,
 *  - the whole journey finishes in under 8 minutes.
 */
test('hero flow: landing to audit-chain tamper, no dead ends, offline, < 8 min', async ({ page }) => {
  test.setTimeout(10 * 60 * 1000)
  const startedAt = Date.now()

  const externalRequests: string[] = []
  const consoleErrors: string[] = []
  const dialogs: string[] = []

  page.on('request', (req) => {
    const url = req.url()
    if (
      /^https?:/.test(url) &&
      !url.startsWith('http://localhost:5173') &&
      !url.startsWith('http://127.0.0.1:5173')
    ) {
      externalRequests.push(url)
    }
  })
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`))
  page.on('dialog', async (dialog) => {
    dialogs.push(dialog.message())
    await dialog.accept()
  })

  const openDemoControls = async () => {
    await page.getByRole('button', { name: 'Demo Controls', exact: true }).click()
  }
  const closeDemoControls = async () => {
    await page.getByRole('button', { name: 'Close demo controls', exact: true }).click()
  }
  const switchPersona = async (label: string) => {
    await openDemoControls()
    await page.getByRole('button', { name: label, exact: true }).click()
    await closeDemoControls()
  }

  // ---- Step 1: Landing -> pick Officer -> Pathway board ----------------------
  await page.goto('/')
  await expect(page.getByText('Meera Kulkarni', { exact: true })).toBeVisible({ timeout: 30000 })
  await page.locator('#persona-section').getByText('Meera Kulkarni', { exact: true }).click()
  await expect(page).toHaveURL(/\/app\/pathway/)
  await expect(page.getByText('Pathway Board', { exact: true })).toBeVisible()

  // ---- Step 2: Try to move CH-019 past a failing gate -------------------------
  const ch019Card = page.locator('[aria-label^="CH-019:"]')
  await expect(ch019Card).toBeVisible({ timeout: 20000 })
  await page
    .getByRole('button', {
      name: 'Move CH-019 to the next stage (keyboard alternative to drag)',
      exact: true,
    })
    .click()
  await expect(page.getByText('Stage 2 Gate: Discovery', { exact: true })).toBeVisible()
  await expect(page.getByText('Gate Blocked', { exact: true })).toBeVisible()
  await expect(
    page.getByText('Minimum 3 applications required (currently 0).', { exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Close', exact: true }).click()

  // ---- Step 3: Create a new challenge with the sample problem ------------------
  await page.getByRole('button', { name: 'New challenge', exact: true }).click()
  await expect(page).toHaveURL(/\/app\/challenges\/new/)
  await page.getByRole('button', { name: 'Use sample problem', exact: true }).click()
  await page.getByRole('button', { name: 'Draft problem statement (AI Assistant)', exact: true }).click()
  await expect(page.getByText(/A quarter of treated water/).first()).toBeVisible()
  await expect(page.getByText('Quality Gate Passed', { exact: true })).toBeVisible()
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: 'Next Step', exact: true }).click()
  }
  await page
    .getByLabel('Approver sign-off on challenge file (Joint Director Meera Kulkarni)')
    .check()
  await page.getByRole('button', { name: 'Publish Challenge', exact: true }).click()
  await page.waitForURL(/\/app\/challenges\/CH-0\d+\?tab=overview/)
  await expect(
    page.getByRole('heading', { name: 'Cut water lost in ward supply networks', exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Advance to Stage 2', exact: true }).click()
  await page.getByRole('button', { name: 'Move to Stage 2', exact: true }).click()

  // ---- Step 4: Simulate applications arriving + advance the demo clock --------
  await page.goto('/app/pathway')
  await expect(ch019Card).toBeVisible({ timeout: 20000 })
  await openDemoControls()
  await page.getByRole('button', { name: 'Simulate applications arriving', exact: true }).click()
  await expect(page.getByText('3 applications arrived for CH-019.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '+7 Days', exact: true }).click()
  await expect(page.getByText('2026-09-29', { exact: true }).first()).toBeVisible()
  await closeDemoControls()
  // Let the board's data-changed listener finish reloading before the move.
  await page.waitForTimeout(500)

  // The gate now passes: move CH-019 into Stage 3 on the board.
  await page
    .getByRole('button', {
      name: 'Move CH-019 to the next stage (keyboard alternative to drag)',
      exact: true,
    })
    .click()
  await expect(page.getByText('Advance Stage Gate?', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Move to next stage', exact: true }).click()
  await expect(page.locator('#col-3').getByText('CH-019', { exact: true })).toBeVisible()

  // ---- Step 5: Screening - run rules, shortlist, advance to Evaluation ---------
  await ch019Card.click()
  await expect(page).toHaveURL(/CH-019\?tab=overview/)
  await expect(page.getByRole('button', { name: 'Startups 3', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Screening', exact: true }).click()
  await page.getByRole('button', { name: 'Shortlist 3 startups', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Advance to Evaluation', exact: true })).toBeVisible()
  expect(dialogs).toContain('Shortlist saved for evaluation stage.')
  await page.getByRole('button', { name: 'Advance to Evaluation', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Advance to Stage 5', exact: true })).toBeVisible()
  expect(dialogs).toContain('Advanced to Stage 4 (Evaluation).')

  // ---- Step 6: Evaluator - declare no conflict, score blind, lock ---------------
  await switchPersona('Evaluator (Arvind)')
  await page.goto('/app/evaluator/queue')
  await page.getByRole('button', { name: 'No Conflict (Proceed)', exact: true }).click()
  await expect(
    page.getByText('Applicant: Startup S-01 (Blind Mode)', { exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Lock scores', exact: true }).click()
  await expect(page.getByText('Applicant: Aquavrit Systems', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Scores Locked', exact: true })).toBeVisible()
  expect(dialogs).toContain('Scores locked successfully.')

  // ---- Step 7: Officer - approve ranking, advance to Pilot design ---------------
  await switchPersona('Officer (Meera)')
  await page.goto('/app/challenges/CH-019?tab=evaluation')
  await page
    .getByRole('button', { name: 'Approve ranking & unlock next stage', exact: true })
    .click()
  await expect(page.getByRole('button', { name: 'Ranking approved', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Advance to Stage 5', exact: true }).click()
  await page.getByRole('button', { name: 'Move to Stage 5', exact: true }).click()

  // ---- Step 8: Pilot design - fill with demo shortcut, then Contract -------------
  await page.getByRole('button', { name: 'Pilot', exact: true }).click()
  await page.getByRole('button', { name: 'Fill with demo shortcut', exact: true }).click()
  await expect(page.getByText('PILOT PROTOCOL: pilot-019', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Advance to Stage 6', exact: true }).click()
  await page.getByRole('button', { name: 'Move to Stage 6', exact: true }).click()

  // Startup accepts the pilot agreement.
  await switchPersona('Startup (Sana)')
  await page.goto('/app/startup/home')
  await expect(
    page.getByText('Pilot agreement awaiting your acceptance', { exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Accept pilot terms', exact: true }).click()
  await expect(page.getByText('Accepted', { exact: true })).toBeVisible()
  expect(dialogs).toContain('Pilot terms accepted. The agreement is now binding.')

  // Officer accepts the contract on behalf of the department.
  await switchPersona('Officer (Meera)')
  await page.goto('/app/challenges/CH-019?tab=contract')
  await page.getByRole('button', { name: 'Accept on behalf of department', exact: true }).click()
  await expect(page.getByText('Department Accepted', { exact: true })).toBeVisible()
  expect(dialogs).toContain('Contract accepted on behalf of the department.')
  await expect(page.getByText('Startup Accepted', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Advance to Stage 7', exact: true }).click()
  await page.getByRole('button', { name: 'Move to Stage 7', exact: true }).click()

  // ---- Step 9: Open CH-014 mid-pilot and check the KPI chart ----------------------
  await page.goto('/app/challenges/CH-014?tab=pilot')
  await expect(page.getByText('PILOT PROTOCOL: pilot-014', { exact: true })).toBeVisible()
  await expect(page.getByText('Non-revenue water %', { exact: true }).first()).toBeVisible()

  // Finance verifies, approves (different user) and releases the M3 payment.
  await switchPersona('Finance (Rakesh)')
  await page.goto('/app/finance/payments')
  const m3Row = page.locator('tr').filter({
    hasText: 'M3 Non-revenue water at or below 32% by day 45',
  })
  await expect(m3Row).toBeVisible()
  await m3Row.getByRole('button', { name: 'Review & Release', exact: true }).click()
  await page
    .getByRole('button', { name: '1. Verify Evidence (Accounts Officer Rakesh)', exact: true })
    .click()
  await page
    .getByRole('button', { name: '2. Approve Milestone (Senior Accounts Officer Anita)', exact: true })
    .click()
  await page
    .getByRole('button', { name: '3. Release Payment & Log Ledger Entry', exact: true })
    .click()
  // The drawer closes when the release completes.
  await expect(
    page.getByRole('button', { name: '3. Release Payment & Log Ledger Entry', exact: true })
  ).toBeHidden()
  expect(dialogs.some((d) => d.includes('released to Aquavrit Systems'))).toBe(true)

  // ---- Step 10: Validator signs a pass on CH-008 ----------------------------------
  await switchPersona('Validator (Nandini)')
  await page.goto('/app/validator/assignments')
  await expect(
    page.getByText('Validation Assignment: CH-008 Air-quality Hotspot Mapping', { exact: true })
  ).toBeVisible()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Sign Report & Lock', exact: true }).click()
  await expect(page.getByText('Report Signed & Locked', { exact: true })).toBeVisible()
  expect(dialogs).toContain('Validation report signed and locked. Audit entry recorded.')

  // ---- Step 11: Scale-up decision + district adoption on CH-004 -------------------
  await switchPersona('Officer (Meera)')
  await page.goto('/app/challenges/CH-004?tab=scaleup')
  await page.getByRole('button', { name: 'Record decision & sign off', exact: true }).click()
  await expect(page.getByText('Decision recorded & signed off', { exact: true })).toBeVisible()
  expect(dialogs).toContain('Scale-up decision recorded and signed off.')
  const jheelpurTile = page.getByText('Jheelpur', { exact: true }).locator('..')
  await jheelpurTile.click()
  // The tile status text is rendered uppercase via CSS; the DOM keeps lowercase.
  await expect(jheelpurTile.getByText('requested', { exact: true })).toBeVisible()
  expect(dialogs).toContain('Adoption requested for district Jheelpur.')

  // ---- Step 12: Public dashboard, then admin audit-chain verify + tamper -----------
  // /public renders outside the app shell (no footer), so switch persona first.
  await switchPersona('Admin (Farah)')
  await page.goto('/public')
  await expect(
    page.getByText('Programme Performance in Numbers', { exact: true })
  ).toBeVisible()

  await page.goto('/app/admin/overview')
  await page.getByRole('button', { name: 'Audit Chain', exact: true }).click()
  await page.getByRole('button', { name: 'Verify chain', exact: true }).click()
  await expect(page.getByText(/Chain intact, \d+ events verified\./)).toBeVisible()

  await openDemoControls()
  await page.getByRole('button', { name: 'Tamper Audit Event', exact: true }).click()
  await closeDemoControls()
  await page.getByRole('button', { name: 'Verify chain', exact: true }).click()
  await expect(page.getByText(/Audit chain verification failed at event aud-001!/)).toBeVisible()

  // ---- Reset the demo data so the suite always ends in a pristine state -----------
  await openDemoControls()
  await page.getByRole('button', { name: 'Reset Data', exact: true }).click()
  await page.waitForLoadState('load')
  await expect(page.getByText('Admin Governance Workspace', { exact: true })).toBeVisible()

  // ---- Guardrails: offline, clean console, under 8 minutes ------------------------
  expect(externalRequests, 'no network request may leave the local dev server').toEqual([])
  expect(consoleErrors, 'no console or page errors during the journey').toEqual([])
  expect(Date.now() - startedAt).toBeLessThan(8 * 60 * 1000)
})
