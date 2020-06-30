import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowller';

interface BrawlerRateInfo {
  brawler: string | undefined;
  winRate: string;
  brawlerURL: string;
  brawlerDetail: string;
}

interface ActiveInfoResult {
  mode: string;
  data: BrawlerRateInfo[];
}

interface Content {
  [propName: number]: ActiveInfoResult[];
}

export default class StarlistAnalyzer implements Analyzer {
  private static instance: StarlistAnalyzer;

  static getInstance() {
    if (!StarlistAnalyzer.instance) {
      StarlistAnalyzer.instance = new StarlistAnalyzer();
    }
    return StarlistAnalyzer.instance;
  }

  private getStarlistInfo(html: string) {
    const starURL = 'https://www.starlist.pro';
    const $ = cheerio.load(html);
    const activeItems = $('#active').find('.event-border');
    const activeResult: ActiveInfoResult[] = [];
    activeItems.map((index, element) => {
      const gamemode = $(element).find('.event-title-gamemode').eq(0).text();
      const title = $(element).find('.event-title-map').text();
      const brawlers = $(element).find('.event-brl');
      const brawlerRates: BrawlerRateInfo[] = [];
      brawlers.map((i, e) => {
        const brawler: string | undefined = $(e).attr('title');
        const winRate = $(e).find('.event-brl-name-bg').text();
        let imageURL = $(e)
          .css('background-image')
          .slice(4)
          .slice(0, -1)
          .replace(/\'/g, '');
        const brawlerURL = starURL + imageURL;
        const brawlerDetail = starURL + $(e).attr('href');
        brawlerRates.push({
          brawler,
          winRate,
          brawlerURL,
          brawlerDetail,
        });
      });
      activeResult.push({
        mode: gamemode + ':' + title,
        data: brawlerRates,
      });
    });
    return activeResult;
  }

  private generateJsonContent(
    activeData: ActiveInfoResult[],
    filePath: string
  ) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[new Date().getTime()] = activeData;
    return fileContent;
  }

  private constructor() {}

  public analyze(html: string, filePath: string) {
    const activeData = this.getStarlistInfo(html); // 整理数据
    const fileContent = this.generateJsonContent(activeData, filePath);
    return JSON.stringify(fileContent);
  }
}
