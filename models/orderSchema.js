const mongoose = require("mongoose");

// Order schema

const OrderSchema = new mongoose.Schema({
  order_id: String,
  customer_id: String,
  items: Array,
});

exports.OrderSchema = mongoose.model("order", OrderSchema);
