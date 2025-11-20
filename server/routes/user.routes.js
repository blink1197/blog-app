const express = require('express');
const { registerUser, loginUser, getAllUsers, getProfileOfCurrentUser, getProfileOfUserById } = require("../controllers/user.controller.js");
const { verify, verifyAdmin } = require("../middleware/auth.js");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", verify, verifyAdmin, getAllUsers);
router.get("/details", verify, getProfileOfCurrentUser);
router.get("/details/:id", verify, verifyAdmin, getProfileOfUserById);



module.exports = router;