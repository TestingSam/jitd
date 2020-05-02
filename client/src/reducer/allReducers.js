import { TestAction } from "../actions/types";

const initialState = {
  TestDataInAllReducers: "Samir",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TestAction:
      return {
        ...state,
      };
    default:
      return state;
  }
}
