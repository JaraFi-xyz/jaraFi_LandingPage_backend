const express = require("express");
const { joinWaitlist } = require("../controllers/waitlistUser_controller");
const { unsubscribeUser } = require("../controllers/waitlistUser_controller");

const router = express.Router();




router.get("/unsubscribe", unsubscribeUser);

router.post("/join", joinWaitlist);

module.exports = router;
