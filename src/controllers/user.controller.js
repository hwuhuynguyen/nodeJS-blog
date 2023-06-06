const User = require("../models/user.model");

exports.getAllUsers = async function (req, res, next) {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    length: users.length,
    data: users,
  });
};

exports.getUserById = async function (req, res, next) {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: user,
    });
};

exports.createUser = async function (req, res, next) {
    const user = new User(req.body);

    await user.save();

    res.status(201).json({
      status: "success",
      data: user,
    });
};

exports.updateUser = async function (req, res, next) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);

    console.log(req.params.id);
    res.status(200).json({
      status: "success",
      data: user,
    });
}

exports.deleteUser = async function (req, res, next) {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: user,
    });
}