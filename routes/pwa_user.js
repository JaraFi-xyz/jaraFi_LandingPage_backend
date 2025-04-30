const express = require("express");
const {getPwaUser, verifyPwaUser, registerPwaUser} = require("../controllers/pwaUserController")
const router = express.Router();




router.get("/:referenceId", getPwaUser);

router.post("/register", registerPwaUser);
router.post("/webhook", verifyPwaUser)

module.exports = router;
