const express = require("express");
const router = require("express").Router();
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
const { regEx } = require("./utils/constants");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(helmet());
app.disable("x-powered-by");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// express.json(); // не проходит тесты

app.use(router);

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
    // avatar: Joi.string().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im),
    avatar: Joi.string().regex(regEx),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

// роуты, которым авторизация нужна
app.use("/users", auth, userRoute);
app.use("/cards", auth, cardRoute);

// app.use("/*", () => {
//   throw new NotFoundError("Страница  по этому адресу не найдена");
// });

router.use("*", auth, (req, res, next) => {
  next(new NotFoundError("Запрашиваемый URL не существует"));
});

app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
