const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const NotFoundError = require("../utils/NotFoundError");
const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const ConflictingRequestError = require("../utils/ConflictingRequestError");

const {
  CREATED_CODE,
} = require("../utils/constants");

const User = require("../models/user");

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });

      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        next(new UnauthorizedError("Вы не авторизованы"));
      } else {
        res.send({ data: users });
      }
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь по указанному _id не найден"));
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Передан некорректный ID пользователя"));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    // eslint-disable-next-line object-curly-newline
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))

    .then((user) => res.status(CREATED_CODE).send(user))

    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные при создании пользователя"));
      } else if (
        error.code === 11000
      ) {
        next(new ConflictingRequestError("Такой пользователь уже зарегистрирован"));
      } else {
        next(error);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  // Объект опций для того, чтобы валидировать поля, и чтобы обновить запись в обработчике then
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь с таким идентификатором не найден"));
      } else {
        res.send({ user });
      }
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные при редактировании профиля пользователя"));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь с таким идентификатором не найден"));
      } else {
        res.send({ user });
      }
    })
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные при редактировании профиля аватара"));
      } else {
        next(error);
      }
    });
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь с таким идентификатором не найден"));
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMe,
};
