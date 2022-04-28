import http from 'http';
import puppeteer from 'puppeteer-core';
import { WebSocketServer } from 'ws';
import { scrape } from './utils/scraper.js';
import { defaultOptions } from './initial.js';

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
  return await puppeteer.connect({ browserWSEndpoint });
};

(async () => {
  const server = await createServer('127.0.0.1', 8080);
  const wss = new WebSocketServer({ server });
  const browser = await run({ ...defaultOptions });

  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;

    ws.on('message', async (req) => {
      const action = JSON.parse(req);

      if (action.type === 'FETCH_DATA') {
        let result = await scrape(browser, action.payload);
        result = JSON.stringify(result);
        console.log(`клієнт ${ip} отримав: ${result}`);
        ws.send(result);
      }
    });

    ws.on('close', () => {
      console.log(`клієнт ${ip} відключено`);
    });
  });
})();
