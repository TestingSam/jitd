import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from "reactstrap";
import { connect } from "react-redux";
import { TestFunction } from "./actions/allActions";
import JITHeader from "./JITHeader";

class HomePage extends Component {
  componentDidMount() {
    this.props.TestFunction();
  }
  render() {
    const { testData } = this.props;
    return (
      <div class="container-fluid">
        <JITHeader subHeading="App Development Made Easier" />
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-1"></div>
            <div class="col-md-4">
              <Card>
                <CardImg
                  top
                  width="100%"
                  src="http://127.0.0.1:5000/img/react.png"
                  alt="Card image cap"
                />
                <CardBody>
                  <CardTitle>REACT APP</CardTitle>
                  <CardSubtitle></CardSubtitle>
                  <CardText>Click Next to Develop React-Redux App</CardText>
                  <Link className="btn btn-info" to="/GetAPIS">
                    Next>>
                  </Link>
                </CardBody>
              </Card>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-4">
              <Card>
                <CardImg
                  top
                  width="100%"
                  src="http://127.0.0.1:5000/img/angular.png"
                  alt="Card image cap"
                />
                <CardBody>
                  <CardTitle>ANGULAR APP</CardTitle>
                  <CardSubtitle></CardSubtitle>
                  <CardText>Click Next to Develop Angular App</CardText>
                  <Button disabled>Next>></Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  testData: state.dataFromReducer.TestDataInAllReducers,
});

export default connect(mapStateToProps, { TestFunction })(HomePage);
