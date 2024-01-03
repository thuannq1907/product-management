const Product = require("../../models/product.model.js")
const filterStateHelper = require("../../helpers/filter-state.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
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


    const products = await Product.find(find)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);
    // limit: giới hạn bn item 1 trang
    // skip: bỏ qua bn sp, vd: muốn đến trang 2 phải bỏ qua 4 sp, trang 1 bỏ qua 0 sp, Đây chính là vị trí muốn lấy


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

// [GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  console.log(status);
  console.log(id);

  // Thay đổi thuộc tính trong database
  await Product.updateOne({
    _id: id
  } , {
    status: status
  });

  res.redirect("back");
}