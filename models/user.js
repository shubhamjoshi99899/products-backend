const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    length: 10,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.path("email").validate(async function (value) {
  const count = await mongoose.models.User.countDocuments({ email: value });
  return !count;
}, "Email already exists");

userSchema.path("phone").validate(async function (value) {
  const count = await mongoose.models.User.countDocuments({ phone: value });
  return !count;
}, "Phone number already exists");

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
