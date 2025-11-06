const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

const { authUser, check } = require("../auth/checkAuth");

const controllerProduct = require("../controllers/product.controller");

router.post(
  "/upload-image",
  upload.single("image"),
  check(controllerProduct.uploadImage)
);
router.post(
  "/create",
  upload.single("image"),
  check(controllerProduct.createProduct)
);
router.get("/get-all", check(controllerProduct.getAllProduct));
router.get("/get-one", check(controllerProduct.getOneProduct));
router.get("/search", check(controllerProduct.searchProduct));
router.post("/update", check(controllerProduct.updateProduct));
router.post("/delete", check(controllerProduct.deleteProduct));

module.exports = router;
