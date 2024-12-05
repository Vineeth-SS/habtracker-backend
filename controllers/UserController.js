const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/UserMode.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only jpeg, jpg, and png files
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  console.log(file);
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png image files are allowed!"), false);
  }
};

exports.upload = multer({ storage, fileFilter });

exports.updateProfilePic = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming user ID is available via authentication middleware
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Save the file path to the user's profile
    const profilePicPath = `uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicPath },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully.",
      data: {
        user: {
          id: user._id,
          profilePic: user.profilePic,
        },
      },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const tokenGen = (id) => {
  return jwt.sign({ id }, "thisismusecret", { expiresIn: "1h" });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = tokenGen(user._id);

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.SignUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.profilePic) {
      return res
        .status(404)
        .json({ message: "User does not have a profile picture." });
    }

    res.status(200).json({
      status: "success",
      message: "Profile picture retrieved successfully.",
      data: {
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error retrieving profile picture:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
