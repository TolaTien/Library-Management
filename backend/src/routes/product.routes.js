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

const { authUser, asyncHandler } = require("../auth/checkAuth");

const controllerProduct = require("../controllers/product.controller");

router.post(
  "/upload-image",
  upload.single("image"),
  asyncHandler(controllerProduct.uploadImage)
);
router.post(
  "/create",
  upload.single("image"),
  asyncHandler(controllerProduct.createProduct)
);
router.get("/get-all", asyncHandler(controllerProduct.getAllProduct));
router.get("/get-one", asyncHandler(controllerProduct.getOneProduct));
router.get("/search", asyncHandler(controllerProduct.searchProduct));
router.post("/update", asyncHandler(controllerProduct.updateProduct));
router.post("/delete", asyncHandler(controllerProduct.deleteProduct));

module.exports = router;
