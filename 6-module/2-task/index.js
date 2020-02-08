const app = require('./app');

// const Category = require('./models/Category');
// const Product = require('./models/Product');
//
// async function some() {
//   category = await Category.create({
//     title: 'Category1',
//     subcategories: [{
//       title: 'Subcategory1',
//     }],
//   });
//
//   product = await Product.create({
//     title: 'Product1',
//     description: 'Description1',
//     price: 10,
//     category: category.id,
//     subcategory: category.subcategories[0].id,
//     images: ['image1'],
//   });
// }
//
// some();

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});
