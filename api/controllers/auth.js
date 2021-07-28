require("dotenv").config();
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/Users");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(req.body.password, salt);
    await Users.create({ ...req.body, password: hashed });
    res.status(201).json({ msg: "User created" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (!user) {
      throw new Error("No user with this email");
    }
    const authed = bcrypt.compare(req.body.passsword, user.password); //Add passwordDigest in users model?
    if (authed) {
      const payload = { username: user.username, email: user.email };
      const sendToken = (err, token) => {
        if (err) {
          throw new Error("Error in token generation");
        }
        res.status(200).json({
          success: true,
          token: "Bearer " + token,
        });
      };
      jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, sendToken);
    } else {
      throw new Error("User could not be authenticated");
    }
  } catch (err) {
    res.status(401).json({ err });
  }
});
module.exports = router;
