const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const AppSchemaContentSchema = new MSchema({
  schemaName: { type: String, unique: true }, // ensures the schemaName is always unique
  columnName: Array,
  columnTypes: Array
});

module.exports = mongoose.model(
  "AppSchemaContentSchema",
  AppSchemaContentSchema
);
