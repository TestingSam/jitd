const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const AvailableColumnSchema = new MSchema({
  columnName: { type: String, unique: true }, // ensures the componentName is always unique
  columnTypes: { type: String }
});

module.exports = mongoose.model("availableColumns", AvailableColumnSchema);
