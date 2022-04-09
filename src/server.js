import http from 'http';
import puppeteer from 'puppeteer-core';
import { WebSocketServer } from 'ws';
import { scrape } from './scraper.js';

const defaultOptions = {
  product: 'chrome',
  channel: 'chrome',
  args: ['--lang=en-US,en'],
  headless: true,
  setViewport: { width: 1240, height: 680 }
};

const createServer = async (host, port) => {
  return http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end();
    })
    .listen(port, host);
};

const run = async (options) => {
  const browser = await puppeteer.launch(options);
  const browserWSEndpoint = browser.wsEndpoint();
  browser.disconnect();

  return browserWSEndpoint;
};

(async () => {
  const server = await createServer('127.0.0.1', 8080);
  const wss = new WebSocketServer({ server });
  const browserWSEndpoint = await run({ ...defaultOptions });
  const browser = await puppeteer.connect({ browserWSEndpoint });

  wss.on('connection', (ws, req) => {
    try {
      const ip = req.socket.remoteAddress;

      ws.on('message', async (req) => {
        const action = JSON.parse(req);

        if (action.type === 'FETCH_DATA') {
          let { err, result } = await scrape(browser, action.payload);
          if (err) throw new Error(err);

          result = JSON.stringify({ result });
          console.log(`сервер ${ip} отримав: ${result}`);
          ws.send(result);
        }
      });

      ws.on('error', () => {
        throw new Error('помилка сервера');
      });
    } catch (err) {
      const errText = err.toString();
      console.error(errText);
      ws.send(JSON.stringify({ err: errText }));
    }
  });
})();
