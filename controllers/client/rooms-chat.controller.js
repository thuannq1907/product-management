module.exports.index = async (req, res) => {
  res.render("client/pages/rooms-chat/index.pug", {
    pageTitle: "Danh sách phòng",
  });
};