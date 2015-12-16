var Handlebars = require('handlebars');
var ChangeCase = require('change-case');
var path = require('path');
var fs = require('fs-extra');
var archiver = require('archiver');
var handlebarHelpers = require('./handlebarHelpers')();
var multipageGenerator = require('./multipageGenerator.js');

Handlebars.registerPartial({
	Image: fs.readFileSync(path.join(__dirname, '/partials/ImagePartial.hbs')).toString(),
	Text: fs.readFileSync(path.join(__dirname, '/partials/TextPartial.hbs')).toString(),
	MapView: fs.readFileSync(path.join(__dirname, '/partials/MapViewPartial.hbs')).toString(),
	ScrollView: fs.readFileSync(path.join(__dirname, '/partials/ScrollViewPartial.hbs')).toString(),
	SwitchIOS: fs.readFileSync(path.join(__dirname, '/partials/SwitchPartial.hbs')).toString(),
	SliderIOS: fs.readFileSync(path.join(__dirname, '/partials/SliderPartial.hbs')).toString(),
	ListView: fs.readFileSync(path.join(__dirname, '/partials/ListViewPartial.hbs')).toString(),
	Navbar: fs.readFileSync(path.join(__dirname, '/partials/NavbarPartial.hbs')).toString(),
});


var templatePath = path.join(__dirname, 'template.hbs');
var reactNativePath = path.join(__dirname, '../../../reactNative');

function removeFlexGrow(styleData){
	var newStyleData = {};
	for(var keys in styleData){
		newStyleData[keys] = {};
		for(var key in styleData[keys]){
			if(key === 'flex-grow'){
				delete styleData[keys][key];
			}
			else if(key === "flex-grow-width"){
				newStyleData[keys]['width'] = (styleData[keys][key] / 100) * 375;
			}else{
				newStyleData[keys][key] = styleData[keys][key];
			}
		}
	}
	return newStyleData;
}


module.exports = function(pages, userId, buildId) {
		pages = pages.map(function(page){
			page.title = ChangeCase.pascalCase(page.title);
			return page;
		});
		var globalStyle;
		var tabBarData;
		var tabBarStyleData;
		var title = [];

		var newProjectDir = path.join(__dirname, 'UserBuilds', userId, buildId);
		var userZipDirectory = path.join(__dirname, 'UserBuilds', userId, 'target.zip');


		return new Promise(function(resolve, reject) {
				fs.copy(reactNativePath, newProjectDir, function(err) {
					if (err) reject(err);
					else resolve(newProjectDir);
				});
			})
			.then(function() {
				return new Promise(function(resolve, reject) {
					fs.readFile(templatePath, function(err, data) {
						if (err) reject(err);
						else {
							resolve(data.toString());
						}
					});
				});
			})
			.then(function(templateFile) {				
				var createTemplate = Handlebars.compile(templateFile);

				var templateArr = [];
				var bool = false;
				pages.forEach(function(page, index){					
					var data = page.html;
					var styleData = page.css;
					if(pages.length > 1) title.push(page.title + ".js");
					else title = ["index.ios.js"];

					styleData = removeFlexGrow(styleData);

					data = data.filter(function(htmlElement){
						if(htmlElement.children && htmlElement.children.length>0){						
							if(htmlElement.children[0].type === "TabBarIOS" && index === 0){
								tabBarData = htmlElement;
								if(pages.length === 1){
									title = [ChangeCase.pascalCase(page.title) + ".js"];
									bool = true;
								}
								for(var key in styleData){
									if(key.match(/tabbarios/)){
										for(var childKey in styleData[key]){
											if(childKey === "width") delete styleData[key][childKey];
										}
									}
								}
								tabBarStyleData = styleData;
							}
							return htmlElement.children[0].type !== "TabBarIOS"; 
						}else return false;
					});

					data.forEach(function(htmlElement){
						var parent = htmlElement.className[1];
						var parKeys = [];
						var parentHeight = false;
						if(htmlElement.children.length>1){
							if(!styleData[parent]) styleData[parent] = {};
							styleData[parent]['flexDirection'] = 'row';
						}
						if(styleData[parent]){
							parKeys = Object.keys(styleData[parent]);
							if(parKeys.indexOf('height') !== -1){
								parentHeight = styleData[parent]['height'];
								delete styleData[parent]['height'];
							}
						}
						htmlElement.children.forEach(function(component){
							if(parentHeight) styleData[component.className[1]]['height'] = parentHeight;
							if(component.type === "Image"){
								var compKeys = Object.keys(styleData[component.className[1]]);
								if(compKeys.indexOf('width') === -1){
									if(parKeys.indexOf('width') === -1) styleData[component.className[1]]['width'] = 375;
									else styleData[component.className[1]]['width'] = styleData[parent].width;
								}

								if(compKeys.indexOf('height') === -1){
									if(parKeys.indexOf('height') === -1) styleData[component.className[1]]['height'] = 200;
									else styleData[component.className[1]]['height'] = styleData[parent].height;
								}				
							}
						});
					});

					globalStyle = styleData;

					templateArr.push(createTemplate({
						tree: data,
						styleTree: styleData,
						pages: pages,
						bool: bool,
						globalStyle: globalStyle
					}));
					
				});

				var promiseArr = [];

				templateArr.forEach(function(template, index){
					promiseArr.push(
						new Promise(function(resolve, reject) {
							fs.writeFile(newProjectDir +"/" + title[index], template, function(err) {
								if (err) reject(err);
								else resolve(template);
							});
						})
					);
				});

				return Promise.all(promiseArr);

			})
			.then(function(finaltemp) {
				return multipageGenerator(tabBarData, tabBarStyleData, title, newProjectDir);
			})
			.then(function(tabBarFile){
				return newProjectDir;
			})
			.then(function(newProjDir) {

				var output = fs.createWriteStream(userZipDirectory);
				var archive = archiver('zip');

				output.on('close', function () {
				    console.log(archive.pointer() + ' total bytes');
				    console.log('archiver has been finalized and the output file descriptor has closed.');
				});

				archive.on('error', function(err){
				    throw err;
				});

				archive.pipe(output);
				archive.bulk([
				    { expand: true, cwd: newProjDir, src: ['**'], dest: 'source'}
				]);
				return archive.finalize();

			});

};