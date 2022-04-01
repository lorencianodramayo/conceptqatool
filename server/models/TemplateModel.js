const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  url: String,
  uid: String,
  directory: String,
  dynamicValues: Object,
  dynamicElements: Object,
  possibleValues: Object,
  name: String,
  size: String,
  assets: Array,
  fileURL: String,
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("TemplateModel", TemplateSchema);
