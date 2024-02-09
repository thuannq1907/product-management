const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingsGeneral = await SettingGeneral.findOne({});

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingsGeneral: settingsGeneral
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingsGeneral = await SettingGeneral.findOne({});

  // 1 website chỉ có 1 settings-general thôi => chỉ cần tạo 1 cái và sẽ lấy cái đó trả ra giao diện (duy nhất), để tránh khi truy cập vào route lại tạo cái khác => check if else: có rồi thì update, chưa có thì tạo mới
  if(settingsGeneral) {
    await SettingGeneral.updateOne({
      _id: settingsGeneral.id
    }, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }
  res.redirect("back");
};