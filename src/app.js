const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const connect_database = require("./config/database.config");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const viewRoutes = require("./routes/view.routes");

dotenv.config({ path: "../.env" });

connect_database();
const port = process.env.PORT || 3000;

let app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "public")));

// app.get('/alo', (req, res) => {
//   res.render('home-page')
// })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

var upload = multer({ storage: storage });


app.use("/view", viewRoutes);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRoutes);
// app.use('/api/comments', commentRoutes);

app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log(req.body);
  res.status(200).json("File uploaded successfully");
});

app.all("*", (req, res, next) => {
  res
    .status(404)
    .json({ message: `Cannot find ${req.originalUrl} on this server` });
});

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
