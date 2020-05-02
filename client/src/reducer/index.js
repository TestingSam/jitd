import { combineReducers } from "redux";
import allReducer from "./allReducers";

export default combineReducers({
  dataFromReducer: allReducer,
});
