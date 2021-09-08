const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  users:[{
    type: Array,
    required: true,
  }],
  messages: [
    {
      type: Object,
      required: false,
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
