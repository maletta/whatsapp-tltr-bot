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
    .waitForSelector('nav[aria-label="Chat history"]', { timeout: 1000 * 4 })
    .then(() => true)
    .catch(() => false);
}

async function executeGoogleLogin(page: Page) {
  const email = process.env.GMAIL_EMAIL;
  const password = process.env.GMAIL_PASSWORD;

  // Espera até que o botão com o texto "Continuar com Google" esteja disponível na página
  await page.waitForXPath('//button[contains(text(), "Continuar com Google")]');

  // Captura o elemento do botão com o texto "Continuar com Google"
  const button = await page.$x(
    '//button[contains(text(), "Continuar com Google")]',
  );

  // Realiza as operações que desejar com o botão, por exemplo, clicar nele
  await button[0].click();

  // Espere o carregamento do input com id="identifierId"
  await page.waitForSelector('#identifierId');

  // Adicione o valor da variável de email a esse input
  await page.type('#identifierId', email);

  // Clique no botão
  await page.click('#identifierNext button');

  // Espere o carregamento do div com id="password"
  await page.waitForSelector('#password');

  // Adicione o valor da variável de senha ao input do tipo password dentro do div com id=password
  await page.type('#password input[type=password]', password);

  // Clique no botão
  await page.click('#passwordNext button');
}

async function login(page: Page) {
  try {
    // Espera até que o botão com o atributo data-testid="login-button" esteja disponível na página
    await page.waitForSelector('[data-testid="login-button"]');

    // Captura o elemento do botão
    const loginButton = await page.$('[data-testid="login-button"]');

    // Realiza as operações que desejar com o botão, por exemplo, clicar nele
    await loginButton.click();

    // await executeGoogleLogin(page);
  } catch (error) {
    console.log('Erro ao fazer login no chat open ai');
    throw error;
  }
}

async function initialize() {
  const browser = await puppeteer.launch({
    headless: false,

    args: [
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    ],
  }); // Você pode definir para true se não quiser uma janela do navegador visível
  const page = await browser.newPage();
  await page.goto('https://chat.openai.com');
  // await page.waitForNavigation({ waitUntil: 'networkidle0' });

  const haveLoginButton = await page
    .$('[data-testid="login-button"]')
    .then(() => true)
    .catch(() => false);

  if (haveLoginButton) {
    console.log('Achou botão login');
  } else {
    console.log('Não achou botão login');
  }

  const loginButton = await page.$('[data-testid="login-button"]');
  await loginButton.click({ delay: 10 });

  const isLoggedInVariable = await isLoggedIn(page);

  if (!isLoggedInVariable) {
    await login(page);
  }

  // await page.waitForSelector('nav[aria-label="Chat history"]', {
  //   timeout: 1000 * 6,
  // });
}

(async () => {
  try {
    await initialize();
    console.log('Logou com sucesso');
  } catch (error) {
    console.log('Não conseguiu logar');
    console.log(error);
  }
})();
