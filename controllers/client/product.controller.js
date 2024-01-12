const Product = require("../../models/product.model");

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


