import puppeteer from 'puppeteer-core';
import cheerio from 'cheerio';
import moment from 'moment';

const defaultOptions = {
  product: 'chrome',
  channel: 'chrome',
  args: ['--lang=en-US,en'],
  headless: false,
  setViewport: { width: 1240, height: 680 }
};

const getSearchUrl = (params) => {
  const { serviceName, search } = params;
  return `https://${serviceName}.com/${search}/`;
};

const search = async (page, params) => {
  await page.bringToFront();
  await page.goto(getSearchUrl(params), { waitUntil: ['domcontentloaded'] });
};

const sliceDate = (dateText) => {
  const num = dateText.match(/\d+/);
  const token = dateText.match(/[a-z]/);
  return { num, token };
};

const isActualDate = (date, period) => {
  const { num: dateNum, token: dateToken } = sliceDate(date);
  const { num: periodNum, token: periodToken } = sliceDate(period);
  const dateOfPub = moment().subtract(dateNum, dateToken);
  return moment().diff(dateOfPub, `${periodToken}`) < periodNum;
};

const autoScroll = async (page, params) => {
  const { selectors, period } = params;
  let isNotActual = true;

  await page.waitForSelector(`${selectors.desc}`);

  while (isNotActual) {
    await page.mouse.wheel({ deltaY: 800 });

    const date = await page.$$eval(`${selectors.date}`, (items) =>
      items.map((item) => item.textContent)
    );
    isNotActual = isActualDate(date[date.length - 1], period);
  }
};

const receiveTwits = async (page, params) => {
  const { selectors, period } = params;

  await autoScroll(page, { selectors, period });

  const content = await page.content();
  const $ = cheerio.load(content);

  const twits = $(`${selectors.twit}`).map(function () {
    let date = $(this).find(`${selectors.date}`).text();
    const desc = $(this)
      .find(`${selectors.desc}`)
      .text()
      .replace(/see more/gi, '');

    if (isActualDate(date, period) && desc.length > 0) {
      const { num: dateNum, token: dateToken } = sliceDate(date);
      date = moment().locale('uk').subtract(dateNum, dateToken).format('MMMM Do YYYY, h:mm:ss');
      let img = $(this).find(`${selectors.img}`);
      img = img.attr('poster') || img.attr('src');
      const url = $(this).find(`${selectors.url}`).attr('href');

      return {
        id: new Date().getTime().toString(),
        desc,
        img,
        url,
        date
      };
    }
    return;
  });
  return twits.get();
};

export const scrape = async (browser, params) => {
  const { serviceName, page, selectors, period } = params;

  try {
    const newPage = await browser.newPage();
    await search(newPage, { serviceName, search: page.url });
    const result = await receiveTwits(newPage, { selectors, period });
    await newPage.close();
    if (!result) throw new Error('помилка отримання даних');

    return { result };
  } catch (err) {
    const errText = err.toString();
    console.error(errText);
    return { err: errText };
  }
};

export const run = async (options) => {
  return await puppeteer.launch({ ...defaultOptions, ...options });
};