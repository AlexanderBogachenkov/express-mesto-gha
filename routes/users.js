const router = require("express").Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMe,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserById);

router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);
router.post("/signin", login);
router.post("/signup", createUser);
router.post("/users/me", getMe);

module.exports = router;
