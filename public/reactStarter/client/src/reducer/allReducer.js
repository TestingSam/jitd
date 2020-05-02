import { GET_SOMETHING_FROM_GET_REQUEST } from "../actions/types";
import { POST_SOMETHING_TO_POST_REQUEST } from "../actions/types";
//ADD_NEW_IMPORTS_FOR_REDUCER_FROM_HERE

import { typeFor_GetCovidStates } from "../actions/types";
import { typeFor_GetCountriesForCovid } from "../actions/types";
//END_OF_ADD_NEW_IMPORTS_FOR_REDUCER_FROM_HERE
const initialState = {
  dataFromPostRequest: "",
  dataFromGetRequestArrayType: ["Samir1"],
  //ADD_NEW_RESPONSE_STATE_FROM_HERE

  GetCovidStates_Response2: 0,
  GetCountriesForCovid_Response2: [],
  //END_OF_ADD_NEW_RESPONSE_STATE_FROM_HERE
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SOMETHING_FROM_GET_REQUEST:
      return { ...state, dataFromGetRequestArrayType: action.payload };
    //ADD_NEW_CASES_FROM_HERE

    case typeFor_GetCovidStates:
      return { ...state, GetCovidStates_Response2: action.payload };
    case typeFor_GetCountriesForCovid:
      return { ...state, GetCountriesForCovid_Response2: action.payload };
    //END_OF_ADD_NEW_CASES_FROM_HERE
    case POST_SOMETHING_TO_POST_REQUEST:
      return {
        ...state,
        dataFromPostRequest: action.payload,
      };
    default:
      return state;
  }
}