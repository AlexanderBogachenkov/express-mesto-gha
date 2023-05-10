const {
  DocumentNotFoundError,
  CastError,
  ValidationError,
} = require("mongoose").Error;

const NotFoundError = require("../utils/NotFoundError");
const BadRequestError = require("../utils/BadRequestError");
const ForbiddenError = require("../utils/ForbiddenError");

const Card = require("../models/cards");

const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
} = require("../utils/constants");

// Функция возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send(cards))
    .catch(next);
};

// Функция создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => card.populate("owner"))
    // вернём записанные в базу данные
    .then((card) => res.status(CREATED_CODE).send(card))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(" ");
        next(new BadRequestError(`Переданы некорректные данные при создании карточки: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

// Функция удаляет карточку по идентификатору
const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с указанным _id не найдена");
      }
      if (userId !== card.owner.toString()) {
        throw new ForbiddenError("К сожалению, Вы не можете удалить эту карточку");
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ message: "Пост удалён" }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError("Передан некорректный ID карточки"));
      } else {
        next(err);
      }
    });
};

// Функция изменения статуса лайка карточки
const changeLikeCardStatus = (req, res, next, likeOtpions) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, likeOtpions, { new: true })
    .orFail()
    .then((card) => card.populate(["owner", "likes"]))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Переданы некорректные данные для постановки/снятии лайка" });
        return;
      }
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: "Передан несуществующий _id карточки",
        });
      } else {
        next(err);
      }
    });
};

// Функция-декоратор постановки лайка карточки
const likeCard = (req, res, next) => {
  // добавить _id в массив, если его там нет
  const likeOptions = { $addToSet: { likes: req.user._id } };
  changeLikeCardStatus(req, res, next, likeOptions);
};

// Функция-декоратор снятия лайка карточки
const dislikeCard = (req, res, next) => {
  const likeOptions = { $pull: { likes: req.user._id } };
  // убрать _id из массива
  changeLikeCardStatus(req, res, next, likeOptions);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
