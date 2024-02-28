import dotenv from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import puppeteer, { Page } from 'puppeteer';

dotenv.config();

async function scrollRandomly(page: Page) {
  const scrollAmount = Math.floor(Math.random() * 200) + 100; // Valor aleatório entre 100 e 300 pixels
  const direction = Math.random() < 0.5 ? 'up' : 'down'; // Rolar para cima ou para baixo

  if (direction === 'up') {
    await page.evaluate(`window.scrollBy(0, -${scrollAmount})`);
  } else {
    await page.evaluate(`window.scrollBy(0, ${scrollAmount})`);
  }
}

async function moveMouseRandomly(page: Page) {
  const viewport = await page.viewport();
  const randomX = Math.floor(Math.random() * viewport.width);
  const randomY = Math.floor(Math.random() * viewport.height);

  await page.mouse.move(randomX, randomY);
}

async function isLoggedIn(page: Page): Promise<boolean> {
  return page
    .waitForSelector('[data-test-id]')
    .then(() => {
      console.log('Ainda não está logado');
      return false;
    })
    .catch(() => {
      console.log('Já está logado');
      return true;
    });
}

async function login(page: Page) {
  const email = String(process.env.GMAIL_EMAIL) || '';
  const password = String(process.env.GMAIL_PASSWORD) || '';
  await page
    .waitForXPath(
      '/html/body/chat-app/main/side-navigation-v2/mat-sidenav-container/mat-sidenav-content/div/div/welcome-window/div/landing-page-variant-a/div/div/div[2]/button',
    )
    .then((el) => el.click());

  //   await loginButton.click();

  const emailInput = await page.waitForSelector('#identifierId');

  await emailInput.type(email);

  await page.click('#identifierNext button');

  const passInput = await page.waitForSelector('#password');
  await passInput.type(password);

  await page.click('#passwordNext button');
}

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://gemini.google.com/app');

  for (let index = 0; index < Math.random() * 5 + 1; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await scrollRandomly(page);
  }

  for (let index = 0; index < Math.random() * 5 + 1; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await moveMouseRandomly(page);
  }

  const isLogged = await isLoggedIn(page);

  if (!isLogged) {
    await login(page);
  }
}

// main();

async function selectInputChat (page:Page) {
    const input = await page.waitForXPath("/html/body/chat-app/main/side-navigation-v2/mat-sidenav-container/mat-sidenav-content/div/div[2]/chat-window/div[1]/div[2]/div[1]/input-area-v2/div/div/div[1]/div/div/rich-textarea/div[1]/p")
    await  input.type("MANO DIGITEI ALGO")

    const buttonSend = await page.waitForXPath("/html/body/chat-app/main/side-navigation-v2/mat-sidenav-container/mat-sidenav-content/div/div[2]/chat-window/div[1]/div[2]/div[1]/input-area-v2/div/div/div[3]/div/div/button")
    const buttonSend2= await page.waitForXPath("/html/body/chat-app/main/side-navigation-v2/mat-sidenav-container/mat-sidenav-content/div/div[2]/chat-window/div[1]/div[2]/div[1]/input-area-v2/div/div/div[3]/div/div/button")
    
    await buttonSend.click()

}

async function tes123() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/home/maletta/projects/dev-tools/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir: '/home/projects/js/whats-chat-bot/data-dir',
  });
  const page = await browser.newPage();


  for (let index = 0; index < Math.random() * 2 + 1; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await scrollRandomly(page);
  }


  await page.goto('https://gemini.google.com/app');

  for (let index = 0; index < Math.random() * 5 + 1; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await scrollRandomly(page);
  }

  
  for (let index = 0; index < Math.random() * 5 + 1; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await moveMouseRandomly(page);
  }

  await selectInputChat(page)

  console.log(123);
}

tes123();
