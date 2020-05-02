import React, { Component } from "react";
import { connect } from "react-redux";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import { TestFunction } from "./actions/allActions";
import JITHeader from "./JITHeader";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
//import JSONPretty from "react-json-prettify";
//import { github } from "react-json-prettify/dist/themes";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";
import Rjv from "react-json-tree-viewer";
import "./GetCollection.css";

class GetCollection extends Component {
  componentDidMount() {
    this.props.TestFunction();
  }
  constructor(props) {
    super(props);
    this.state = {
      appNameEntered: "",
      schema: "Mine",
      open: false,
      selectedFile: null,
      apiData: [],
      selectRowProp: {
        mode: "radio",
        clickToSelect: true,
        style: { background: "green" },
        onSelect: (row, isSelect, rowIndex, e) => {
          console.log(row);
          this.onOpenModal(row);
        },
      },
      columns: [
        {
          dataField: "apiType",
          text: "API TYPE",
        },
        {
          dataField: "apiName",
          text: "API NAME",
        },
        {
          dataField: "apiUrl",
          text: "API URL",
        },
      ],
    };
  }
  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };

  onOpenModal = (row) => {
    this.setState({ open: true, schema: JSON.stringify(row.apiReponseSchema) });
    console.log("OpenModel");
    console.log(row.apiReponseSchema);
    this.setState({
      schema: row.apiReponseSchema,
    });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };
  appNameEntered = (event) => {
    //console.log(event.target.value);
    this.setState({
      appNameEntered: event.target.value,
    });
  };
  onClickHandler = () => {
    const data = new FormData();
    data.append("file", this.state.selectedFile);
    data.append("appNameEntered", this.state.appNameEntered);
    axios
      .post("http://127.0.0.1:5000/upload", data, {
        // receive two    parameter endpoint url ,form data
      })
      .then((res) => {
        // then print response status
        console.log(res);
        this.setState({
          apiData: res.data,
        });
      });
  };
  render() {
    const { testData } = this.props;
    return (
      <div>
        <JITHeader subHeading="Get Apis" />

        <div class="container">
          <form>
            <div class="row">
              <div class="col-md-12">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Name of the React App"
                  name="appNameEntered"
                  onChange={this.appNameEntered}
                />
              </div>
              <div class="col-md-1"></div>
            </div>
          </form>
          <div class="row">
            <hr />
          </div>
          <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
              <form method="post" action="#" id="#">
                <div class="form-group files">
                  <label>Upload Your Postman Collection File </label>
                  <input
                    type="file"
                    class="form-control"
                    onChange={this.onChangeHandler}
                    multiple=""
                  />
                </div>
              </form>
            </div>
            <button
              type="button"
              class="btn btn-success btn-block"
              onClick={this.onClickHandler}
            >
              Upload
            </button>
          </div>
          <BootstrapTable
            keyField="id"
            data={this.state.apiData}
            columns={this.state.columns}
            selectRow={this.state.selectRowProp}
          />
          <div>
            <Modal open={this.state.open} onClose={this.onCloseModal} center>
              <Rjv data={this.state.schema} />
            </Modal>
            <a href="http://127.0.0.1:5000/" className="btn btn-success">
              Next>>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  testData: state.dataFromReducer.TestDataInAllReducers,
});

export default connect(mapStateToProps, { TestFunction })(GetCollection);
