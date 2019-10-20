const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

(async () => {
  const subCategorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
  });

  const categorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    subcategories: [subCategorySchema],
  });

  const productSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  
    subcategory: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  
    images: [String],
  
  });

  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('debug', false);
  mongoose.plugin(beautifyUnique);

  const connection = await mongoose.createConnection('mongodb://localhost/6-module-2-task');

  const catModel = connection.model('Category', categorySchema);
  const prodModel = connection.model('Product', productSchema);

  for (let i = 0; i < 5; i++) {
    await catModel.create({
      title: `GENERATED ${i}`,
      subcategories: [
        {title: `SUB_CAT ${i}`},
        {title: `SUB_CAT2 ${i}`},
      ],
    });
  }

  await catModel.create({
    title: `GENERATED 5`,
  });

  const catsList = await catModel.find();

  for (let i = 0; i < 4; i++ ) {
    const {_id: catId, subcategories} = catsList[i]._doc;
    const {_id: subId} = subcategories[0]._doc;

    await prodModel.create({
      title: `PROD ${i}`,
      description: 'dsdsdsdsdsds',
      price: 33333,
      category: catId,
      subcategory: subId,
    });
  }

  await prodModel.create({
    title: `PROD 5`,
    description: 'dsdsdsdsdsds',
    price: 33333,
    category: catsList[0]._doc._id,
    subcategory: catsList[0]._doc.subcategories[1]._doc._id,
  });

  await prodModel.create({
    title: `PROD 6`,
    description: 'dsdsdsdsdsds',
    price: 33333,
    category: catsList[0]._doc._id,
    subcategory: catsList[0]._doc.subcategories[0]._doc._id,
  });

  await connection.close();

  console.log('OK');
})();
