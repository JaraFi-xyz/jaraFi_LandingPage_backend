const express = require("express");
const { joinWaitlist } = require("../controllers/waitlistUser_controller");

const router = express.Router();

router.post("/join", joinWaitlist);

module.exports = router;
