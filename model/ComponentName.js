const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const componentNameSchema = new MSchema({
  componentName: { type: String, unique: true }, // ensures the componentName is always unique
  user: String,
  time: Object,
  isGridPresent: String,
  developerLayout: String,
  actualLayout: String
});

module.exports = mongoose.model("componentName", componentNameSchema);
