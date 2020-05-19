import React, { Component } from "react";
import { CardSlideItem } from "react-card-slide/dist";
import { CardSlide } from "react-card-slide/dist";
import { connect } from "react-redux";
import {
  getFromGETRequest,
  postToPOSTRequest,
  //ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_IMPORT
  actionFunctionFor_GetLatestNews,
  //END_OF_ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_IMPORT
} from "./actions/allActions";

const actionFunction = {
  getFromGETRequest,
  postToPOSTRequest,
  //ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_ACTION_FUNCTION

  actionFunctionFor_GetLatestNews,
  //END_OF_ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_ACTION_FUNCTION
};

class BaseComponent extends Component {
  state = {
    //ADD_NEW_REQUEST_STATE_VARIABLE_FROM_HERE
    GetLatestNews_Reques1: "Covid19",
    //END_OF_ADD_NEW_REQUEST_STATE_VARIABLE_FROM_HERE
    //ADD_NEW_PROPS_STATE_VARIABLE_FROM_HERE
    GetLatestNews_Response1_State: [],
    //END_OF_ADD_NEW_PROPS_STATE_VARIABLE_FROM_HERE
  };
  //START_OF_FORM_FUNCTION


OnChange_GetLatestNews_Reques1= (e) => {this.setState({ GetLatestNews_Reques1: e.target.value });};
OnClick_GetLatestNews_Reques1= () => {this.props.actionFunctionFor_GetLatestNews(this.state.GetLatestNews_Reques1);};
  //END_OF_FORM_FUNCTION
  componentDidMount() {
    //ADD_NEW_ACTION_METHODS_FOR_COMPONENTDIDMOUNT
    this.props.actionFunctionFor_GetLatestNews(
      this.state.GetLatestNews_Reques1
    );
    //END_OF_ADD_NEW_ACTION_METHODS_FOR_COMPONENTDIDMOUNT
  }
  componentWillReceiveProps(newProps) {
    if (this.props !== newProps) {
      //UPDATE_OF_PROPS
      if (newProps.GetLatestNews_Response1) {
        console.log(newProps.GetLatestNews_Response1.articles);
        this.setState({
          GetLatestNews_Response1_State:
            newProps.GetLatestNews_Response1.articles,
        });
      }
      //END_OF_UPDATE_OF_PROPS
    }
  }

  render() {
    const {
      //ADD_NEW_RESPONSE_STATE_VARIABLE_HERE
      GetLatestNews_Response1,
      //END_OF_ADD_NEW_RESPONSE_STATE_VARIABLE_HERE
    } = this.props;
    return (
      <div>
        {
          //START_OF_JSX
		  
<div class='container-fluid'><div class='row-fluid'><div class='col-xs-12'><input type='text' class='form-control' onChange={this.OnChange_GetLatestNews_Reques1.bind(this)} /><button class='btn btn-success btn-block' type='button' onClick={this.OnClick_GetLatestNews_Reques1.bind(this)}>SEARCH</button> {this.state.GetLatestNews_Response1_State.map((data) => { return (<div class='card'><div class='card-header'>{data.title}</div><div class='card-body'><p class='card-text'>{data.description}</p><a href={data.url} class='btn btn-primary'>Open link</a></div></div> ); })}</div></div></div>
          //END_OF_JSX
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  //ADD_NEW_RESPONSE_STATE_VARIABLE_HERE_FOR_MAP_STATE_TO_PROPS
  GetLatestNews_Response1: state.data.GetLatestNews_Response1,
  //END_OF_ADD_NEW_RESPONSE_STATE_VARIABLE_HERE_FOR_MAP_STATE_TO_PROPS
});

export default connect(mapStateToProps, actionFunction)(BaseComponent);
