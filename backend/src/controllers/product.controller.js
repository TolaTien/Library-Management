const modelProduct = require('../models/product.model');
const { Op } = require('sequelize');

class controllerProduct {
<<<<<<< HEAD
    // [POST] /api/products/upload
    async uploadImage(req, res) {
        try {
            const { file } = req;
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: 'Không có file nào được tải lên',
                });
            }

            const imageUrl = `uploads/products/${file.filename}`;

            return res.status(201).json({
                success: true,
                message: 'Tải ảnh thành công',
                data: imageUrl,
            });
        } catch (error) {
            console.error('❌ Lỗi tại uploadImage:', error);
            res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
        }
    }

    // [POST] /api/products/create
    async createProduct(req, res) {
        try {
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
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập đầy đủ thông tin',
                });
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

            return res.status(201).json({
                success: true,
                message: 'Tạo sản phẩm thành công',
                data: product,
            });
        } catch (error) {
            console.error('❌ Lỗi tại createProduct:', error);
            res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
        }
    }

    // [GET] /api/products
    async getAllProduct(req, res) {
        try {
            const products = await modelProduct.findAll();
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách sản phẩm thành công',
                data: products,
            });
        } catch (error) {
            console.error('❌ Lỗi tại getAllProduct:', error);
            res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
        }
    }

    // [GET] /api/products/one?id=...
    async getOneProduct(req, res) {
        try {
            const { id } = req.query;
            const product = await modelProduct.findOne({ where: { id } });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Lấy sản phẩm thành công',
                data: product,
            });
        } catch (error) {
            console.error('❌ Lỗi tại getOneProduct:', error);
            res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
        }
    }

    // [GET] /api/products/search?keyword=...
    async searchProduct(req, res) {
        try {
            const { keyword } = req.query;

            if (!keyword || keyword.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Từ khóa tìm kiếm không hợp lệ',
                });
            }

            const products = await modelProduct.findAll({
                where: { nameProduct: { [Op.like]: `%${keyword}%` } },
            });

            res.status(200).json({
                success: true,
                message: 'Tìm kiếm sản phẩm thành công',
                data: products,
            });
        } catch (error) {
            console.error('❌ Lỗi tại searchProduct:', error);
            res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
        }
    }

    // [PUT] /api/products/update?id=...
    async updateProduct(req, res) {
        try {
            const { id } = req.query;
            const [updated] = await modelProduct.update(req.body, { where: { id } });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm để cập nhật',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật sản phẩm thành công',
            });
        } catch (error) {
            console.error('❌ Lỗi tại updateProduct:', error);
            res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
        }
    }

    // [DELETE] /api/products/delete
    async deleteProduct(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu ID sản phẩm cần xóa',
                });
            }

            const deleted = await modelProduct.destroy({ where: { id } });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm để xóa',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa sản phẩm thành công',
            });
        } catch (error) {
            console.error('❌ Lỗi tại deleteProduct:', error);
            res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
        }
    }
=======
  // [POST] /api/products/upload
  async uploadImage(req, res) {
    try {
      const { file } = req;
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Không có file nào được tải lên",
        });
      }

      const imageUrl = `uploads/products/${file.filename}`;

      return res.status(201).json({
        success: true,
        message: "Tải ảnh thành công",
        data: imageUrl,
      });
    } catch (error) {
      console.error("❌ Lỗi tại uploadImage:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  }

  // [POST] /api/products/create
  async createProduct(req, res) {
    try {
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
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ thông tin",
        });
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

      return res.status(201).json({
        success: true,
        message: "Tạo sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      console.error("❌ Lỗi tại createProduct:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  }

  // [GET] /api/products
  async getAllProduct(req, res) {
    try {
      const products = await modelProduct.findAll();
      res.status(200).json({
        success: true,
        message: "Lấy danh sách sản phẩm thành công",
        data: products,
      });
    } catch (error) {
      console.error("❌ Lỗi tại getAllProduct:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  }

  // [GET] /api/products/one?id=...
  async getOneProduct(req, res) {
    try {
      const { id } = req.query;
      const product = await modelProduct.findOne({ where: { id } });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.status(200).json({
        success: true,
        message: "Lấy sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      console.error("❌ Lỗi tại getOneProduct:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  }

  // [GET] /api/products/search?keyword=...
  async searchProduct(req, res) {
    try {
      const { keyword } = req.query;

      if (!keyword || keyword.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Từ khóa tìm kiếm không hợp lệ",
        });
      }

      const products = await modelProduct.findAll({
        where: { nameProduct: { [Op.like]: `%${keyword}%` } },
      });

      res.status(200).json({
        success: true,
        message: "Tìm kiếm sản phẩm thành công",
        data: products,
      });
    } catch (error) {
      console.error("❌ Lỗi tại searchProduct:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  }

  // [PUT] /api/products/update?id=...
  async updateProduct(req, res) {
    try {
      const { id } = req.query;
      const [updated] = await modelProduct.update(req.body, { where: { id } });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm để cập nhật",
        });
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công",
      });
    } catch (error) {
      console.error("❌ Lỗi tại updateProduct:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  }

  // [DELETE] /api/products/delete
  async deleteProduct(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Thiếu ID sản phẩm cần xóa",
        });
      }

      const deleted = await modelProduct.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm để xóa",
        });
      }

      res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công",
      });
    } catch (error) {
      console.error("❌ Lỗi tại deleteProduct:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  }
>>>>>>> ff76d0a1c5caeec4537b28e0e0677df21c258a36
}

module.exports = new controllerProduct();
