import serverWs from "./ws.js";
import { scrape } from "./scrapper.js";

const routing = {
  api: {
    async ws(params) {
      return await scrape(params);
    }
  }
};

serverWs(routing, 3000);
