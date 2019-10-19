const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');

const mongoose = require('mongoose');

const app = new Koa();

app.use(bodyParser());

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

router.post('/add/', async (ctx) => {
  let Model = await require('./models/Category');

  for (let i = 0; i < 4; i++) {
    await Model.create({
      title: `GENERATED${i}`,
      subcategories: [
        {title: `SUB_CAT${i}`},
        {title: `SUB_CAT2${i}`},
      ],
    });
  }

  await Model.create({
    title: `GENERATED4`,
  });

  Model = await require('./models/Product');

  await Model.create({
    title: `PROD 1`,
    description: 'dsdsdsdsdsds',
    price: 33333,
    category: new mongoose.Types.ObjectId('5dab5f53ff39122a09630ac0'),
    subcategory: new mongoose.Types.ObjectId('5dab5f53ff39122a09630ac2'),
  });

  await Model.create({
    title: `PROD 2`,
    description: 'dsdsdsdsdsds',
    price: 33333,
    category: new mongoose.Types.ObjectId('5dab5f53ff39122a09630ac6'),
    subcategory: new mongoose.Types.ObjectId('5dab5f53ff39122a09630ac7'),
  });

  await Model.create({
    title: `PROD 4`,
    description: 'dsdsdsdsdsds',
    price: 33333,
    category: new mongoose.Types.ObjectId('5dab5f53ff39122a09630ac3'),
    subcategory: new mongoose.Types.ObjectId('5dab5f53ff39122a09630ac5'),
  });

  await Model.create({
    title: `PROD 5`,
    description: 'dsdsdsdsdsds',
    price: 33333,
    category: new mongoose.Types.ObjectId('5dab5f53ff39122a09630ac0'),
    subcategory: new mongoose.Types.ObjectId('5dab5f53ff39122a09630ac2'),
  });

  ctx.status = 200;
  ctx.body = 'OK';
});

app.use(router.routes());

module.exports = app;
