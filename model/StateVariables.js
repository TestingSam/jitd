const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const StateVariables = new MSchema({
  StateVariableName: String, // ensures the componentName is always unique
  StateVariableType: String, //Request or Reponse
  StateVariableDataType: String, //Node Or Array or Number
  apiName: String,
  sampleValueForStateVariable: String,
  stateVariableNode: String,
  actionFunction: String,
});

module.exports = mongoose.model("StateVariables", StateVariables);
