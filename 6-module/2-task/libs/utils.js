module.exports.formatResponse = (data) => {
  const newData = {};

  for (key in data) {
    if (true) {
      switch (key) {
        case '_id':
          newData.id = data[key];
          break;
        case '__v':
          break;
        default:
          newData[key] = data[key];
      };
    }
  }

  return newData;
};
