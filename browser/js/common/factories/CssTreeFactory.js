app.factory('CssTreeFactory', function () {
	return {
		objToInlineStyle: function (className) {
			var str = "";
			for (var selector in this.project.css[className]) {
				str += selector + ': ' + this.project.css[className][selector];
				if (selector.match(/(margin)/) || selector.match(/(padding)/) || selector === "font-size") str += "px";
				str += ";";
			}
			return str;
		},
		addViewClass: function (className, $scope) {
			$scope.project.css[className] = {};
		},
		addChildClass: function (className, $scope) {
			$scope.project.css[className] = {
				"flex-grow": 1,
				"padding-left": 0,
				"padding-right": 0,
				"padding-top": 0,
				"padding-bottom": 0,
				"margin-left": 0,
				"margin-right": 0,
				"margin-top": 0,
				"margin-bottom": 0
			};

			if (className.match(/(text)|(listview)|(navbar)/)) {
				$scope.project.css[className]['font-size'] = 17;
				if (className.match(/(navbar)/)) {
					$scope.project.css[className]['text-align'] = 'center';
				}
			}

		},
		removeClass: function (className, $scope) {
			if ($scope.project.css[className]) delete $scope.project.css[className];
		},
		removeViewClass: function (rowClassName, $scope) {
			var classNameRegex = new RegExp(rowClassName);
				//need to find Children based on parent className
			for (var className in $scope.project.css) {
				if (className.match(classNameRegex)) delete $scope.project.css[className];
			}
		}

	};
});