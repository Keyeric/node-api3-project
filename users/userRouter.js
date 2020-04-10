const express = require("express");

const users = require("./userDb.js");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  res.status(200).json(req.user);
});

router.post("/:id/posts", validatePost, (req, res) => {
  res.status(200).json(req.userposts);
});

router.get("/", (req, res) => {
  users
    .get()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the users." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;

  users
    .getUserPosts(id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to retrieve posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;

  users
    .remove(id)
    .then(() => {
      res.status(200).json({ message: "The user has been deleted" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  if (!body.name) {
    res.status(400).json({ message: "Need to update the user name." });
  } else {
    users
      .update(id, body)
      .then((update) => {
        res.status(200).json(update);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Failed to update user name" });
      });
  }
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  console.log(id);
  users
    .getById(id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ error: "Invalid user ID." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error validating user ID" });
    });
}

function validateUser(req, res, next) {
  const body = req.body;
  users
    .insert(body)
    .then((users) =>
      !users
        ? res.status(400).json({ error: "no user found" })
        : !body.name
        ? res.status(400).json({ error: "invalid name" })
        : (req.users = users) & next()
    )
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error adding user" });
    });
}

function validatePost(req, res, next) {
  const id = req.params.id;
  const user = { ...req.body, user_id: id };
  Posts.insert(user)
    .then((users) =>
      !users & console.log(users)
        ? res.status(400).json({ error: "no user" })
        : !user.text
        ? res.status(400).json({ message: "missing post data" })
        : (req.userposts = users) & console.log("req.userposts", users) & next()
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "error" });
    });
}

module.exports = router;
