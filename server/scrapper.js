import puppeteer from "puppeteer-core";
import cheerio from "cheerio";
import moment from "moment";

const browserOptions = {
  args: [
    "--proxy-server=socks5://localhost:9050"
  ],
  headless: false,
  setViewport: { width: 1240, height: 680 },
};

const browser = await puppeteer.launch(browserOptions);

const getSearchUrl = (params) => {
  const { serviceName = "", search = "" } = params;
  return `https://www.${serviceName}.com${search ? `/${search}/` : ""}`;
};

const search = async (browserPage, params) => {
  await browserPage.bringToFront();
  await browserPage.goto(getSearchUrl(params), {
    waitUntil: ["domcontentloaded"],
  });
};

const sliceDate = (date) => {
  const num = date.match(/\d+/);
  const token = date.match(/[a-z]/);
  return { num, token };
};

const subtractDate = (dateNum, dateToken) => {
  return moment().subtract(dateNum, dateToken);
};

const isActualDate = (date, period) => {
  const { num: periodNum = "", token: periodToken = "" } = sliceDate(period);
  const { num: dateNum, token: dateToken } = sliceDate(date);
  const dateOfPub = subtractDate(dateNum, dateToken);
  return (
    dateToken === periodToken &&
    moment().diff(dateOfPub, periodToken) < periodNum
  );
};

const autoScroll = async (browserPage, params) => {
  const { selectors = "", period = "" } = params;

  await browserPage.waitForSelector(selectors.desc);

  let isNotActual = true;
  while (isNotActual) {
    await browserPage.mouse.wheel({ deltaY: 800 });
    const dates = await browserPage.$$eval(selectors.date, (items) =>
      items.map((item) => item.textContent)
    );
    isNotActual = isActualDate(dates[dates.length - 1], period);
  }
};

const receiveTwits = async (browserPage, params) => {
  const { serviceName = "", selectors = "", period = "", search = "" } = params;

  await autoScroll(browserPage, { selectors, period });

  const content = await browserPage.content();
  const $ = cheerio.load(content);
  const twits = $(selectors.twit).map(function () {
    let date = $(this).find(selectors.date).text();
    const desc = $(this)
      .find(selectors.desc)
      .text()
      .replace(/see more/gi, "");
    if (isActualDate(date, period)) {
      const { num: dateNum = "", token: dateToken = "" } = sliceDate(date);
      date = subtractDate(dateNum, dateToken);
      let img = $(this).find(selectors.img);
      img = img.attr("poster") || img.attr("src");
      const searchUrl = getSearchUrl({ serviceName });
      let url = $(this)
        .find(`${selectors.url}`)
        .attr("href")
        .concat("?")
        .match(/.+(?=\?)/);
      url = !url.toString().includes(searchUrl) ? searchUrl + url : url;
      return {
        id: date.format("x") + `_${search}`,
        desc,
        img,
        url,
        date: date.format("MMMM Do YYYY, h:mm:ss"),
        page: search,
      };
    }
    return;
  });
  return twits.get();
};

export const scrape = async (params) => {
  const { serviceName = "", page = {}, selectors = "", period = "" } = params;
  const browserPage = await browser.newPage();

  try {
    await search(browserPage, { serviceName, search: page.url });
    const data = await receiveTwits(browserPage, {
      serviceName,
      search: page.url,
      selectors,
      period,
    });
    return { data };
  } catch (err) {
    const errText = err + "";
    console.error(errText);
    return { err: errText };
  }
};
