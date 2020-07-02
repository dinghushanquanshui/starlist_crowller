"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var crowller_1 = __importDefault(require("./crowller"));
var starlistAnalyzer_1 = __importDefault(require("./starlistAnalyzer"));
var router = express_1.Router();
router.get('/', function (req, res) {
    res.send("\n  <html>\n    <body>\n      <form method=\"post\" action=\"./getData\">\n      <input type=\"password\" name=\"password\" />\n      <button> \u63D0\u4EA4 </button>\n    </body>\n  </html>\n  ");
});
router.post('/getData', function (req, res) {
    if (req.body.password === '123') {
        var url = 'https://www.starlist.pro/';
        var analyzer = starlistAnalyzer_1.default.getInstance();
        new crowller_1.default(url, analyzer);
        res.send('success');
    }
    else {
        res.send('error');
    }
});
exports.default = router;
