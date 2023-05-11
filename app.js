const express = require("express");
const router = require("express").Router(); // импортируем роутер из express
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { errors, celebrate, Joi } = require("celebrate");

const mongoose = require("mongoose");
const { createUser, login } = require("./controllers/users");
const NotFoundError = require("./utils/NotFoundError");
const errorsHandler = require("./middlewares/errors");
const auth = require("./middlewares/auth");

// const router = require("./routes/index");
const userRoute = require("./routes/users");
const cardRoute = require("./routes/cards");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(helmet());
app.disable("x-powered-by");

// express.json();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(router);

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

// роуты, которым авторизация нужна
app.use("/users", auth, userRoute);
app.use("/cards", auth, cardRoute);

// роут для запросов по несуществующим URL
router.use("/*", () => {
  throw new NotFoundError("Запрашиваемый URL не существует");
});

app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
