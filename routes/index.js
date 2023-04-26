const router = require("express").Router();
const { NOT_FOUND_ERROR_CODE } = require("../utils/constants");

const users = require("./users");
const cards = require("./cards");

router.use("/users", users);
router.use("/cards", cards);

router.use("*", (req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Запрашиваемый URL не существует" });
});

module.exports = router;
