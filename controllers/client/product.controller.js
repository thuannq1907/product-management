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

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slugProduct;

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    });
  
    product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);

    // Thêm phần giới thiệu danh mục sản phẩm ở trang chi tiết
    if(product.product_category_id){
      const category = await ProductCategory.findOne({
        _id: product.product_category_id
      });

      product.category = category;
    }
    
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

    const getSubCategory = async (parentId) => {
      const subs = await ProductCategory.find({
        parent_id: parentId,
        status: "active",
        deleted: false
      });

      let allSubs = [...subs];
      // <=> copy mảng subs để khi đệ quy xong thì add vào mảng này

      // subs: Điện thoại => sub con bao gồm iphone và samsung, đệ quy tiếp để tìm con của 2 mục này
      for (const sub of subs) {
        const childs = await getSubCategory(sub.id);
        // => Khi gọi đệ quy, các danh mục con đóng vai trò là các danh mục cha
        allSubs = allSubs.concat(childs);
        // concat để mối mảng
      }

      return allSubs;
    }

    const allCategory = await getSubCategory(category.id);
    // => trả ra 1 mảng các danh mục con

    const allCagegoryId = allCategory.map(item => item.id);
    // => trả ra 1 mảng chỉ gồm id các danh mục con

    // console.log(allCagegoryId);
    // console.log(...allCagegoryId);
  
    const products = await Product.find({
      // tìm nhiều id của danh mục
      product_category_id: {
        $in: [
          category.id,
          ...allCagegoryId
          // dùng spread syntax để copy các phần tử của mảng allCagegoryId
        ]
      },
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
