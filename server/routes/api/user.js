const express = require("express");
const router = express.Router();
const { User } = require("../db/models");

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error(`User ${id} doesn't exist`);
    }
    const { password: _, ...response } = user.toJSON();
    res.json({ ...response });
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user.password != password) {
      throw new Error("incorrect password");
    }
    const { password: _, ...response } = user.toJSON();
    res.json({ message: "login successful", ...response });
  } catch (err) {
    err.status = 401;
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      throw new Error(`User ${id} doesn't exist`);
    }

    user.update(req.body);
    const { password, ...response } = user.toJSON();
    res.json({ ...response });
  } catch (err) {
    err.status = 404;
    next(err);
  }
});

router.use((req, res, next) => {
  try {
    throw new Error("Error from users");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
