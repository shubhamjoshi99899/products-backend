const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//add a product
router.post(`/`, uploadOptions.single("image"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const product = new Product({
    name: req.body.name,
    image: `${basePath}${fileName}`,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    rating: req.body.rating,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({ error: err, success: false });
    });
});

//get all products
router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.category) {
    filter = { category: req.query.category.split(",") };
  }
  const product = await Product.find(filter).populate("category");
  if (!product) {
    res.status(500).json({ success: false, error: "Product not found" });
  }
  res.send({ Products: product, success: true });
});

//get a product by Id

router.get(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).send({ success: false, message: "Invalid Product id" });
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(500).json({ success: false, error: "Product not found" });
  } else {
    res.send({
      product: product,
      success: true,
      message: "Product fetched Successfully",
    });
  }
});

//get featured products

router.get("/featured/product", async (req, res) => {
  const featuredProduct = await Product.find({ isFeatured: true });
  if (!featuredProduct) {
    res.status(404).json({ message: "Products not found", success: false });
  }
  res.send({
    featuredProduct: featuredProduct,
    count: featuredProduct.length,
    success: true,
  });
});

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid Product!");

  const file = req.file;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagepath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!updatedProduct)
    return res.status(500).send("the product cannot be updated!");

  res.send({
    data: updatedProduct,
    success: true,
    message: "Product updated successfully",
  });
});

//delete a product

router.delete(`/:id`, async (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        res.status(404).json({ message: "Product not found", success: false });
      } else {
        return res
          .status(200)
          .json({ message: "Product Deleted Sucessfully", success: true });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: err.message, success: false });
    });
});

//add images to product by product id
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send({
      data: product,
      success: true,
      message: "Images added successfully",
    });
  }
);

//get product count

router.get(`/total/totalCount`, async (req, res) => {
  const productCount = await Product.countDocuments();

  console.log(productCount);
  if (!productCount) {
    res.status(404).json({ success: false });
  }
  res.send({
    productCount: productCount,
    success: true,
    message: "Product Count fetched Successfully",
  });
});

module.exports = router;
