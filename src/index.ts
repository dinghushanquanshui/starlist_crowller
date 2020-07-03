import express from 'express';
import router from './router';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher jason'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});
