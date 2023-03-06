var express = require("express");
var router = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const isAuthenticated = require('../middleware/isAuthenticated')

router.post("/signup", (req, res, next) => {
    const { firstName, lastName, email, password, username, location, occupation } = req.body;
    if (!firstName || !lastName || !email || !password || !username) {
      return res.status(400).json({ message: "Please fill out all required fields" });
    }

  User.findOne({ email: email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "You've already registered" });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPass = bcrypt.hashSync(password, salt);

        User.create({
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: hashedPass,
          location: location,
          occupation: occupation
        })
          .then((createdUser) => {
            console.log(createdUser)
            res.json({ createdUser: createdUser });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out both fields" });
  }

  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(401).json({ message: "Email or Password is incorrect!!!" });
      }

      const doesMatch = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );

      if (doesMatch) {
        const payload = {
          _id: foundUser._id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          username: foundUser.username,
          password: foundUser.password,
          friends: foundUser.friends,
          location: foundUser.location,
          occupation: foundUser.occupation,
          profile_image: foundUser.profile_image,
          posts: foundUser.posts
        };
        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "24hr",
        });
        res.json({
          token: token,
          _id: foundUser._id,
          message: `Welcome ${foundUser.username}`,
        });
      } else {
        return res.status(402).json({ message: "Email or Password is incorrect" });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.get("/verify", isAuthenticated, (req, res) => {
    User.findOne({ _id: req.user._id })
    .populate("posts")
      .then((foundUser) => {
        const payload = { ...foundUser };
        console.log(payload);
        delete payload._doc.password;
        res.status(200).json(payload._doc);
      })
      .catch((err) => {
        console.log(err);
      });
  });

module.exports = router;