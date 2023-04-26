const router = require("express").Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.post("/", createUser);

router.patch("/me", updateProfile);

router.patch("/me/avatar", updateAvatar);

module.exports = router; // экспортировали этот роутер

// const express = require("express");
// const { getUsers, getUser, createUser } = require("../controllers/users");

// const userRouter = express.Router();

// userRouter.get("/users", getUsers);
// userRouter.get("/users/:id", getUser);
// userRouter.post("/users", createUser);

// const userRouter = express.Router();

// const { getUsers, getUser, createUser } = require("../controllers/users");

// module.exports = userRouter;
