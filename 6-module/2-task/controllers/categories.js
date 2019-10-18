module.exports.categoryList = async function categoryList(ctx, next) {
  let Category;

  const formatResponse = (data) => {
    const farmadData = {
      ...data,
      id: data._id,
    };

    if (farmadData._id) {
      delete farmadData._id;
    }

    if (farmadData.__v || farmadData.__v === 0) {
      delete farmadData.__v;
    }

    return farmadData;
  };

  try {
    Category = await require('./../models/Category');
    const resp = await Category.find();

    const categoryList = resp.map((model) => {
      newModel = formatResponse(model._doc);

      newModel.subcategories = newModel.subcategories.map((subcat) => {
        return formatResponse(subcat);
      });

      return newModel;
    });

    ctx.body = {categories: categoryList};
  } catch (err) {
    await Category.db.close();
    throw err;
  }
};
