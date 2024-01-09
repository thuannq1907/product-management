const multer  = require('multer');

module.exports = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const prefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, prefix + '-' + file.originalname)
    }
  })

  return storage;
}