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
      .sort({
        // Sắp xếp theo tiêu chí vị trí mặc định là tăng dần (asc) hoặc giảm dần (desc)
        position: "desc"
      })
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

// [PATCH] /admin/products/change-status/:status/:id
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
          deletedAt: new Date()
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
      deletedAt: new Date()
    });

    req.flash('success', 'Xóa sản phẩm thành công');
  } catch (error) {
    console.log(error);
  }

  res.redirect("back");
}