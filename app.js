const express = require("express");

// const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const router = require("./routes/index");

const { PORT = 3000 } = process.env;
const app = express();
// const { users, cards } = require("./data");
// const userRouter = require("./routes/users");
// const cardsRouter = require("./routes/cards");

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(express.json()); // вместо body-parser
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "644957597ce875518ac3f777", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(userRouter);
// app.use(cardsRouter);

// app.listen(PORT, () => {
//   console.log("Server started on port ", PORT);
// });

// const User = require("./models/user");

// const getUsers = (req, res) => {
//   User.find().then((users) => {
//     res
//       .send({ data: users })
//       .catch(res.status(500).send({ message: "Error!" }));
//   });
// };

// const userRoute = require("./routes/users");
// const cardsRoute = require("./routes/users");

// app.use(userRoute);
// app.use(cardsRoute);

// app.post("/users", (req, res) => {
//   console.log("req.body => ", req.body);

// const user = {
//   id: Math.floor(Math.random() * 1000 + 1),
//   name: "Test name",
//   age: 55,
// };
// users.push(user);
// res.status(201).send({ data: user });
// });

// {
//   "name": "Тестовый пользователь",
//   "about": "Информация о себе",
//   "avatar": "https://www.test.com/"
//   }
