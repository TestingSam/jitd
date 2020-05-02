var allRequest=[];
var fs = require('fs');
var Collection = require('postman-collection').Collection;
var codegen = require('postman-code-generators');
var sdk = require('postman-collection');
const writeJsonFile = require('write-json-file');
var newman = require('newman'); // run npm install newman in the same folder as this script
var GenerateSchema = require('generate-schema');
var myCollection;
var request;
var dataResponses=[];
newman.run({
	collection: require(process.argv.slice(2)[0]),
    reporters: 'cli',
}, function (err, summary) {
    err && console.error(err);
    summary.run.executions.forEach(function (execution) {
		dataResponses.push(execution.response.json());
    });
	myCollection = new Collection(JSON.parse(fs.readFileSync(process.argv.slice(2)[0]).toString()));
	myCollection.toJSON().item.map(eachItem=>{
		request = new sdk.Request(eachItem.request);
		var language = 'javascript';
		var variant = 'fetch';
		var options = {
				indentCount: 3,
				indentType: 'Space',
				trimRequestBody: true,
				followRedirect: true
			};
		codegen.convert(language, variant, request, options, function(error, snippet) {
			var data={};
			if (error) {
			}
			data.request=eachItem.request;
			data.codeSnippet=(findAndReplace(snippet.split("\n").join(""),"\"", "'")).replace(/\\\\/g, '\\')
			allRequest.push(data);
		});
	});
	for(var i=0;i<allRequest.length;i++)
	{
		allRequest[i].response=dataResponses[i];
	}
	(async () => {
		await writeJsonFile('./public/codeSnippet.json', allRequest);
	})();
});

function findAndReplace(string, target, replacement) {
 var i = 0, length = string.length;
 for (i; i < length; i++) {
   string = string.replace(target, replacement);
 }
 return string;
}


