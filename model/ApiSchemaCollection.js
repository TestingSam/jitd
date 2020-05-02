const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const ApiSchemaCollectionSchema = new MSchema({
  elementKey: { type: String, unique: true }, // ensures the schemaName is always unique
  componentName: String,
  apiName: String,
  schemaName: String,
  apiType: String,
  event: String,
  eventAttributeValue: String,
  eventFunction: String,
  data_Variable: String,
  mapStateToProps: String,
  imports: String,
  stateVariable: String
});

module.exports = mongoose.model(
  "ApiSchemaCollection",
  ApiSchemaCollectionSchema
);
