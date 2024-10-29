const mongoose = require("mongoose");

const storysSchema = new mongoose.Schema({
  owner: {
    type: String,
    require: true,
  },
  story: {
    type: String,
    require: true,
  },
  background: {
    type: String,
  },
  link: {
    type: String,
  },
  likes: Array,
  createAt: Date,
});

module.exports = mongoose.model("Story", storysSchema);
