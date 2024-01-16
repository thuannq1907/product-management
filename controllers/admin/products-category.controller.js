const ProductCategory = require("../../models/product-category.model.js");
const systemConfig = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false
  });

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false
  });

  console.log(records);

  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach(item => {
      if(item.parent_id === parentId) {
        const newItem = item;
        const children = createTree(arr, item.id);
        if(children.length > 0){
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  };

  const newRecords = createTree(records);

  console.log(newRecords);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm mới danh mục sản phẩm",
    records: newRecords
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  // console.log(req.body);
  if(req.body.position == "") {
    const countRecords = await ProductCategory.countDocuments();
    req.body.position = countRecords + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();

  req.flash("success", "Thêm mới danh mục sản phẩm thành công!");

  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
  
};