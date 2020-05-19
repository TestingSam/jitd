const graphql = require("graphql");
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} = require("graphql-iso-date");
const componentNameSchema = require("../model/ComponentName");
const ApiRouteListSchema = require("../model/ApiRouteList");
const AppSchemaContentSchema = require("../model/AppSchemaContents");
const AvailableColumnSchema = require("../model/AvailableColumns");
const ApiSchemaCollectionSchema = require("../model/ApiSchemaCollection");
const ReduxSchema = require("../model/reduxSchema");
const StateVariableSchema = require("../model/StateVariables");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const ComponentNameType = new GraphQLObjectType({
  name: "componentName",
  description: "component Name Info..",
  fields: () => ({
    componentName: { type: GraphQLString },
    user: { type: GraphQLString },
    time: { type: GraphQLDate },
    isGridPresent: { type: GraphQLString },
    developerLayout: { type: GraphQLString },
    actualLayout: { type: GraphQLString },
  }),
});

const StateVariableSchemaType = new GraphQLObjectType({
  name: "stateVariablescollection",
  description: "stateVariables collection...",
  fields: () => ({
    StateVariableName: { type: GraphQLString },
    StateVariableType: { type: GraphQLString },
    StateVariableDataType: { type: GraphQLString },
    apiName: { type: GraphQLString },
    sampleValueForStateVariable: { type: GraphQLString },
    stateVariableNode: { type: GraphQLString },
    actionFunction: { type: GraphQLString },
  }),
});

const reduxSchemaType = new GraphQLObjectType({
  name: "reduxSchemaType",
  description: "redux data Info..",
  fields: () => ({
    typesVariable: { type: GraphQLString },
    actionFunction: { type: GraphQLString },
    actionsImport: { type: GraphQLString },
    reducerImport: { type: GraphQLString },
    reducerInitialState: { type: GraphQLString },
    reducerCase: { type: GraphQLString },
    component: { type: GraphQLString },
    HtmlNodes: { type: new GraphQLList(GraphQLString) },
  }),
});

const AvailableColumnType = new GraphQLObjectType({
  name: "availableColumn",
  description: "columns info..",
  fields: () => ({
    columnName: { type: GraphQLString },
    columnTypes: { type: GraphQLString },
  }),
});

const ApiSchemaCollectionType = new GraphQLObjectType({
  name: "ApiSchemaCollection",
  description: "ApiSchemaCollection info..",
  fields: () => ({
    elementKey: { type: GraphQLString },
    componentName: { type: GraphQLString },
    apiName: { type: GraphQLString },
    schemaName: { type: GraphQLString },
    apiType: { type: GraphQLString },
    event: { type: GraphQLString },
    eventAttributeValue: { type: GraphQLString },
    eventFunction: { type: GraphQLString },
    data_Variable: { type: GraphQLString },
    mapStateToProps: { type: GraphQLString },
    imports: { type: GraphQLString },
    stateVariable: { type: GraphQLString },
  }),
});

const ApiRouteListType = new GraphQLObjectType({
  name: "ApiRouteName",
  description: "ApiRout Name Info..",
  fields: () => ({
    apiName: { type: GraphQLString },
    user: { type: GraphQLString },
    apiType: { type: GraphQLString },
    apiReponseSchema: { type: GraphQLString },
    apiRequestSchema: { type: GraphQLString },
    request: { type: GraphQLString },
    codeSnippet: { type: GraphQLString },
    response: { type: GraphQLString },
  }),
});

const AppSchemaContentSchemaType = new GraphQLObjectType({
  name: "ApiSchemaName",
  description: "ApiSchema Name Info..",
  fields: () => ({
    schemaName: { type: GraphQLString },
    columnName: { type: new GraphQLList(GraphQLString) },
    columnTypes: { type: new GraphQLList(GraphQLString) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    getLatestComponent: {
      type: new GraphQLList(ComponentNameType),
      args: { componentName: { type: GraphQLString } },
      resolve(parent, args) {
        return componentNameSchema
          .find({ componentName: args.componentName })
          .sort({ time: -1 })
          .limit(1);
      },
    },
    getApiRouteList: {
      type: new GraphQLList(ApiRouteListType),
      args: { apiType: { type: GraphQLString } },
      resolve(parent, args) {
        return ApiRouteListSchema.find({ apiType: args.apiType }).sort({
          time: -1,
        });
      },
    },
    getApiData: {
      type: new GraphQLList(ApiRouteListType),
      args: { apiName: { type: GraphQLString } },
      resolve(parent, args) {
        return ApiRouteListSchema.find({ apiName: args.apiName }).sort({
          time: -1,
        });
      },
    },
    getColumns: {
      type: new GraphQLList(AvailableColumnType),
      resolve(parent, args) {
        return AvailableColumnSchema.find().sort({
          time: -1,
        });
      },
    },
    getColumnType: {
      type: AvailableColumnType,
      args: { columnName: { type: GraphQLString } },
      resolve(parent, args) {
        return AvailableColumnSchema.findOne({
          columnName: args.columnName,
        }).sort({
          time: -1,
        });
      },
    },
    checkForComponent: {
      type: ComponentNameType,
      args: { componentName: { type: GraphQLString } },
      resolve(parent, args) {
        return componentNameSchema.findOne({
          componentName: args.componentName,
        });
      },
    },
    getSchemaFromApiName: {
      type: ApiSchemaCollectionType,
      args: { apiName: { type: GraphQLString } },
      resolve(parent, args) {
        return ApiSchemaCollectionSchema.findOne({
          apiName: args.apiName,
        });
      },
    },
    getApiNameFromSchema: {
      type: ApiSchemaCollectionType,
      args: { schemaName: { type: GraphQLString } },
      resolve(parent, args) {
        return ApiSchemaCollectionSchema.findOne({
          schemaName: args.schemaName,
        });
      },
    },
    getAllSchemas: {
      type: new GraphQLList(AppSchemaContentSchemaType),
      resolve(parent, args) {
        return AppSchemaContentSchema.find().sort({
          time: -1,
        });
      },
    },
    getReduxEntry: {
      type: reduxSchemaType,
      args: { typesVariable: { type: GraphQLString } },
      resolve(parent, args) {
        return ReduxSchema.findOne({
          typesVariable: args.typesVariable,
        });
      },
    },
    getResponseStateVariables: {
      type: new GraphQLList(StateVariableSchemaType),
      resolve(parent, args) {
        return StateVariableSchema.find({ StateVariableType: "response" }).sort(
          {
            time: -1,
          }
        );
      },
    },
    getRequestStateVariables: {
      type: new GraphQLList(StateVariableSchemaType),
      resolve(parent, args) {
        return StateVariableSchema.find({ StateVariableType: "request" }).sort({
          time: -1,
        });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    newComponentName: {
      type: ComponentNameType,
      args: {
        componentName: { type: GraphQLString },
        user: { type: GraphQLString },
        time: { type: GraphQLDate },
        isGridPresent: { type: GraphQLString },
        developerLayout: { type: GraphQLString },
        actualLayout: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.componentName != false) {
          let newComponentName = new componentNameSchema({
            componentName: args.componentName,
            user: args.user,
            time: new Date(),
            isGridPresent: args.isGridPresent,
            developerLayout: args.developerLayout,
            actualLayout: args.actualLayout,
          });

          return newComponentName.save();
        } else {
          return "Enter User Name";
        }
      },
    },
    addNewStateVariable: {
      type: StateVariableSchemaType,
      args: {
        StateVariableName: { type: GraphQLString },
        StateVariableType: { type: GraphQLString },
        StateVariableDataType: { type: GraphQLString },
        apiName: { type: GraphQLString },
        sampleValueForStateVariable: { type: GraphQLString },
        stateVariableNode: { type: GraphQLString },
        actionFunction: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.StateVariableName != false) {
          let newStateVariable = new StateVariableSchema({
            StateVariableName: args.StateVariableName,
            StateVariableType: args.StateVariableType,
            StateVariableDataType: args.StateVariableDataType,
            apiName: args.apiName,
            sampleValueForStateVariable: args.sampleValueForStateVariable,
            stateVariableNode: args.stateVariableNode,
            actionFunction: args.actionFunction,
          });

          return newStateVariable.save();
        } else {
          return "Enter User Name";
        }
      },
    },
    addNewReduxEntry: {
      type: reduxSchemaType,
      args: {
        typesVariable: { type: GraphQLString },
        actionFunction: { type: GraphQLString },
        actionsImport: { type: GraphQLString },
        reducerImport: { type: GraphQLString },
        reducerInitialState: { type: GraphQLString },
        reducerCase: { type: GraphQLString },
        component: { type: GraphQLString },
        HtmlNodes: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        if (args.typesVariable != false) {
          let newReduxEntry = new ReduxSchema({
            typesVariable: args.typesVariable,
            actionFunction: args.actionFunction,
            actionsImport: args.actionsImport,
            reducerImport: args.reducerImport,
            reducerInitialState: args.reducerInitialState,
            reducerCase: args.reducerCase,
            component: args.component,
            HtmlNodes: args.HtmlNodes,
          });

          return newReduxEntry.save();
        } else {
          return "Enter redux entry";
        }
      },
    },
    addNewApiRouteList: {
      type: ApiRouteListType,
      args: {
        apiName: { type: GraphQLString },
        user: { type: GraphQLString },
        apiType: { type: GraphQLString },
        apiReponseSchema: { type: GraphQLString },
        apiRequestSchema: { type: GraphQLString },
        request: { type: GraphQLString },
        codeSnippet: { type: GraphQLString },
        response: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.apiName != false) {
          let newApiRouteList = new ApiRouteListSchema({
            apiName: args.apiName,
            user: args.user,
            apiType: args.apiType,
            apiReponseSchema: args.apiReponseSchema,
            apiRequestSchema: args.apiRequestSchema,
            request: args.request,
            codeSnippet: args.codeSnippet,
            response: args.response,
          });

          return newApiRouteList.save();
        } else {
          return "Enter Api Name";
        }
      },
    },
    addAPISchemaCollectionList: {
      type: ApiSchemaCollectionType,
      args: {
        elementKey: { type: GraphQLString },
        componentName: { type: GraphQLString },
        apiName: { type: GraphQLString },
        schemaName: { type: GraphQLString },
        apiType: { type: GraphQLString },
        event: { type: GraphQLString },
        eventAttributeValue: { type: GraphQLString },
        eventFunction: { type: GraphQLString },
        data_Variable: { type: GraphQLString },
        mapStateToProps: { type: GraphQLString },
        imports: { type: GraphQLString },
        stateVariable: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.apiName != false) {
          let newApiCollectionList = new ApiSchemaCollectionSchema({
            elementKey: args.elementKey,
            componentName: args.componentName,
            apiName: args.apiName,
            schemaName: args.schemaName,
            apiType: args.apiType,
            event: args.event,
            eventAttributeValue: args.eventAttributeValue,
            eventFunction: args.eventFunction,
            data_Variable: args.data_Variable,
            mapStateToProps: args.mapStateToProps,
            imports: args.imports,
            stateVariable: args.stateVariable,
          });

          return newApiCollectionList.save();
        } else {
          return "Enter Api Name";
        }
      },
    },
    addNewColumn: {
      type: AvailableColumnType,
      args: {
        columnName: { type: GraphQLString },
        columnTypes: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.columnName != false) {
          let newColumn = new AvailableColumnSchema({
            columnName: args.columnName,
            columnTypes: args.columnTypes,
          });

          return newColumn.save();
        } else {
          return "Enter column Name";
        }
      },
    },
    addNewSchema: {
      type: AppSchemaContentSchemaType,
      args: {
        schemaName: { type: GraphQLString },
        columnName: { type: new GraphQLList(GraphQLString) },
        columnTypes: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        let newSchema = new AppSchemaContentSchema({
          schemaName: args.schemaName,
          columnName: args.columnName,
          columnTypes: args.columnTypes,
        });

        return newSchema.save();
      },
    },
    updateComponent: {
      type: ComponentNameType,
      args: {
        componentName: { type: GraphQLString },
        isGridPresent: { type: GraphQLString },
        developerLayout: { type: GraphQLString },
        actualLayout: { type: GraphQLString },
      },
      resolve(parent, args) {
        return componentNameSchema.findOneAndUpdate(
          {
            componentName: args.componentName,
          },
          {
            isGridPresent: args.isGridPresent,
            developerLayout: args.developerLayout,
            actualLayout: args.actualLayout,
          },
          { new: true }
        );
      },
    },
    updateReduxEntry: {
      type: reduxSchemaType,
      args: {
        typesVariable: { type: GraphQLString },
        HtmlNodes: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        return ReduxSchema.findOneAndUpdate(
          {
            typesVariable: args.typesVariable,
          },
          { $push: { HtmlNodes: args.HtmlNodes } },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
