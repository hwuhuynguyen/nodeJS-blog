const User = require("../models/user.model");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + fileExtension);
  },
});

var upload = multer({ storage: storage });

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
  upload.single("image")(req, res, async (err) => {
    if (err) {
      // Handle the error if the file upload fails
      console.error(err);
      return next(err);
    }

    let convertedPath = "/" + path.relative("src/public", req.file.path);

    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      profilePicture: convertedPath
    });

    res.status(200).json({
      status: "success",
      data: user,
    });
  });
};

exports.deleteUser = async function (req, res, next) {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: user,
  });
};
