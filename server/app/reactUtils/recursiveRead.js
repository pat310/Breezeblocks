var fs = require('fs-extra');
var path = require('path');
var Promise = require('bluebird');

var arr = [];
module.exports = function(userId, buildId, projectName){
	var baseFilePath = path.join(__dirname, "UserBuilds", userId, buildId);

	projectName = projectName || 'reactNative';

	function recursiveRead(filePath){
		var files = fs.readdirSync(filePath);
		files.forEach(function(file){
			var newFilePath = path.join(filePath, file);
			var stat = fs.statSync(newFilePath);
			if(stat.isDirectory()){
				if(file !== 'node_modules') recursiveRead(newFilePath);	
			} 
			else arr.push(newFilePath);
		});
		return arr;
	}
	
	var filesToRead = recursiveRead(baseFilePath);

	var promiseArr = [];

	filesToRead.forEach(function(filePath){
		promiseArr.push(new Promise(function(resolve, reject){
			fs.readFile(filePath, function(err, data){
				if(err) reject(err);
				else resolve(data.toString());
			});
		}));
	});

	var fileObject = {};
	return Promise.each(promiseArr, function(fileContent){
		return fileContent;
	})
	.then(function(fileContent){
		for(var i = 0; i<fileContent.length; i++){
			var virtualFilePath = projectName + filesToRead[i].slice(baseFilePath.length);
			fileObject[virtualFilePath] = fileContent[i];
		}
		return fileObject;
	});
};