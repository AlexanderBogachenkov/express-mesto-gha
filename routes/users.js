const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers, getUserById, getMe, updateProfile, updateAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getMe);
router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
}), getUserById);
router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im),
  }),
}), updateAvatar);

module.exports = router;
