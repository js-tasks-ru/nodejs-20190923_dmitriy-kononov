const {formatResponse} = require('./../libs/utils');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;

  if (!subcategory || subcategory.length === 0) return;

  let bdModel = {};

  try {
    bdModel = await require('./../models/Product');

    ctx.productsList = await bdModel.find({subcategory});

    await next();
  } catch (err) {
    await bdModel.db.close();
    throw err;
  }
};

module.exports.productList = async function productList(ctx, next) {
  const {productsList} = ctx;
  ctx.body = {products: productsList.map((product) => formatResponse(product._doc))};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  try {
    new mongoose.Types.ObjectId(id);
  } catch (err) {
    ctx.status = 400;
    ctx.body = 'Bad id';
    return;
  }

  let bdModel = {};
  let resp = {};

  try {
    bdModel = await require('./../models/Product');
    resp = await bdModel.findById(id);
  } catch (err) {
    await bdModel.db.close();
    throw err;
  }

  if (!resp) {
    ctx.status = 404;
    ctx.body = 'Product not found!';

    return;
  }

  ctx.body = {product: formatResponse(resp._doc)};

  await next();
};
