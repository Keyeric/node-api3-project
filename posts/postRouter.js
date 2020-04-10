const express = require("express");

const posts = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  posts
    .get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error retrieving the posts." });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.posts);
});

router.delete("/:id", validatePostId, (req, res) => {
  const id = req.params.id;

  posts
    .remove(id)
    .then(() => {
      res.status(200).json({ message: "The post has been deleted." });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error deleting the post." });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.text) {
    res
      .status(400)
      .json({ message: "Please add text to a new post before submitting" });
  } else {
    posts
      .update(id, body)
      .then((update) => {
        res.status(200).json(update);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Server error updating the post." });
      });
  }
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  posts
    .getById(id)
    .then((post) => {
      if (post) {
        req.posts = post;
        next();
      } else {
        res.status(404).json({ error: "Post ID could not be validated" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error validating the post ID" });
    });
}

module.exports = router;
