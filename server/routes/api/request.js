const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
  res.json({ message: "under construction" });
});

router.use((req, res, next) => {
    try {
      throw new Error("Error from requests");
    } catch (err) {
      next(err);
    }
  });

module.exports = router;