var newman = require('newman'); // run npm install newman in the same folder as this script
const writeJsonFile = require('write-json-file');
var GenerateSchema = require('generate-schema');
var data=[];
var dataRequest=[];
newman.run({
	collection: require(process.argv.slice(2)[0]),
    reporters: 'cli',
}, function (err, summary) {
    err && console.error(err);
	var allApiData=[];
    summary.run.executions.forEach(function (execution) {
		dataRequest.push(execution.request);
		data.push(execution.response.json());
    });
	(async () => {
		await writeJsonFile('./public/output.json', data);
		await writeJsonFile('./public/outputRequest.json', dataRequest);
	})();
});
