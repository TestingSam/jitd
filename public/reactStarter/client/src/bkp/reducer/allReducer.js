import { GET_SOMETHING_FROM_GET_REQUEST } from "../actions/types";
import { POST_SOMETHING_TO_POST_REQUEST } from "../actions/types";
//ADD_NEW_IMPORTS_FOR_REDUCER_FROM_HERE

//END_OF_ADD_NEW_IMPORTS_FOR_REDUCER_FROM_HERE
const initialState = {
  dataFromPostRequest: "",
  dataFromGetRequestArrayType: ["Samir1"],
  //ADD_NEW_RESPONSE_STATE_FROM_HERE

  //END_OF_ADD_NEW_RESPONSE_STATE_FROM_HERE
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SOMETHING_FROM_GET_REQUEST:
      return { ...state, dataFromGetRequestArrayType: action.payload };
    //ADD_NEW_CASES_FROM_HERE

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
