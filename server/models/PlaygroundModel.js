const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const PlaygroundSchema = new Schema({
  templates: Array,
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("PlaygroundModel", PlaygroundSchema);
