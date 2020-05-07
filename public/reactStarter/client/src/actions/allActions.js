import { GET_SOMETHING_FROM_GET_REQUEST } from "./types";
import { POST_SOMETHING_TO_POST_REQUEST } from "./types";
//ADD_NEW_IMPORTS_FOR_ACTIONS_FROM_HERE

import { typeFor_GetCovidStates } from "./types";
//END_OF_ADD_NEW_IMPORTS_FOR_ACTIONS_FROM_HERE
import axios from "axios";

export const getFromGETRequest = () => async (dispatch) => {
  const res = await axios.get("http://127.0.0.1:7860/");
  dispatch({
    type: GET_SOMETHING_FROM_GET_REQUEST,
    payload: res.data,
  });
};

export const postToPOSTRequest = (valueReceived) => async (dispatch) => {
  const res = await axios.post("http://127.0.0.1:7860/setData", {
    dataToPostNodeJs: valueReceived,
  });
  dispatch({
    type: POST_SOMETHING_TO_POST_REQUEST,
    payload: res.data,
  });
};

//ADD_NEW_ACTIONS_FROM_HERE

export const actionFunctionFor_GetCovidStates = (valueGot) => async (
  dispatch
) => {
  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-host", "covid-193.p.rapidapi.com");
  myHeaders.append(
    "x-rapidapi-key",
    "dd44d0a755msh52836eccd71549bp127125jsn8a184ed28c8d"
  );
  var raw;
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  var result = await fetch(
    "https://covid-193.p.rapidapi.com/statistics?country=USA",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.log("error", error));
  dispatch({ type: typeFor_GetCovidStates, payload: result });
};
//END_OF_ADD_NEW_ACTIONS_FROM_HERE
