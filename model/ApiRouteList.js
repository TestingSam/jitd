const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const ApiRouteListSchema = new MSchema({
  apiName: { type: String, unique: true }, // ensures the apiName is always unique
  user: String,
  apiType: String,
  apiReponseSchema: String,
  apiRequestSchema: String,
  request: String,
  codeSnippet: String,
  response: String,
});

module.exports = mongoose.model("ApiRouteList", ApiRouteListSchema);
