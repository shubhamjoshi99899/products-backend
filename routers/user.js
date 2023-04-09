const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const saltRounds = 10;

//fetches the list of users
router.get("/", async (req, res) => {
  const users = await User.find().select("-passwordHash");
  if (!users) {
    res.status(404).json({ message: "No users found" });
  }
  res.send(users);
});

//get category count

router.get(`/total/totalCount`, async (req, res) => {
  const useCount = await User.countDocuments();

  if (!useCount) {
    res.status(404).json({ success: false });
  }
  res.send({
    useCount: useCount,
    success: true,
    message: "Users Count fetched Successfully",
  });
});

//adds the user to the list of users
router.post("/register", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, saltRounds),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user
    .save()
    .then((createdUser) => {
      const userObj = createdUser.toJSON();
      delete userObj.passwordHash;
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: userObj,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err.message,
        success: false,
        message: "The user cannot be created",
      });
    });
});

//fetches the user by id
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).send({ success: false, message: "Invalid User id" });
  }
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(404).json({ message: "No user found", success: false });
  }
  res.send({ user: user, success: true, message: "User fetched successfully" });
});

//updates the user by id
router.put("/:id", async (req, res) => {
  const userExist = await User.findById(req.params.id);
  if (!mongoose.isValidObjectId(req.params.id) || !userExist) {
    res.status(404).send({ success: false, message: "Invalid User id" });
  }
  let newPassword = "";
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) {
    return res
      .status(400)
      .send({ message: "the user cannot be updated!", success: false });
  }
  res.send({ user: user, message: "User Updated", success: true });
});

//deletes the user by id
router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).send({ success: false, message: "Invalid User id" });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res
      .status(400)
      .send({ message: "The user cannot be deleted!", success: false });
  }
  res.send({ message: "User Deleted", success: true });
});

//login user

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.JWT_SECRET;
  if (!user) {
    res.status(404).send({ message: "User not found", success: false });
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "30d" }
    );
    res.send({
      user: {
        email: user.email,
        access_token: token,
      },
      message: "User logged in",
      success: true,
    });
  } else {
    res.status(404).send({ message: "Invalid Credentials", success: false });
  }
});

module.exports = router;
