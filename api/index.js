require("dotenv").config(); // Load environment variables

// To confirm their availability in the .env file. Don't do this in Production!!! 😂
console.log(process.env.MONGODB_URI);
console.log(process.env.PORT);
console.log(process.env.JWT_SECRET);


/**
 * Import Required Modules
 * 
 * This section imports all the necessary modules and dependencies
 * that will be used throughout the application, including Express
 * for server handling, CORS for enabling cross-origin requests,
 * Mongoose for MongoDB interactions, BcryptJS for password hashing,
 * JWT for JSON Web Tokens, cookie-parser for cookie management,
 * Multer for handling file uploads, and built-in modules like fs
 * and path for file system and path operations.
 */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Import models
const User = require("./models/User");
const Post = require("./models/Post");

/**
 * Initialize Application and Configuration Constants
 * 
 * This section initializes the Express application and sets up
 * essential configuration constants:
 * - `app` for the Express application instance
 * - `salt` for bcrypt password hashing salt value
 * - `secret` for the JWT secret key, retrieved from environment variables
 * - `PORT` for the server port, retrieved from environment variables or defaulting to 5000
 */
const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({ origin: "http://localhost:9000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadMiddleware = multer({ dest: path.join(__dirname, "uploads") });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB 😋"))
  .catch((err) => console.error("Could not 🙄 connect to MongoDB", err));

// Routes

// Register user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json("User not found");
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // logged in
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("Internal server error");
  }
});

// Get user profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Token must be provided" });
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    res.json(info);
  });
});

// Logout user
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// Create post
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path: tempPath } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = tempPath + "." + ext;

  fs.renameSync(tempPath, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    const { title, summary, content } = req.body;

    // Ensure the path is relative
    const relativePath = path.relative(__dirname, newPath);

    // Create the post with the relative path
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: relativePath.replace(/\\/g, "/"), // Normalize the path for consistency
      author: info.id,
    });
    res.json(postDoc);
  });
});

// Update post
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path: tempPath } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = tempPath + "." + ext;

    fs.renameSync(tempPath, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not the author");
    }

    // Update the post document fields
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (newPath) {
      postDoc.cover = newPath;
    }

    // Save the updated document
    await postDoc.save();
    res.json(postDoc);
  });
});

// Get all posts
app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

// Get a single post by ID
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

// Start the server
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on PORT: ${PORT}`);
});
