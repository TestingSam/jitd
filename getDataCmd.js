var cmd=require('node-cmd');
const writeJsonFile = require('write-json-file');
var jsonSchemaGenerator = require('json-schema-generator');
const jsonfile = require('jsonfile');
const file = './public/output.json';
const fileRequest = './public/outputRequest.json';
const file2 = './public/codeSnippet.json';
const responseSchema=[];
const requestSchema=[];
var apiName=[];
var actualType=[];
var actualApi=[];
var actualApiUrl=[];
var apiDataJson={};
var apiCollection=[];
 cmd.get(
        'node getData.js '+process.argv.slice(2)[0],
        function(err, data, stderr){
			var apiData=data.split("┌───────────")[0].replace("newman", "");
			for(var i=0;i<apiData.split("\n").length;i++)
			{
				if(apiData.split("\n")[i].indexOf("→")>-1)
				{
					apiName.push(apiData.split("\n")[i].replace("→", "").trim());
				}
				else if(apiData.split("\n")[i].indexOf("https")>-1)
				{
					actualApi.push(apiData.split("\n")[i].trim());
				}
			}
			for(var i=0;i<actualApi.length;i++){
				actualType.push(actualApi[i].split(" ")[0].split("?")[0]);
				actualApiUrl.push(actualApi[i].split(" ")[1].split("?")[0]);
			}
			apiDataJson.apiName=apiName;
			apiDataJson.actualType=actualType;
			apiDataJson.actualApiUrl=actualApiUrl;
			var responses=jsonfile.readFileSync(file);
			for(var i=0;i<responses.length;i++)
			{
				schemaObj = jsonSchemaGenerator(responses[i]);
				responseSchema.push(schemaObj);
			}
			var requests=jsonfile.readFileSync(fileRequest);
			for(var i=0;i<requests.length;i++)
			{
				schemaObjReq = jsonSchemaGenerator(requests[i]);
				requestSchema.push(schemaObjReq);
			}
			apiDataJson.responseSchema=responseSchema;
			apiDataJson.requestSchema=requestSchema;
			for(var i=0;i<apiName.length;i++)
			{
				var dataTemp={};
				dataTemp.id=i;
				dataTemp.apiType=actualType[i];
				dataTemp.apiName=apiName[i];
				dataTemp.apiUrl=actualApiUrl[i];
				dataTemp.apiReponseSchema=responseSchema[i];
				dataTemp.apiRequestSchema=requestSchema[i];
				apiCollection.push(dataTemp);
			}
			 cmd.get(
				'node script.js '+process.argv.slice(2)[0],
				function(err, data, stderr){
						var codeSnippetresponses=jsonfile.readFileSync(file2);
						for(var j=0;j<codeSnippetresponses.length;j++)
						{
							apiCollection[j].request=codeSnippetresponses[j].request;
							apiCollection[j].codeSnippet=codeSnippetresponses[j].codeSnippet;
							apiCollection[j].response=codeSnippetresponses[j].response;
						}
						(async () => {
							await writeJsonFile('./public/apiDataForUI.json', apiCollection);
						})();
				}
			);

			/*(async () => {
				await writeJsonFile('./public/outputSchema.json', responseSchema);
			})();*/
        }
    );
