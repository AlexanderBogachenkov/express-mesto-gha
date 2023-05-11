const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require("../controllers/cards");

router.get("/", getCards);
router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), deleteCardById);
router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im),
  }),
}), createCard);
router.put("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), likeCard);
router.delete("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), dislikeCard);
module.exports = router;
