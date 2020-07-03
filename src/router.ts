import fs from 'fs';
import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import Crowller from './utils/crowller';
import Analyzer from './utils/analyzer';
import { getResponseData } from './utils/util';

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '请先登录'));
  }
};

const router = Router();

router.get('/', (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
  <html>
    <body>
      <a href='./logout'>退出</a>
      <a href='./getData'>爬取</a>
      <a href='./showData'>展示</a>
    </body>
  </html>
  `);
  } else {
    res.send(`
    <html>
      <body>
        <form method="post" action="./login">
        <input type="password" name="password" />
        <button> login </button>
      </body>
    </html>
    `);
  }
});

router.get('/logout', (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.json(getResponseData(true));
});

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const url = 'https://www.starlist.pro/';
  const analyzer = Analyzer.getInstance();
  new Crowller(url, analyzer);
  res.send('success');
});

router.post('/login', (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.json(getResponseData(false, '已经登录'));
  } else {
    if (password === '123' && req.session) {
      req.session.login = true;
      res.json(getResponseData(true));
    } else {
      res.json(getResponseData(false, 'login failed'));
    }
  }
});

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, '../data/course.json');
    const result = fs.readFileSync(position, 'utf8');
    res.json(getResponseData(JSON.parse(result)));
  } catch (e) {
    res.json(getResponseData(false, '尚未爬取到'));
  }
});

export default router;
