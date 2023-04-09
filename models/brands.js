const mongoose = require("mongoose");

//Brand Schema

const BrandSchema = new mongoose.Schema({
  brand: {
    type: String,
    unique: true,
    nullable: true,
    primaryKey: true,
    required: true,
  },
});

BrandSchema.path("brand").validate(async function (value) {
  const count = await mongoose.models.Brand.countDocuments({
    brand: value,
  });
  return !count;
}, "Brand already exists");

exports.Brand = mongoose.model("Brand", BrandSchema);
