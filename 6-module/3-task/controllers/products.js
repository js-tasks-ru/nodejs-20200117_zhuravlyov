const Product = require('../models/Product');

function productMapper(product) {
  return {
    id: product.id,
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description,
  };
}

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;

  let products = await Product.find({$text: {$search: query}});
  products = products.map(productMapper);

  ctx.body = {products: products};
};
