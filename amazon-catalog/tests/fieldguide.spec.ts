import {test, expect} from '@playwright/test';
import {chapters, nodes, edges, steps, sources} from '../src/content';

test('content relationships resolve and all chapters are substantive', () => {
  expect(new Set(chapters.map(c => c.id)).size).toBe(chapters.length);
  for (const edge of edges) {
    expect(nodes.some(n => n.id === edge.from)).toBeTruthy();
    expect(nodes.some(n => n.id === edge.to)).toBeTruthy();
  }
  for (const step of steps) {
    expect(nodes.some(n => n.id === step.node)).toBeTruthy();
    if (step.edge) expect(edges.some(e => e.id === step.edge && e.to === step.node)).toBeTruthy();
  }
  for (const chapter of chapters) {
    expect(chapter.concepts.length).toBeGreaterThanOrEqual(3);
    for (const id of chapter.sources) expect(sources.some(s => s.id === id)).toBeTruthy();
    for (const id of chapter.focus) expect(nodes.some(n => n.id === id)).toBeTruthy();
  }
});

test('search, bookmarks and progress persist, and filters reset', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name:'Save chapter', exact:true}).click();
  await page.getByRole('button', {name:'Mark as explored'}).click();
  await page.reload();
  await expect(page.getByRole('button', {name:'Chapter saved', exact:true})).toBeVisible();
  await expect(page.getByRole('button', {name:'Chapter explored', exact:true})).toBeVisible();
  await page.getByRole('button', {name:'Saved 1', exact:true}).click();
  await expect(page.getByRole('heading', {name:'Saved chapters'})).toBeVisible();
  await page.getByRole('textbox', {name:'Search the fieldguide'}).fill('recovery capacity');
  await expect(page.getByRole('heading', {name:'Search results · 1'})).toBeVisible();
  await page.getByRole('region', {name:'Search results'}).getByRole('button', {name:/Failure & recovery/}).click();
  await expect(page).toHaveURL(/#resilience$/);
  await expect(page.getByRole('heading', {level:1})).toHaveText('Failure & recovery');
  await page.reload();
  await expect(page.getByRole('heading', {level:1})).toHaveText('Failure & recovery');
  await expect(page.getByRole('button', {name:/Back to the big picture/})).toBeVisible();
});

test('corrupt storage is ignored and journey controls synchronize', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('catalog-fieldguide:v1', '{broken'));
  await page.goto('/');
  await expect(page.getByRole('heading', {level:1})).toContainText('Behind every product');
  await page.getByRole('button', {name:'Play journey', exact:true}).click();
  await page.getByRole('button', {name:'Pause', exact:true}).click();
  const current = await page.locator('.journey h4').textContent();
  await page.waitForTimeout(2500);
  await expect(page.locator('.journey h4')).toHaveText(current!);
  await page.getByRole('button', {name:'Next journey step'}).click();
  await expect(page.locator('.journey h4')).toHaveText('Validate before publishing');
  await page.getByRole('button', {name:'Inspect Ingestion', exact:true}).click();
  await expect(page.locator('.node-inspector')).toContainText('Applies schemas');
  await page.getByRole('button', {name:'Restart journey'}).click();
  await expect(page.locator('.journey h4')).toHaveText('A seller makes a contribution');
});

test('failure lab computes backlog and chapter workbench changes outcomes', async ({page}) => {
  await page.goto('/#storage');
  await page.getByRole('button', {name:'Crash after publish', exact:true}).click();
  await expect(page.locator('.activity-outcome')).toContainText('Two deliveries, one effective update');
  await page.getByRole('button', {name:'Index outage', exact:true}).click();
  await expect(page.locator('.lab-stats')).toContainText('7,200');
  await expect(page.locator('.lab-stats')).toContainText('40');
  await page.getByRole('slider', {name:'Recovery capacity'}).fill('100');
  await page.getByRole('button', {name:'Recovering', exact:true}).click();
  await expect(page.locator('.lab-stats')).toContainText('Unbounded');
  await expect(page.locator('.lab-explanation')).toContainText('cannot catch up');
});

test('mobile drawer traps focus and page never overflows', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole('button', {name:'Open navigation'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', {name:'Close navigation'})).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', {name:/08 Failure & recovery/})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', {name:'Open navigation'})).toBeFocused();
  await page.screenshot({path:'test-results/mobile.png',fullPage:true});
});

test('all chapter visuals render without page errors, desktop screenshot', async ({page}) => {
  const errors:string[]=[];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({width:1440,height:1000});
  for (const chapter of chapters) {
    await page.goto('/#'+chapter.id);
    await expect(page.getByRole('heading', {level:1})).toBeVisible();
    await expect(page.locator('.graph-node')).toHaveCount(nodes.length);
    if (!['big-picture','resilience'].includes(chapter.id)) await expect(page.locator('.activity-outcome')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.goto('/');
  await page.screenshot({path:'test-results/desktop.png',fullPage:true});
  expect(errors).toEqual([]);
});
