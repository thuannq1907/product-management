const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

// [GET] /products/
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
    // 2 tiêu chí: còn hoạt động và chưa bị xóa
  }).sort({
    position: "desc"
  });
  // nếu find({}) => lấy hết còn nếu muốn lấy theo tiêu chí gì thì thêm nó vào trong find({})

  for (const item of products) {
    // add thêm key mới là priceNew
    item.priceNew = item.price * (1 - item.discountPercentage/100);
    item.priceNew = item.priceNew.toFixed(0);
    // lấy 0 số sau dấu phẩy
  }

  console.log(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: products
  });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    });
  
    console.log(product);
    
    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect("/");
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory;

    // dựa vào slug -> lấy được danh mục, từ danh mục -> lấy được các product thông qua product_category_id
    const category = await ProductCategory.findOne({
      slug: slugCategory,
      status: "active",
      deleted: false
    });
  
    const products = await Product.find({
      product_category_id: category.id,
      status: "active",
      deleted: false
    }).sort({ position: "desc" });
  
    for (const item of products) {
      item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    }
  
    res.render("client/pages/products/index.pug", {
      pageTitle: "Danh sách sản phẩm",
      products: products
    });
    
  } catch (error) {
    res.redirect("/");
  }
}
