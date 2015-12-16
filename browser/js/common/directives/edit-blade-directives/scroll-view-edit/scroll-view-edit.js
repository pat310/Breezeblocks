app.directive('scrollViewEdit', function () {
	return {
		restrict: "E",
		templateUrl: 'js/common/directives/edit-blade-directives/scroll-view-edit/scroll-view-edit.html',
		link: function (scope) {
			scope.addListItem = function (arr) {
				arr.push({
					index: ""
				});
			};
		}
	};
});