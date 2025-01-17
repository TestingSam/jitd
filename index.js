const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const fs = require("fs");
var cmd = require("node-cmd");
const fsextra = require("fs-extra");
const jsonfile = require("jsonfile");
var hbs = require("hbs");
var path = require("path");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const schema = require("./schema/schema");
const { createApolloFetch } = require("apollo-fetch");
var Collection = require("postman-collection").Collection;
var codegen = require("postman-code-generators"); // require postman-code-generators in your project
var sdk = require("postman-collection");
var multer = require("multer");
var jp = require("jsonpath");
var LineByLineReader = require("line-by-line");
var readline = require("linebyline");
const insertLine = require("insert-line");
var rl = require("readline-specific");
var linenumber = require("linenumber");
mongoose.connect("mongodb://samir:rima12@ds229068.mlab.com:29068/jitd", {
  useNewUrlParser: true,
});

mongoose.connection.once("open", () => {
  console.log("Yes! we are connected to mongodb...");
});
const port = process.env.PORT || 5000;
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");
// console.log that your server is up and runnin
const fetch = createApolloFetch({
  uri: "http://127.0.0.1:5000/graphql",
});

app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    var localResponse = res;
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.file.filename);
    console.log(req.body.appNameEntered);
    cmd.get("node getDataCmd.js ./public/" + req.file.filename, function (
      err,
      data,
      stderr
    ) {
      console.log("the current dir contains these files :\n\n", data);
      var apiDataResponse = jsonfile.readFileSync("./public/apiDataForUI.json");
      //console.log(apiDataResponse);
      for (var i = 0; i < apiDataResponse.length; i++) {
        fetch({
          query:
            "mutation addNewApiRouteList($apiName:String, $user:String, $apiType:String, $apiReponseSchema:String, $apiRequestSchema:String, $request:String, $codeSnippet:String, $response:String){addNewApiRouteList(apiName:$apiName, user:$user, apiType:$apiType, apiReponseSchema:$apiReponseSchema, apiRequestSchema:$apiRequestSchema, request:$request, codeSnippet:$codeSnippet, response:$response){apiName apiType apiReponseSchema apiRequestSchema request codeSnippet response}}",
          variables: {
            apiName: apiDataResponse[i].apiName,
            user: "ABC123",
            apiType: apiDataResponse[i].apiType,
            apiReponseSchema: JSON.stringify(
              apiDataResponse[i].apiReponseSchema
            ),
            apiRequestSchema: JSON.stringify(
              apiDataResponse[i].apiRequestSchema
            ),
            request: JSON.stringify(apiDataResponse[i].request),
            codeSnippet: apiDataResponse[i].codeSnippet,
            response: JSON.stringify(apiDataResponse[i].response),
          },
        }).then((res) => {
          console.log(res);
          localResponse.send(apiDataResponse);
        });
      }
    });
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/JSXGenerator", (req, res) => {
  var jsxReceived = req.body.webpage;
  var uiBlockName = req.body.uiBlockName;
  uiBlockName = uiBlockName.trim();
  uiBlockName = JSON.parse(uiBlockName);
  uiBlockName = uiBlockName.trim();
  jsxReceived = JSON.parse(jsxReceived);
  //console.log(htmlReceived);
  const $ = cheerio.load(jsxReceived);
  /*$('[custom_key="H3_81889"]').attr(
    "OnClick",
    "this.OnClickHandler.bind(this)"
  );*/
  $("*[custom_key]").each(function (index) {
    //$(this).attr("OnClick", "this.OnClickHandler" + index + ".bind(this)");
    console.log($(this).attr("custom_key"));
  });
  console.log("JSX GENERATOR..");
  console.log($("body").html());
  var htmlConsolidated = "";
  for (var i = 0; i < $("body").html().split("\n").length; i++) {
    htmlConsolidated =
      htmlConsolidated + $("body").html().split("\n")[i].trim();
  }
  htmlConsolidated = htmlConsolidated.replace(/ </g, "<");
  htmlConsolidated = htmlConsolidated.replace(/"/g, "'");
  htmlConsolidated = htmlConsolidated.replace(/&gt;/g, ">");
  htmlConsolidated = htmlConsolidated.replace("onchange", "onChange");
  htmlConsolidated = htmlConsolidated.replace("onclick", "onClick");
  console.log(htmlConsolidated);
  insertRequiredLine(
    "D:\\dreamproject\\AppGenerator\\public\\reactStarter\\client\\src\\BaseComponent.js",
    htmlConsolidated,
    "//START_OF_JSX",
    "//END_OF_JSX",
    ""
  ).then(function () {
    res.send(200);
  });
});

app.post("/EventCodeGenerator", (req, res) => {
  actionFunctionReceived = req.body.actionFunction;
  stateVariableReceived = req.body.stateVariable;
  actionFunctionReceived = JSON.parse(actionFunctionReceived);
  stateVariableReceived = JSON.parse(stateVariableReceived);
  eventFunction =
    actionFunctionReceived +
    "= (e) => {this.setState({ " +
    stateVariableReceived +
    ": e.target.value });};";
  insertRequiredLine(
    "D:\\dreamproject\\AppGenerator\\public\\reactStarter\\client\\src\\BaseComponent.js",
    eventFunction,
    "//START_OF_FORM_FUNCTION",
    "//END_OF_FORM_FUNCTION",
    ""
  ).then(function () {
    res.send(200);
  });
});

app.post("/ButtonCodeGenerator", (req, res) => {
  actionFunctionReceived = req.body.actionFunction;
  actionFunctionToBeCalledReceived = req.body.actionFunctionToBeCalled;
  actionFunctionReceived = JSON.parse(actionFunctionReceived);
  actionFunctionToBeCalledReceived = JSON.parse(
    actionFunctionToBeCalledReceived
  );

  buttonFunction =
    actionFunctionReceived +
    "= () => {" +
    actionFunctionToBeCalledReceived +
    "};";
  insertRequiredLine(
    "D:\\dreamproject\\AppGenerator\\public\\reactStarter\\client\\src\\BaseComponent.js",
    buttonFunction,
    "//START_OF_FORM_FUNCTION",
    "//END_OF_FORM_FUNCTION",
    ""
  ).then(function () {
    res.send(200);
  });
});

app.post("/getPresenceOfComponent", (req, res) => {
  console.log("getPresenceOfComponent");
  var localResponse = res;
  localRequest = req;
  fetch({
    query:
      "query checkForComponent($compName:String){checkForComponent(componentName:$compName){componentName actualLayout isGridPresent developerLayout}}",
    variables: {
      compName: localRequest.body.uiBlockName
        .toString()
        .replace('"', "")
        .toString()
        .replace('"', ""),
    },
  }).then((res) => {
    if (res.data.checkForComponent === null) {
      localResponse.send(false);
    } else {
      localResponse.send(true);
    }
  });
});

app.post("/getApiRouteList", (req, res) => {
  console.log("getApiRouteList");
  var localResponse = res;
  localRequest = req;
  fetch({
    query:
      "query getApiRouteList($apiType:String){getApiRouteList(apiType:$apiType){apiName}}",
    variables: {
      apiType: localRequest.body.apiTypePassed
        .toString()
        .replace('"', "")
        .toString()
        .replace('"', ""),
    },
  }).then((res) => {
    localResponse.send(res.data.getApiRouteList);
  });
});

app.post("/getAllAvailableSchemas", (req, res) => {
  var localResponse = res;
  localRequest = req;
  fetch({
    query: "query{getAllSchemas{schemaName}}",
  }).then((res) => {
    localResponse.send(res.data.getAllSchemas);
  });
});

app.post("/addColumn", (req, res) => {
  var localResponse = res;
  localRequest = req;
  var columnNamePassed = req.body.columnNamePassed;
  var columnTypePassed = req.body.columnTypePassed;
  fetch({
    query:
      "mutation addNewColumn($columnName:String, $columnTypes:String){addNewColumn(columnName:$columnName, columnTypes:$columnTypes){columnName}}",
    variables: {
      columnName: JSON.parse(columnNamePassed),
      columnTypes: JSON.parse(columnTypePassed),
    },
  }).then((res) => {
    localResponse.send(res.data);
  });
});

app.post("/getColumns", (req, res) => {
  var localResponse = res;
  localRequest = req;
  fetch({
    query: "query{getColumns{columnName}}",
  }).then((res) => {
    localResponse.send(res.data.getColumns);
  });
});

app.post("/getStateVariableNames", (req, res) => {
  var localResponse = res;
  localRequest = req;
  fetch({
    query:
      "query getResponseStateVariables{getResponseStateVariables{StateVariableName sampleValueForStateVariable stateVariableNode apiName}}",
  }).then((res) => {
    localResponse.send(res.data);
  });
});

app.post("/getRequestStateVariableNames", (req, res) => {
  var localResponse = res;
  localRequest = req;
  fetch({
    query:
      "query getRequestStateVariables{getRequestStateVariables{StateVariableName sampleValueForStateVariable stateVariableNode apiName actionFunction}}",
  }).then((res) => {
    localResponse.send(res.data);
  });
});

app.post("/addNewSchema", (req, res) => {
  var localResponse = res;
  localRequest = req;
  console.log(req.body.schemaNamePassed);
  console.log(req.body.columnsSelectedPassed);
  var schemaName = JSON.parse(req.body.schemaNamePassed);
  var columns = JSON.parse(req.body.columnsSelectedPassed);
  var columnsArray = columns["lst"];
  var columnDataTypeArray = [];
  columns["lst"].map((column) => {
    console.log(column);
    var columnNameGetType = column;
    fetch({
      query:
        "query getColumnType($columnName:String){getColumnType(columnName:$columnName){columnTypes}}",
      variables: {
        columnName: columnNameGetType,
      },
    }).then((res) => {
      console.log(res.data.getColumnType.columnTypes);
      columnDataTypeArray.push(res.data.getColumnType.columnTypes);
      if (columnDataTypeArray.length === columnsArray.length) {
        fetch({
          query:
            "mutation addNewSchema($schemaName:String, $columnName:[String], $columnTypes:[String]){addNewSchema(schemaName:$schemaName, columnName:$columnName, columnTypes:$columnTypes){schemaName}}",
          variables: {
            schemaName: schemaName,
            columnName: columnsArray,
            columnTypes: columnDataTypeArray,
          },
        }).then((res) => {
          localResponse.send(res.data);
        });
      }
    });
  });
});

app.post("/SaveAPIPlusSchema", (req, res) => {
  var localResponse = res;
  localRequest = req;
  var apiNamePassed = req.body.apiNamePassed;
  var apiTypePassed = req.body.apiTypePassed;
  var schemaNamePassed = req.body.schemaNamePassed;
  var componentNamePassed = req.body.componentName;
  var eventTypePassed = req.body.eventTypePassed;
  var elementKeyPassed = req.body.elementKey;
  apiNamePassed = JSON.parse(apiNamePassed);
  apiTypePassed = JSON.parse(apiTypePassed);
  schemaNamePassed = JSON.parse(schemaNamePassed);
  componentNamePassed = JSON.parse(componentNamePassed);
  eventTypePassed = JSON.parse(eventTypePassed);
  elementKeyPassed = JSON.parse(elementKeyPassed);
  var eventAttributeValue;
  var eventFunction;
  var data_Variable;
  var mapStateToProps;
  var imports;
  var stateVariable;
  var typesVariable;
  var actionFunction;
  var actionsImport;
  var reducerImport;
  var reducerInitialState;
  var reducerCase;
  console.log(elementKeyPassed);
  console.log(apiNamePassed);
  console.log(apiTypePassed);
  console.log(schemaNamePassed);
  console.log(componentNamePassed);
  console.log(eventTypePassed);
  var localFunctionName = "For" + apiNamePassed;
  eventAttributeValue = "this." + localFunctionName + ".bind(this)";
  eventFunction =
    localFunctionName +
    "()={this.props." +
    localFunctionName +
    "FromReducer();}";
  data_Variable = "DataFor" + localFunctionName;
  mapStateToProps = data_Variable + ":state.data1.StateToProp" + data_Variable;
  imports =
    "Import {" + localFunctionName + 'FromReducer from "../actions/allactions"';
  stateVariable = apiNamePassed + "_" + Math.round(Math.random() + 100000);
  //typesVariable
  typesVariable = apiNamePassed + "_FOR_" + componentNamePassed;
  //actionFunction
  var reducerFunctionName = localFunctionName + "FromReducer";
  actionFunction =
    "export const " +
    reducerFunctionName +
    " = () => async dispatch => {const res = await axios." +
    apiTypePassed +
    "('http://127.0.0.1:7860/" +
    apiNamePassed +
    "'); dispatch({type: " +
    typesVariable +
    ",payload: res.data });};";
  //actionImport
  actionsImport = "import { " + typesVariable + ' } from "./types";';
  //reducerImport
  reducerImport = "import { " + typesVariable + ' } from "../actions/types";';
  //reducerInitialState
  reducerInitialState = data_Variable + ':""';
  // reducerCase
  reducerCase =
    "case " +
    typesVariable +
    ":return { ...state, " +
    data_Variable +
    ": action.payload };";

  console.log("--------------------------------------");
  console.log(eventAttributeValue);
  console.log(eventFunction);
  console.log(data_Variable);
  console.log(mapStateToProps);
  console.log(imports);
  console.log(stateVariable);

  console.log(typesVariable);
  console.log(actionFunction);
  console.log(actionsImport);
  console.log(reducerImport);
  console.log(reducerInitialState);
  console.log(reducerCase);
  fetch({
    query:
      "query getReduxEntry($typesVariable:String){getReduxEntry(typesVariable:$typesVariable){typesVariable}}",
    variables: {
      typesVariable: typesVariable,
    },
  }).then((res) => {
    if (res.data.getReduxEntry === null) {
      fetch({
        query:
          "mutation addNewReduxEntry($typesVariable:String, $actionFunction:String, $actionsImport:String, $reducerImport:String, $reducerInitialState:String, $reducerCase:String, $component:String, $HtmlNodes:[String]){addNewReduxEntry(typesVariable:$typesVariable, actionFunction:$actionFunction, actionsImport:$actionsImport, reducerImport:$reducerImport, reducerInitialState:$reducerInitialState, reducerCase:$reducerCase, component:$component, HtmlNodes:$HtmlNodes ){typesVariable}}",
        variables: {
          typesVariable: typesVariable,
          actionFunction: actionFunction,
          actionsImport: actionsImport,
          reducerImport: reducerImport,
          reducerInitialState: reducerInitialState,
          reducerCase: reducerCase,
          component: componentNamePassed,
          HtmlNodes: [elementKeyPassed],
        },
      }).then((res) => {});
    } else {
      console.log("IN THE ELSE BLOCK OF REDUX FUNCTION SECTION");
      fetch({
        query:
          "mutation updateReduxEntry($typesVariable:String, $HtmlNodes:[String]){updateReduxEntry(typesVariable:$typesVariable, HtmlNodes:$HtmlNodes ){typesVariable}}",
        variables: {
          typesVariable: typesVariable,
          HtmlNodes: [elementKeyPassed],
        },
      }).then((res) => {});
    }
  });
  fetch({
    query:
      "mutation addAPISchemaCollectionList($elementKey:String, $componentName:String, $apiName:String, $schemaName:String, $apiType:String, $event:String, $eventAttributeValue:String, $eventFunction:String, $data_Variable:String, $mapStateToProps:String, $imports:String, $stateVariable:String){addAPISchemaCollectionList(elementKey:$elementKey, componentName:$componentName, apiName:$apiName, schemaName:$schemaName, apiType:$apiType, event:$event, eventAttributeValue:$eventAttributeValue, eventFunction:$eventFunction, data_Variable:$data_Variable, mapStateToProps:$mapStateToProps, imports:$imports, stateVariable:$stateVariable){schemaName}}",
    variables: {
      elementKey: elementKeyPassed,
      componentName: componentNamePassed,
      apiName: apiNamePassed,
      schemaName: schemaNamePassed,
      apiType: apiTypePassed,
      event: eventTypePassed,
      eventAttributeValue: eventAttributeValue,
      eventFunction: eventFunction,
      data_Variable: data_Variable,
      mapStateToProps: mapStateToProps,
      imports: imports,
      stateVariable: stateVariable,
    },
  }).then((res) => {
    localResponse.send(res.data);
  });
});

app.post("/GetAPIData", (req, res) => {
  var localResponse = res;
  localRequest = req;
  fetch({
    query:
      "query getApiData($apiName:String){getApiData(apiName:$apiName){apiName apiType apiReponseSchema apiRequestSchema request response codeSnippet}}",
    variables: {
      apiName: JSON.parse(localRequest.body.apiName),
    },
  }).then((res) => {
    localResponse.send(res.data.getApiData[0]);
  });
});

app.post("/uiblockmetadata", (req, res) => {
  var localResponse = res;
  localRequest = req;
  fetch({
    query:
      "query checkForComponent($compName:String){checkForComponent(componentName:$compName){componentName actualLayout isGridPresent developerLayout}}",
    variables: {
      compName: localRequest.body.uiBlockName
        .toString()
        .replace('"', "")
        .toString()
        .replace('"', ""),
    },
  }).then((res) => {
    if (res.data.checkForComponent === null) {
      fetch({
        query:
          'mutation newComponentName($compName:String, $gridPres:String, $devComp:String, $actualComp:String){  newComponentName(componentName:$compName, user:"ABC123", isGridPresent:$gridPres, developerLayout:$devComp, actualLayout:$actualComp){componentName user isGridPresent actualLayout developerLayout}}',
        variables: {
          compName: localRequest.body.uiBlockName
            .toString()
            .replace('"', "")
            .toString()
            .replace('"', ""),
          gridPres: localRequest.body.gridPresence,
          devComp: "",
          actualComp: "",
        },
      }).then((res) => {
        if (res.data.newComponentName === null)
          localResponse.send(res.data.newComponentName);
        else
          localResponse.send(
            localRequest.body.uiBlockName
              .toString()
              .replace('"', "")
              .toString()
              .replace('"', "")
          );
      });
    } else {
      console.log("IN THE ELSE BLOCK");
      fetch({
        query:
          "mutation updateComponent($compName:String, $gridPres:String, $devComp:String, $actualComp:String){  updateComponent(componentName:$compName, isGridPresent:$gridPres, developerLayout:$devComp, actualLayout:$actualComp){componentName user isGridPresent developerLayout actualLayout}}",
        variables: {
          compName: localRequest.body.uiBlockName
            .toString()
            .replace('"', "")
            .toString()
            .replace('"', ""),
          gridPres: localRequest.body.gridPresence,
          devComp: localRequest.body.devComp,
          actualComp: localRequest.body.actualComp,
        },
      }).then((res) => {
        if (res.data.newComponentName === null)
          localResponse.send(res.data.newComponentName);
        else
          localResponse.send(
            localRequest.body.uiBlockName
              .toString()
              .replace('"', "")
              .toString()
              .replace('"', "")
          );
      });
    }
  });
});

app.get("/createuiblock", (req, res) => {
  console.log("createuiblock");
  let UIBlockName = req.query.uiBlockName;
  var blockNameFromDb;
  var globalRes = res;
  fetch({
    query:
      "query getLatestComponent($compName:String){getLatestComponent(componentName:$compName){componentName isGridPresent developerLayout actualLayout}}",
    variables: {
      compName: UIBlockName,
      gridPres: localRequest.body.gridPresence,
    },
  }).then((res) => {
    blockNameFromDb = res.data.getLatestComponent[0].componentName;
    isGridDisplayed = res.data.getLatestComponent[0].isGridPresent;
    developerLayout = res.data.getLatestComponent[0].developerLayout;
    actualLayout = res.data.getLatestComponent[0].actualLayout;
    isGridDisplayed = JSON.parse(isGridDisplayed);
    console.log("GRID PRESENCE");
    console.log(isGridDisplayed);
    console.log(res.data.getLatestComponent[0].isGridPresent);
    globalRes.render("uiblock", {
      blockName: blockNameFromDb,
      gridDisplayed: isGridDisplayed,
      actualLayout: actualLayout,
      developerLayout: developerLayout,
    });
  });
});

app.post("/manipulateState", async (req, res) => {
  var componentFile =
    __dirname + "\\public\\reactStarter\\client\\src\\BaseComponent.js";
  var typesFile =
    __dirname + "\\public\\reactStarter\\client\\src\\actions\\types.js";
  var reducerFile =
    __dirname + "\\public\\reactStarter\\client\\src\\reducer\\allReducer.js";
  var actionsFile =
    __dirname + "\\public\\reactStarter\\client\\src\\actions\\allActions.js";
  var stateVariableNode;
  var responseStateVariableNode;
  var stateVariabledataType;
  var sampleValueForStateVariable;
  var localResponse = res;
  localRequest = req;
  var customKey = req.body.customKey;
  var SourceJson = req.body.SourceJson;
  var stateVariableName = JSON.parse(req.body.stateVariableName);
  var SelectedNodePath = req.body.SelectedNodePath;
  var codeSnippet = JSON.parse(req.body.codeSnippet);
  var jsonType = req.body.jsonType;
  var apiName = stateVariableName.split("_")[0];
  console.log(apiName);
  console.log("-----------------------");
  console.log(codeSnippet);
  console.log("-----------------------");
  console.log(jsonType);
  console.log("SelectedNodePath");
  console.log(SelectedNodePath);
  console.log(SelectedNodePath.length);
  if (SelectedNodePath !== "null") {
    var selectedNodeValue = jp.query(
      JSON.parse(SourceJson),
      JSON.parse(SelectedNodePath)
    );
    var nodes = jp.apply(
      JSON.parse(SourceJson),
      JSON.parse(SelectedNodePath),
      function (value) {
        var obj = {};
        obj.nodes = typeof value;
        obj.keys = Object.keys(value);
        return obj;
      }
    );

    console.log(nodes[0].value.nodes);
    if (nodes[0].value.nodes == "string") {
      stateVariabledataType = "string";
      stateVariableNode = stateVariableName + ":" + "''";
      responseStateVariableNode = stateVariableName + "_State" + ":" + "''";
      sampleValueForStateVariable = selectedNodeValue[0];
      try {
        JSON.parse(selectedNodeValue[0]);
        stateVariableNode = stateVariableName + ":" + "{}";
        responseStateVariableNode = stateVariableName + "_State" + ":" + "{}";
        sampleValueForStateVariable = JSON.parse(selectedNodeValue[0]);
      } catch (e) {}
    } else if (nodes[0].value.nodes == "object") {
      if (nodes[0].value.keys[0] == "0") {
        //ARRAY TYPE
        stateVariabledataType = "array";
        stateVariableNode = stateVariableName + ":" + "[]";
        responseStateVariableNode = stateVariableName + "_State" + ":" + "[]";
        sampleValueForStateVariable = selectedNodeValue[0][0];
      } else if (nodes[0].value.keys[0] != "0") {
        //JSON OBJECT TYPE
        stateVariabledataType = "object";
        stateVariableNode = stateVariableName + ":" + "{}";
        responseStateVariableNode = stateVariableName + "_State" + ":" + "{}";
        sampleValueForStateVariable = selectedNodeValue[0];
      }
    } else if (nodes[0].value.nodes == "number") {
      stateVariabledataType = "number";
      stateVariableNode = stateVariableName + ": 0";
      responseStateVariableNode = stateVariableName + "_State" + ": 0";
      sampleValueForStateVariable = selectedNodeValue[0];
    }
    console.log(stateVariableName);
    console.log(stateVariableNode);
    console.log(responseStateVariableNode);
    console.log(sampleValueForStateVariable);
  }

  //DATA INITIALIZATION SECTION FOR CODE GENERATION
  var actionMethod = "actionFunctionFor_" + apiName;
  var typeName = "typeFor_" + apiName;
  var additionalCodeSnippet =
    "dispatch({ type: " + typeName + ", payload: result });";
  codeSnippet = codeSnippet.replace("response.text()", "response.json()");
  codeSnippet = codeSnippet.replace(
    "console.log(result)",
    "{console.log(result);return result}"
  );
  codeSnippet = codeSnippet.replace("fetch", "var result = await fetch");
  codeSnippet = codeSnippet.replace("var raw = '';", "var raw;");
  codeSnippet = codeSnippet + additionalCodeSnippet;
  console.log(codeSnippet);
  var typeNameExport =
    "export const typeFor_" + apiName + ' = ""typeFor_"' + apiName + '"""';
  var importForActionFile = "import { " + typeName + ' } from ""./types"";';
  //REDUCER CODE GENERATION
  var importForReducerFile =
    "import { " + typeName + ' } from ""../actions/types"";';
  var reducerCase =
    "case " +
    typeName +
    ":return { ...state, " +
    stateVariableName +
    ": action.payload };";
  var mapStateToPropsVariable =
    stateVariableName + " : state.data." + stateVariableName;

  var actionFunctionImplementation =
    "export const " +
    actionMethod +
    " = (valueGot) => async (dispatch) => {" +
    codeSnippet +
    "};";
  var selectedNodePathNew = SelectedNodePath.replace("$", "");
  var updateOfPropsCode =
    "if(newProps." +
    stateVariableName +
    "){console.log(newProps." +
    stateVariableName +
    selectedNodePathNew +
    ");this.setState({" +
    stateVariableName +
    "_State:newProps." +
    stateVariableName +
    selectedNodePathNew +
    "});}";
  console.log(actionFunctionImplementation);
  console.log("jsonType");
  console.log(jsonType);
  /*var componentFileReader = new LineByLineReader(componentFile);
  var typesFileReader = new LineByLineReader(typesFile);
  var reducerFileReader = new LineByLineReader(reducerFile);
  var actionsFileReader = new LineByLineReader(actionsFile);*/
  console.log(jsonType);
  console.log(stateVariableName);
  console.log(stateVariabledataType);
  console.log(apiName);
  console.log(sampleValueForStateVariable);
  console.log(stateVariableNode);
  fetch({
    query:
      "mutation addNewStateVariable($StateVariableName:String, $StateVariableType:String, $StateVariableDataType:String, $apiName:String, $sampleValueForStateVariable:String, $stateVariableNode:String, $actionFunction:String){addNewStateVariable(StateVariableName:$StateVariableName, StateVariableType:$StateVariableType, StateVariableDataType:$StateVariableDataType, apiName:$apiName, sampleValueForStateVariable:$sampleValueForStateVariable,stateVariableNode:$stateVariableNode, actionFunction:$actionFunction){StateVariableName StateVariableType StateVariableDataType apiName sampleValueForStateVariable stateVariableNode actionFunction}}",
    variables: {
      StateVariableName:
        jsonType == "response"
          ? stateVariableName + "_State"
          : stateVariableName,
      StateVariableType: jsonType,
      StateVariableDataType: stateVariabledataType,
      apiName: apiName,
      sampleValueForStateVariable: JSON.stringify(sampleValueForStateVariable),
      stateVariableNode: stateVariableNode,
      actionFunction:
        "this.props." +
        actionMethod +
        "(this.state." +
        stateVariableName +
        ");",
    },
  }).then((res) => {
    console.log(res);
    if (jsonType == "request") {
      //StateVariableName==stateVariableName
      //StateVariableType==request
      //StateVariableDataType==stateVariabledataType
      //apiName==apiName
      //sampleValueForStateVariable==sampleValueForStateVariable
      //stateVariableNode=stateVariableNode
      //ADDITIONS IN THE COMPONENT FILE [REQUEST]

      insertRequiredLine(
        componentFile,
        actionMethod + ",",
        "//ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_IMPORT",
        "//END_OF_ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_IMPORT",
        ""
      ).then(function () {
        insertRequiredLine(
          componentFile,
          actionMethod + ",",
          "//ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_ACTION_FUNCTION",
          "//END_OF_ADD_NEW_ACTION_FUNCTIONS_FROM_HERE_ACTION_FUNCTION",
          ""
        ).then(function () {
          if (SelectedNodePath !== "null") {
            insertRequiredLine(
              componentFile,
              stateVariableNode + ",",
              "//ADD_NEW_REQUEST_STATE_VARIABLE_FROM_HERE",
              "//END_OF_ADD_NEW_REQUEST_STATE_VARIABLE_FROM_HERE",
              ""
            ).then(function () {
              insertRequiredLine(
                componentFile,
                "this.props." +
                  actionMethod +
                  "(this.state." +
                  stateVariableName +
                  ")" +
                  ";",
                "//ADD_NEW_ACTION_METHODS_FOR_COMPONENTDIDMOUNT",
                "//END_OF_ADD_NEW_ACTION_METHODS_FOR_COMPONENTDIDMOUNT",
                ""
              );
            });
          } else if (SelectedNodePath === "null") {
            insertRequiredLine(
              componentFile,
              "this.props." + actionMethod + "()" + ";",
              "//ADD_NEW_ACTION_METHODS_FOR_COMPONENTDIDMOUNT",
              "//END_OF_ADD_NEW_ACTION_METHODS_FOR_COMPONENTDIDMOUNT",
              ""
            );
          }
        });
      });

      //TYPES FILE
      insertRequiredLine(
        typesFile,
        typeNameExport + ";",
        "//ADD_NEW_TYPES_FROM_HERE",
        "//END_OF_ADD_NEW_TYPES_FROM_HERE",
        typeName
      ).then(function () {
        //ACTIONS FILE
        insertRequiredLine(
          actionsFile,
          importForActionFile + "",
          "//ADD_NEW_IMPORTS_FOR_ACTIONS_FROM_HERE",
          "//END_OF_ADD_NEW_IMPORTS_FOR_ACTIONS_FROM_HERE",
          typeName
        ).then(function () {
          insertRequiredLine(
            actionsFile,
            actionFunctionImplementation,
            "//ADD_NEW_ACTIONS_FROM_HERE",
            "//END_OF_ADD_NEW_ACTIONS_FROM_HERE",
            ""
          );
        });
      });
    } else if (jsonType == "response") {
      //StateVariableName==stateVariableName+ "_State"
      //StateVariableType==response
      //StateVariableDataType==stateVariabledataType
      //apiName==apiName
      //sampleValueForStateVariable==sampleValueForStateVariable
      //stateVariableNode=stateVariableNode

      //REDUCER
      insertRequiredLine(
        reducerFile,
        importForReducerFile,
        "//ADD_NEW_IMPORTS_FOR_REDUCER_FROM_HERE",
        "//END_OF_ADD_NEW_IMPORTS_FOR_REDUCER_FROM_HERE",
        typeName
      ).then(function () {
        insertRequiredLine(
          reducerFile,
          reducerCase,
          "//ADD_NEW_CASES_FROM_HERE",
          "//END_OF_ADD_NEW_CASES_FROM_HERE",
          ""
        )
          .then(function () {
            insertRequiredLine(
              reducerFile,
              stateVariableNode + ",",
              "//ADD_NEW_RESPONSE_STATE_FROM_HERE",
              "//END_OF_ADD_NEW_RESPONSE_STATE_FROM_HERE",
              ""
            );
          })
          .then(function () {
            insertRequiredLine(
              componentFile,
              stateVariableName + ",",
              "//ADD_NEW_RESPONSE_STATE_VARIABLE_HERE",
              "//END_OF_ADD_NEW_RESPONSE_STATE_VARIABLE_HERE",
              ""
            ).then(function () {
              insertRequiredLine(
                componentFile,
                mapStateToPropsVariable + ",",
                "//ADD_NEW_RESPONSE_STATE_VARIABLE_HERE_FOR_MAP_STATE_TO_PROPS",
                "//END_OF_ADD_NEW_RESPONSE_STATE_VARIABLE_HERE_FOR_MAP_STATE_TO_PROPS",
                ""
              ).then(function () {
                insertRequiredLine(
                  componentFile,
                  responseStateVariableNode + ",",
                  "//ADD_NEW_PROPS_STATE_VARIABLE_FROM_HERE",
                  "//END_OF_ADD_NEW_PROPS_STATE_VARIABLE_FROM_HERE",
                  ""
                ).then(function () {
                  insertRequiredLine(
                    componentFile,
                    updateOfPropsCode + ";",
                    "//UPDATE_OF_PROPS",
                    "//END_OF_UPDATE_OF_PROPS",
                    ""
                  );
                });
              });
            });
          });
      });

      //COMPONENT FILE
    }
    localResponse.send(stateVariableNode);
  });
});

app.listen(port, function () {
  console.log("App Started..");
});

function insertRequiredLine(
  fileName,
  lineToBeInserted,
  startingString,
  endingString,
  typeName
) {
  return new Promise((resolve) => {
    setTimeout(() => {
      var flag = true;
      cmd.get(
        "java -jar lineExtractor.jar " +
          fileName +
          " " +
          startingString +
          " " +
          endingString,
        function (err, data, stderr) {
          data = data.split("\n");
          console.log(data);
          console.log(lineToBeInserted);
          console.log(data.includes(lineToBeInserted));
          console.log(!data.includes(lineToBeInserted));
          if (typeName.length > 0) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].includes(typeName)) {
                flag = false;
              }
            }
          }

          if (!data.includes(lineToBeInserted + "\r") && flag == true) {
            cmd.get(
              "java -jar fileLineWriter.jar " +
                fileName +
                " " +
                endingString +
                ' "' +
                lineToBeInserted +
                '"',
              function (err, data, stderr) {}
            );
          }
        }
      );
      resolve();
    }, 100);
  });
}
