const { DocumentNotFoundError, CastError, ValidationError } = require("mongoose").Error;

const Card = require("../models/cards");

const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/constants");

// Функция, которая возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send(cards))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

// Функция, которая создаёт карточку
const createCard = (req, res) => {
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
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при создании карточки: ${errorMessage}`,
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

// Функция, которая удаляет карточку по идентификатору
const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: "Карточка с указанным _id не найдена",
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Передан некорректный ID пользователя" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

// Функция изменения статуса лайка карточки
const changeLikeCardStatus = (req, res, likeOtpions) => {
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
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

// Функция-декоратор постановки лайка карточки
const likeCard = (req, res) => {
  const { _id: userId } = req.user;
  // добавить _id пользователя в массив, если его там нет
  const likeOptions = { $addToSet: { likes: userId } };
  changeLikeCardStatus(req, res, likeOptions);
};

// Функция-декоратор снятия лайка карточки
const dislikeCard = (req, res) => {
  const { _id: userId } = req.user;
  const likeOptions = { $pull: { likes: userId } }; // убрать _id пользователя из массива
  changeLikeCardStatus(req, res, likeOptions);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
