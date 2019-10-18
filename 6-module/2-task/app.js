const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

router.post('/add', async (ctx) => {
  const Model = await require('./models/Category');

  for (let i = 0; i < 4; i++) {
    await Model.create({
      title: `GENERATED${i}`,
      subcategories: [
        {title: `SUB_CAT${i}`},
        {title: `SUB_CAT2${i}`},
      ],
    });
  }

  ctx.body = 'OK';
});

app.use(router.routes());

module.exports = app;
