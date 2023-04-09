const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Category } = require("../models/Category");

router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(404).json({ message: "Category not found", success: false });
  }
  res.send({ category: categoryList, success: true });
});

router.get("/:id", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send({ success: false, message: "Invalid Category id" });
  }
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        return res.send({
          category: category,
          success: true,
          message: "Category found",
        });
      } else {
        res.status(404).send({ message: "Category not found", success: false });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: err.message, success: false });
    });
});

router.post("/", async (req, res) => {
  let category = new Category({
    category: req.body.category,
  });
  category = await category
    .save()
    .then(() => {
      res
        .status(201)
        .json({ message: "Category saved", success: true, category: category });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message, success: false });
    });
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send({ success: false, message: "Invalid Category id" });
  }
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .send({ message: "Category deleted", success: true });
      } else {
        return res
          .status(404)
          .send({ message: "Category not found", success: false });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: err.message, success: false });
    });
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send({ success: false, message: "Invalid Category id" });
  }
  Category.findByIdAndUpdate(
    req.params.id,
    {
      category: req.body.category,
    },
    { new: true }
  )
    .then((updatedCategory) => {
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      } else {
        res.send({
          message: "Category updated",
          success: true,
          category: updatedCategory,
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ message: error.message, success: false });
    });
});

//get category count

router.get(`/total/totalCount`, async (req, res) => {
  const categoryCount = await Category.countDocuments();

  console.log(categoryCount);
  if (!categoryCount) {
    res.status(404).json({ success: false });
  }
  res.send({
    categoryCount: categoryCount,
    success: true,
    message: "Category Count fetched Successfully",
  });
});

module.exports = router;
