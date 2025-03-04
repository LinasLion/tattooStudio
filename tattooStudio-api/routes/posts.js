const express = require("express");

const { authenticate } = require("./auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Post 1",
      content: "This is the content of post 1",
      image:
        "https://lh6.googleusercontent.com/proxy/UtPOq26nWlSDaahfDiIpXciAvvqDB6oEC3SMt0yGgin5FA8uRfDU46_DloU2rCFzq6nXtHRJ7WjD7hPI_XegM3ASHjHNbZabMtcnmv4",
      createdAt: "2021-09-24T20:00:00.000Z",
    },
    {
      id: 2,
      title: "Post 2",
      content: "This is the content of post 2",
      image:
        "https://lh6.googleusercontent.com/proxy/UtPOq26nWlSDaahfDiIpXciAvvqDB6oEC3SMt0yGgin5FA8uRfDU46_DloU2rCFzq6nXtHRJ7WjD7hPI_XegM3ASHjHNbZabMtcnmv4",
      createdAt: "2021-09-24T20:00:00.000Z",
    },
  ]);
});

router.get("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    title: `Post ${id}`,
    content: `This is the content of post ${id}`,
    image: "https://via.placeholder.com/150",
  });
});

module.exports = router;
