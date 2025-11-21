const express = require('express');
const {
    registerUser,
    loginUser,
    getAllUsers,
    getProfileOfCurrentUser,
    getProfileOfUserById,
    revokeAdmin,
    promoteToAdmin
} = require("../controllers/user.controller.js");
const { verify, verifyAdmin } = require("../middleware/auth.js");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", verify, verifyAdmin, getAllUsers);
router.get("/details", verify, getProfileOfCurrentUser);
router.get("/details/:id", verify, verifyAdmin, getProfileOfUserById);
router.patch("/:id/revoke-admin", verify, verifyAdmin, revokeAdmin);
router.patch("/:id/set-as-admin", verify, verifyAdmin, promoteToAdmin);

module.exports = router;