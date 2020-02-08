const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;

  const products = await Product.find({$text: {$search: query}});

  console.log(query, products);

  ctx.body = {products: products};
};
