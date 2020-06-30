"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var cheerio_1 = __importDefault(require("cheerio"));
var StarlistAnalyzer = /** @class */ (function () {
    function StarlistAnalyzer() {
    }
    StarlistAnalyzer.getInstance = function () {
        if (!StarlistAnalyzer.instance) {
            StarlistAnalyzer.instance = new StarlistAnalyzer();
        }
        return StarlistAnalyzer.instance;
    };
    StarlistAnalyzer.prototype.getStarlistInfo = function (html) {
        var starURL = 'https://www.starlist.pro';
        var $ = cheerio_1.default.load(html);
        var activeItems = $('#active').find('.event-border');
        var activeResult = [];
        activeItems.map(function (index, element) {
            var gamemode = $(element).find('.event-title-gamemode').eq(0).text();
            var title = $(element).find('.event-title-map').text();
            var brawlers = $(element).find('.event-brl');
            var brawlerRates = [];
            brawlers.map(function (i, e) {
                var brawler = $(e).attr('title');
                var winRate = $(e).find('.event-brl-name-bg').text();
                var imageURL = $(e)
                    .css('background-image')
                    .slice(4)
                    .slice(0, -1)
                    .replace(/\'/g, '');
                var brawlerURL = starURL + imageURL;
                var brawlerDetail = starURL + $(e).attr('href');
                brawlerRates.push({
                    brawler: brawler,
                    winRate: winRate,
                    brawlerURL: brawlerURL,
                    brawlerDetail: brawlerDetail,
                });
            });
            activeResult.push({
                mode: gamemode + ':' + title,
                data: brawlerRates,
            });
        });
        return activeResult;
    };
    StarlistAnalyzer.prototype.generateJsonContent = function (activeData, filePath) {
        var fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[new Date().getTime()] = activeData;
        return fileContent;
    };
    StarlistAnalyzer.prototype.analyze = function (html, filePath) {
        var activeData = this.getStarlistInfo(html); // 整理数据
        var fileContent = this.generateJsonContent(activeData, filePath);
        return JSON.stringify(fileContent);
    };
    return StarlistAnalyzer;
}());
exports.default = StarlistAnalyzer;
