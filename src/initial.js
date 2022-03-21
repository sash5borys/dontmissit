export const defaultServices = {
  facebook: [],
  twitter: []
};

export const defaultSelectors = {
  facebook: {
    twit: 'div[role="article"]',
    desc: 'div[role="article"] div[data-ad-preview="message"]',
    img: 'div[role="article"] div[id^="jsc_c_"] div>img', //attr('src')
    url: 'div[role="article"] span[id^="jsc_c_"] a', //attr('href')
    date: 'div[role="article"] span[id^="jsc_c_"] a>span'
  },
  twitter: {
    twit: 'article[role="article"]',
    desc: 'article[role="article"] div[id^="id__"][lang]',
    img: 'article[role="article"] div[data-testid="tweetPhoto"] img, article[role="article"] div[data-testid="videoPlayer"] video', //attr('src'), attr('poster')
    url: 'article[role="article"] a[id^="id__"][role="link"]', //attr('href')
    date: 'article[role="article"] a[id^="id__"][role="link"]>time'
  }
};

export const defaultPeriod = '15m';
