const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String },
      imgs: Array
    },
    users: Array,
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    readed: Boolean,
    createAt: Date
  },
);

module.exports = mongoose.model("Messages", MessageSchema);
