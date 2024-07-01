require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

app.use(express.json());

const userRouter = require("./routes/user.js");
const requestRouter = require("./routes/api/request.js");
const leadRouter = require("./routes/api/lead.js");
const apiRouter = require("./routes");
app.use("/api/users", userRouter);
app.use("/api/requests", requestRouter);
app.use("/api/leads", leadRouter);

app.use('/api',apiRouter)

app.use((req, res, next) => {
  try {
    throw new Error("no page found");
  } catch (err) {
    err.status = 404;
    next(err);
  }
});
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ status: err.status || 500, message: err.message });
});

app.listen(port, () => {
  console.log("listening on port", port);
});

module.exports = app