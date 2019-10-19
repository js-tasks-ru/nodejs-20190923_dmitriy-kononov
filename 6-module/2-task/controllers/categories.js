const {formatResponse} = require('./../libs/utils');

module.exports.categoryList = async function categoryList(ctx, next) {
  let Category;

  try {
    Category = await require('./../models/Category');
    const resp = await Category.find();

    const categoryList = resp.map((model) => {
      newModel = formatResponse(model._doc);

      newModel.subcategories = newModel.subcategories.map((subcategory) => {
        return formatResponse(subcategory._doc);
      });

      return newModel;
    });

    ctx.body = {categories: categoryList};
  } catch (err) {
    await Category.db.close();
    throw err;
  }
};
