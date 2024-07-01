const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");
const { check } = require("express-validator");

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = { message: "Authentication required" };
  err.status = 401;
  return next(err);
};

const exists = (messageModel) => async (req, res, next) => {
  try {
    const promises = Object.keys(req.params).map(async (modelId) => {
      let modelName = modelId.replace("Id", "");
      const capitalizedModelName =
        modelName.charAt(0).toUpperCase() + modelName.slice(1);
      const Model = require(`../db/models`)[capitalizedModelName];
      // console.log(Model);
      const modelInstance = await Model.findByPk(req.params[modelId]);
      console.log("modelInstance");
      if (!modelInstance) {
        err = new Error(
          `${
            messageModel ? messageModel.name : capitalizedModelName
          } couldn't be found`
        );
        err.status = 404;
        throw err;
      }

      if (!req[modelName]) req[modelName] = modelInstance;
      // console.log(req[modelName]);
    });
    await Promise.all(promises);
    next();
  } catch (err) {
    next(err);
  }
};

// backend/utils/auth.js
// ...

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  exists,
};
