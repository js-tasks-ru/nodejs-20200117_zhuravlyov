const Product = require('../models/Product');
const mongoose = require('mongoose');

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

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.query.subcategory;

  if (!subcategoryId) {
    let products = await Product.find();
    products = products.map(productMapper);

    ctx.body = {
      products: products,
    };
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
    ctx.throw(400, 'Invalid category id');
  }

  ctx.subcategoryId = subcategoryId;
  await next();
};

module.exports.productList = async function productList(ctx, next) {
  const subcategoryId = ctx.query.subcategory;

  let products = await Product.find({subcategory: subcategoryId});
  products = products.map(productMapper);

  ctx.body = {
    products: products,
  };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    ctx.throw(400, 'Invalid product id');
    return;
  }

  let product = await Product.findById(productId);

  if (!product) {
    ctx.throw(404, 'No such product');
    return;
  }

  product = [product].map(productMapper)[0];

  ctx.body = {
    product: product,
  };
};
