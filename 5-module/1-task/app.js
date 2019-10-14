const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const sessions = [];

const subscription = (ctx) => {
  return new Promise((resolve) => {
    sessions.push(resolve);

    ctx.res.on('close', () => {
      sessions.splice(sessions.indexOf(resolve));
    });
  });
};

const distribution = (message) => {
  sessions.forEach((el) => {
    el(message);
  });
};


router.get('/subscribe', async (ctx, next) => {
  console.log('GET');

  const message = await subscription(ctx);

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (!message) {
    ctx.body = '';
    return;
  }

  distribution(message);
  ctx.body = '';
});

app.use(router.routes());

module.exports = app;
