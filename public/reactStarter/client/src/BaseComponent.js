import React, { Component } from "react";
import { CardSlideItem } from "react-card-slide/dist";
import { CardSlide } from "react-card-slide/dist";
import { connect } from "react-redux";
import {
  getFromGETRequest,
  postToPOSTRequest,
  //ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_IMPORT
  actionFunctionFor_GetCovidStates,
  //END_OF_ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_IMPORT
} from "./actions/allActions";

const actionFunction = {
  getFromGETRequest,
  postToPOSTRequest,
  //ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_ACTION_FUNCTION

  actionFunctionFor_GetCovidStates,
  //END_OF_ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_ACTION_FUNCTION
};

class BaseComponent extends Component {
  state = {
    //ADD_NEW_REQUEST_STATE_VARIABLE_FROM_HERE

    //END_OF_ADD_NEW_REQUEST_STATE_VARIABLE_FROM_HERE
    //ADD_NEW_PROPS_STATE_VARIABLE_FROM_HERE

    GetCovidStates_Response1_State: 0,
    //END_OF_ADD_NEW_PROPS_STATE_VARIABLE_FROM_HERE
  };
  componentDidMount() {
    //ADD_NEW_ACTION_METHODS_FOR_COMPONENTDIDMOUNT
    //END_OF_ADD_NEW_ACTION_METHODS_FOR_COMPONENTDIDMOUNT
  }
  componentWillReceiveProps(newProps) {
    if (this.props !== newProps) {
      //UPDATE_OF_PROPS

      if (newProps.GetCovidStates_Response1) {
        console.log(newProps.GetCovidStates_Response1.response[0].cases.active);
        this.setState({
          GetCovidStates_Response1_State:
            newProps.GetCovidStates_Response1.response[0].cases.active,
        });
      }
      //END_OF_UPDATE_OF_PROPS
    }
  }

  render() {
    const {
      //ADD_NEW_RESPONSE_STATE_VARIABLE_HERE

      GetCovidStates_Response1,
      //END_OF_ADD_NEW_RESPONSE_STATE_VARIABLE_HERE
    } = this.props;
    return <div>{this.state.GetCovidStates_Response1_State}</div>;
  }
}

const mapStateToProps = (state) => ({
  //ADD_NEW_RESPONSE_STATE_VARIABLE_HERE_FOR_MAP_STATE_TO_PROPS

  GetCovidStates_Response1: state.data.GetCovidStates_Response1,
  //END_OF_ADD_NEW_RESPONSE_STATE_VARIABLE_HERE_FOR_MAP_STATE_TO_PROPS
});

export default connect(mapStateToProps, actionFunction)(BaseComponent);
