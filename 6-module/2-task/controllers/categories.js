const Category = require('../models/Category');

function categoryMapper(category) {
  return {
    id: category.id,
    title: category.title,
    subcategories: category.subcategories.map(subcategoryMapper),
  };
}

function subcategoryMapper(subcategory) {
  return {
    id: subcategory.id,
    title: subcategory.title,
  };
}

module.exports.categoryList = async function categoryList(ctx, next) {
  let categoryList = await Category.find();
  categoryList = categoryList.map(categoryMapper);

  ctx.body = {categories: categoryList};
};
