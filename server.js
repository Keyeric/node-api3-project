const express = require("express");

const server = express();

// Posts & User Router
const postsRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

server.use(express.json());

// Endpoint routers
server.use("/api/users", logger, userRouter);
server.use("/api/posts", logger, postsRouter);

//Base url endpoint(s)
server.get("/", (req, res) => {
  res.send(`<h2>We wrote some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} Request to ${req.originalUrl}`
  );
  next();
}

module.exports = server;
