var allRequest=[];
var fs = require('fs');
var Collection = require('postman-collection').Collection;
var codegen = require('postman-code-generators');
var sdk = require('postman-collection');
const writeJsonFile = require('write-json-file');
var myCollection;
var request;
myCollection = new Collection(JSON.parse(fs.readFileSync('myCollection_2_.postman_collection.json').toString()));
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
		data.codeSnippet=(findAndReplace(snippet.split("\n").join(""),"\"", "'")).replace(/\\\\/g, '\\')
		allRequest.push(data);
	});
});
(async () => {
	await writeJsonFile('./public/codeSnippet.json', allRequest);
})();

function findAndReplace(string, target, replacement) {
 var i = 0, length = string.length;
 for (i; i < length; i++) {
   string = string.replace(target, replacement);
 }
 return string;
}


