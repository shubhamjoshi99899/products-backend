const mongoose = require("mongoose");

//Category Schema

const CategorySchema = new mongoose.Schema({
  category: {
    type: String,
    unique: true,
    nullable: true,
    primaryKey: true,
    required: true,
  },
});

CategorySchema.path("category").validate(async function (value) {
  const count = await mongoose.models.Category.countDocuments({
    category: value,
  });
  return !count;
}, "Category already exists");

exports.Category = mongoose.model("Category", CategorySchema);
