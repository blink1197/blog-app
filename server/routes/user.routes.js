const express = require('express');
const { registerUser, loginUser, getProfile, getAllUsers } = require("../controllers/user.controller.js");
const { verify, verifyAdmin } = require("../middleware/auth.js");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/details", verify, getProfile);
router.get("/all", verify, verifyAdmin, getAllUsers);


module.exports = router;