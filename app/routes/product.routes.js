const multer = require('multer');
const path = require('path');

const { authJwt } = require("../middlewares");
const { verifyProduct } = require("../middlewares");
const controller = require("../controllers/product.controller");

module.exports = function (app) {

 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

  //add product
  app.post("/api/product",
  upload.single('file'),
    [
      authJwt.verifyToken,
      verifyProduct.checkProducts
    ],
    controller.store
  );

  //update product
  app.put("/api/product",
  upload.single('file'),
    [
      authJwt.verifyToken,
      verifyProduct.checkProducts
    ],
    controller.update
  );

  //get product
  app.get("/api/product/:id",
    [
      authJwt.verifyToken
    ],
    controller.get
  );

  //list products
  app.get("/api/product/:id",
    [
      authJwt.verifyToken,
    ],
    controller.list
  );

  app.delete("/api/product/:id",
    [
      authJwt.verifyToken
    ],
    controller.delete
  );
  

};