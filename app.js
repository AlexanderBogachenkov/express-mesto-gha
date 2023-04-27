const express = require("express");

// const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const router = require("./routes/index");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(express.json()); // вместо body-parser
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "644957597ce875518ac3f777", // вставьте сюда _id
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
