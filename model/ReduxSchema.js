const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const reduxSchema = new MSchema({
  typesVariable: { type: String, unique: true }, // ensures the componentName is always unique
  actionFunction: String,
  actionsImport: Object,
  reducerImport: String,
  reducerInitialState: String,
  reducerCase: String,
  component: String,
  HtmlNodes: Array
});

module.exports = mongoose.model("reduxSchema", reduxSchema);
