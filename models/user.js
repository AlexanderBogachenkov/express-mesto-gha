const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      required: [true, "не передано имя пользователя"], // оно должно быть у каждого пользователя, так что имя — обязательное поле
      minlength: [
        2,
        "длина имени пользователя должна быть не менее 2 символов",
      ], // минимальная длина имени — 2 символа
      maxlength: [
        30,
        "длина имени пользователя должна быть не более 30 символов",
      ], // а максимальная — 30 символов
    },
    about: {
      type: String, // информация о себе — это строка
      required: [true, "не передана информация о себе"], // оно должно быть у каждого пользователя, так что о себе — обязательное поле
      minlength: [2, "длина информации о себе должна быть не менее 2 символов"], // минимальная длина имени — 2 символа
      maxlength: [
        30,
        "длина информации о себе должна быть не более 30 символов",
      ], // а максимальная — 30 символов
    },
    avatar: {
      type: String, // ссылка — это строка
      required: [true, "не передана ссылка на аватар пользователя"],
    },
  },
  { versionKey: false } // отключаем поле "__v"
);

// создаём модель и экспортируем её
module.exports = mongoose.model("user", userSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     // required: true,
//   },
//   age: {
//     type: Number,
//   },
// });

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     default: "Jacques Cousteau",
//     required: true,
//   },
//   about: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     default: "Sailor, researcher",
//     required: true,
//   },
//   avatar: {
//     type: String,
//     default:
//       "https://img5.goodfon.ru/wallpaper/nbig/3/f1/minions-the-rise-of-gru-minon-ulybka.jpg",
//     required: true,
//   },
// });

// module.exports = mongoose.model("users", userSchema);
