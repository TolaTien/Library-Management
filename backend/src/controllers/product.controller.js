const modelProduct = require("../models/product.model");
const { Op } = require("sequelize");

class controllerProduct {
  async uploadImage(req, res) {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `uploads/products/${file.filename}`;
    new Created({
      message: "Upload image success",
      metadata: imageUrl,
    }).send(res);
  }
  async createProduct(req, res) {
    const {
      nameProduct,
      image,
      description,
      stock,
      covertType,
      publishYear,
      pages,
      language,
      publisher,
      publishingCompany,
    } = req.body;
    if (
      !nameProduct ||
      !image ||
      !description ||
      !stock ||
      !covertType ||
      !publishYear ||
      !pages ||
      !language ||
      !publisher ||
      !publishingCompany
    ) {
      throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
    }
    const product = await modelProduct.create({
      nameProduct,
      image,
      description,
      stock,
      covertType,
      publishYear,
      pages,
      language,
      publisher,
      publishingCompany,
    });
    new Created({
      message: "Create product success",
      metadata: product,
    }).send(res);
  }
  async getAllProduct(req, res) {
    const products = await modelProduct.findAll();
    new OK({
      message: "Get all product success",
      metadata: products,
    }).send(res);
  }

  async getOneProduct(req, res) {
    const { id } = req.query;
    const product = await modelProduct.findOne({ where: { id } });
    new OK({
      message: "Get one product success",
      metadata: product,
    }).send(res);
  }

  async searchProduct(req, res) {
    const { keyword } = req.query;
    const products = await modelProduct.findAll({
      where: { nameProduct: { [Op.like]: `%${keyword}%` } },
    });
    new OK({
      message: "Search product success",
      metadata: products,
    }).send(res);
  }

  async updateProduct(req, res) {
    const { id } = req.query;
    const product = await modelProduct.update(req.body, { where: { id } });
    new OK({
      message: "Update product success",
      metadata: product,
    }).send(res);
  }

  async deleteProduct(req, res) {
    const { id } = req.body;
    const product = await modelProduct.destroy({ where: { id } });
    new OK({
      message: "Delete product success",
      metadata: product,
    }).send(res);
  }
}

module.exports = new controllerProduct();
