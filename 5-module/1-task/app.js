const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let message;
let members = [];

router.get('/subscribe', async (ctx, next) => {
  await new Promise((resolve) => {
    members.push({
      id: ctx.query.r,
      ctx: ctx,
      resolve: resolve,
    });
  });

  members.forEach((member) => {
    member.ctx.status = 200;
    member.ctx.body = message;
  });

  members = [];

  return next();
});

router.post('/publish', async (ctx, next) => {
  message = ctx.request.body.message;

  if (!message) {
    ctx.status = 200;
    return;
  }

  members.forEach((member) => {
    member.resolve();
  });

  ctx.status = 200;

  return next();
});

app.use(router.routes());

module.exports = app;
