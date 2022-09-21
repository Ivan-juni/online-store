const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const gamesRouter = require("./gamesRouter");
const cartRouter = require("./cartRouter");

router.use("/user", userRouter);
router.use("/games", gamesRouter);
router.use("/cart", cartRouter);

module.exports = router;
