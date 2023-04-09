const mongoose = require("mongoose");

//Product Schema

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String, default: [""] }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  richDescription: { type: String, default: "" },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  dateCreated: { type: Date, default: Date.now },
});

exports.Product = mongoose.model("Product", productSchema);
