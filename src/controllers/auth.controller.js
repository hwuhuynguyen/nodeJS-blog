const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  console.log("jwt token created successfully");

  // res.status(statusCode).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user,
  //   },
  // });
  res.redirect("/view/home-page");
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    profilePicture: req.body.profilePicture,
    dateOfBirth: req.body.dateOfBirth,
    role: req.body.role,
  });

  console.log(newUser);

  this.createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!"), 400);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user | (user.password !== password)) {
    return next(new AppError("Incorrect username or password!"), 401);
  }
  this.createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", "log-out", cookieOptions);
  res.redirect("/view/home-page");
});
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action."),
        403
      );
    }
    next();
  };

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    res.redirect("/view/auth/login");
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }
  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if the user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist!",
        401
      )
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  res.locals.user = currentUser;
  req.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1. Getting token and check if it's there
    let token = req.cookies.jwt;

    if (!token) {
      return next();
    }
    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if the user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next();
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    res.locals.user = currentUser;
    req.user = currentUser;
    return next();
  } catch (err) {
    next();
  }
};

exports.checkLoggedIn = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return next();
  } else {
    res.redirect("/view/home-page");
  }
};

exports.showLoginPage = (req, res, next) => {
  res.render("auth/login");
};

exports.showRegisterPage = (req, res, next) => {
  res.render("auth/register");
};
