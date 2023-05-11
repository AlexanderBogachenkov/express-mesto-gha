const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers, getUserById, getMe, updateProfile, updateAvatar,
} = require("../controllers/users");
const { regEx } = require("../utils/constants");

router.get("/", getUsers);
router.get("/me", getMe);
router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
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
    // avatar: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im),
    avatar: Joi.string().required().regex(regEx),
  }),
}), updateAvatar);

module.exports = router;
