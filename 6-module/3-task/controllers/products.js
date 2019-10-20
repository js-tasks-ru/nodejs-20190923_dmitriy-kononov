module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.request.query;

  let productModel = {};

  try {
    productModel = await require('./../models/Product');

    productModel.on('index', function(error) {
      if (error) {
        console.log('index ERROR!!');
        console.dir(error);
      }
    });

    const productList = await productModel.find({
      $text: {
        $search: `\"${query}\"`,
        $language: 'ru',
      },
    });

    ctx.status = 200;
    ctx.body = {products: [...productList]};
  } catch (err) {
    productModel.db.close();

    ctx.status = 500;
    ctx.body = 'BD error';

    throw err;
  };
};
