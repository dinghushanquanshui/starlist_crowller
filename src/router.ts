import { Router, Request, Response } from 'express';
import Crowller from './crowller';
import StarlistAnalyzer from './starlistAnalyzer';


const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send(`
  <html>
    <body>
      <form method="post" action="./getData">
      <input type="password" name="password" />
      <button> 提交 </button>
    </body>
  </html>
  `);
});

router.post('/getData', (req: Request, res: Response) => {
  if (req.body.password === '123') {
    const url = 'https://www.starlist.pro/';
    const analyzer = StarlistAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.send('success');
  } else {
    res.send('error')
  }
  
});

export default router;
