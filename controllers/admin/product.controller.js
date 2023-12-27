const Product = require("../../models/product.model.js")
// [GET] /admin/product/
module.exports.index = async (req, res) => {
  // Định nghĩa ra 1 mảng các nút bấm
  const filterState = [
    {
      name: "Tất cả",
      status: "",
      class: ""
    },
    {
      name: "Hoạt động",
      status: "active",
      class: ""
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: ""
    }
  ]


  // status là active hoặc inactive thì mới đc update
  if(req.query.status) {
    // findIndex() là lặp qua từng phần tử và tìm bản ghi thỏa mãn tiêu chí nào đó và trả về vị trí bản ghi đó
    const index = filterState.findIndex(item => item.status == req.query.status);
    filterState[index].class="active";
  } else {
    // nếu status là tất cả thì thêm class active
    filterState[0].class="active";
  }

  const find = {
    deleted: false
  }

  // Nếu có status thì lấy status trên url thông qua req.query.status
  if(req.query.status) {
    find.status = req.query.status;
  }

  const products = await Product.find(find);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: products,
    filterState: filterState
  });
}