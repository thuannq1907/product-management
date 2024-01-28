const Product = require("../../models/product.model.js")
const ProductCategory = require("../../models/product-category.model.js");
const Account = require("../../models/account.model.js");
const filterStateHelper = require("../../helpers/filter-state.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const createTreeHelper = require("../../helpers/create-tree.helper");

const systemConfig = require("../../config/system.js");

// [GET] /admin/product/
module.exports.index = async (req, res) => {
  try {
    
    // Status Filter
    const filterState = filterStateHelper(req.query);
    // End Status Filter

    const find = {
      deleted: false
    }

    
    if(req.query.status) {
      find.status = req.query.status;
    }


    // Search
    if(req.query.keyword) {
      const regex = new RegExp(req.query.keyword, "i")
      // "i" : so khớp k quan tâm đến chữ hoa chữ thường
      find.title = regex;
    }
    // End Search



    // Pagination
    const countProducts = await Product.countDocuments(find);
    // Đếm các bản ghi có đk là find => đếm đc 19 bản ghi

    const objectPagination = paginationHelper(4, req.query, countProducts);
    // End Pagination


    // Sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort["position"] = "desc";
    }
    // End Sort

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    for (const product of products) {
      const account = await Account.findOne({
        _id: product.createdBy.accountId
      });

      if(account){
        product.createdBy.fullName = account.fullName;
        // createdBy là 1 object, add thêm key fullName để bt ng tạo
      } 
    }

    res.render("admin/pages/products/index.pug", {
      pageTitle: "Trang danh sách sản phẩm",
      products: products,
      filterState: filterState,
      keyword: req.query.keyword,
      pagination: objectPagination
    });
  } catch (error) {
    // Khi gặp lỗi thì sẽ chuyển hướng user sang trang ban đầu
    res.redirect(`/${systemConfig.prefixAdmin}/products`)
  }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  const objectUpdatedBy = {
    accountId: res.locals.user.id,
    updatedAt: new Date()
  };

  // Thay đổi thuộc tính trong database
  await Product.updateOne({
    _id: id
  } , {
    status: status,
    $push: { updatedBy: objectUpdatedBy }
  });

  req.flash('success', 'Cập nhật trạng thái thành công');
  // req.flash(key , nội dung thông báo in ra)

  res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {

  // Trong body chứa những data có trong form, lấy mọi key mà fe gửi lên = req.body.key
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
    case "inactive":
      await Product.updateMany({
      // $in: ids => Tìm ra các _id có bên trong mảng ids
      // không được truyền trực tiếp như _id: ids
        _id: { $in: ids }
      } , {
        status: type
      });

      req.flash('success', 'Cập nhật trạng thái thành công');
      break;

    case "delete-all":
      await Product.updateMany({
          _id: { $in: ids }
        } , {
          deleted: true,
          deletedBy: {
            accountId: res.locals.user.id,
            deletedAt: new Date()
          }
        });

        req.flash('success', 'Xóa sản phẩm thành công');
      break;

    case "change-position":
      for (const item of ids) {
        // split("-") tách id và position ra thành 1 mảng
        // Sử dụng Destructuring để lấy id và position trong mảng
        let [id, position] = item.split("-");
        // let để có thể chuyển position từ string về number
        position = parseInt(position);

        await Product.updateOne({
          _id: id
        } , {
          position: position
        })
      }

      req.flash('success', 'Thay đổi vị trí thành công');
      break;

    default:
      break;
  }


  res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    // Xóa cứng
    // await Product.deleteOne({
    //   _id: id
    // })
  
    // Xóa mềm
    await Product.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: {
        accountId: res.locals.user.id,
        deletedAt: new Date()
      }
    });

    req.flash('success', 'Xóa sản phẩm thành công');
  } catch (error) {
    console.log(error);
  }

  res.redirect("back");
}

// [GET] /admin/products/create
// => render giao diện
module.exports.create = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false,
  });

  const newRecords = createTreeHelper(records);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    records: newRecords
  });
};

// [POST] /admin/products/create
// => thêm mới sp vào database
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Thêm accountId để bt Id của ng tạo khi tạo mới sản phẩm
  req.body.createdBy = {
    accountId: res.locals.user.id,
    createdAt: new Date()
  };

  const product = new Product(req.body);
  product.save();

  req.flash("success", "Thêm mới sản phẩm thành công!");

  res.redirect(`/${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false
    });

    const records = await ProductCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper(records);
  
    console.log(product);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      records: newRecords
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
  
    if(req.file && req.file.filename){
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const objectupdatedBy = {
      accountId: res.locals.user.id,
      updatedAt: new Date()
    };
  
    await Product.updateOne({
      _id: id,
      deleted: false
    }, {
      ...req.body,
      // spread syntax copy các phần tử ở req.body sang 
      // Nó giống hệt như req.body nhưng có thể thêm vào các key khác
      $push: { updatedBy: objectupdatedBy }
      // Để tránh khi cập nhật bị ghi đè, push thêm vào mảng tên là updatedBy 1 object là objectupdatedBy (ĐÂY LÀ PUSH VÀO REQ.BODY, có thể viết là req.body.updatedBy.push)
    });
  
    req.flash("success", "Cập nhật sản phẩm thành công!");
  
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false
    });
  
    console.log(product);
    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
}