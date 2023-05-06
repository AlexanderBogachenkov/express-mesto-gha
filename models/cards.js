const mongoose = require("mongoose");

const isUrl = require("validator/lib/isURL");

// eslint-disable-next-line function-paren-newline
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "не передано название"],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, "не передана ссылка"],
    validate: {
      validator: (link) => isUrl(link, { protocols: ["http", "https"], require_protocol: true }),
      message: "ссылка не соответствует формату",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "не передано имя владельца"],
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{ versionKey: false }, // отключаем поле "__v"
);

module.exports = mongoose.model("card", cardSchema);
