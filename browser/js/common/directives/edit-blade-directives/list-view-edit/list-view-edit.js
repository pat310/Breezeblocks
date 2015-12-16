app.directive('listViewEdit', function() {
	return {
		restrict: "E",
		templateUrl: 'js/common/directives/edit-blade-directives/list-view-edit/list-view-edit.html',
		link: function(scope) {
			scope.addListItem = function(arr) {
				var index = arr.length;
				arr.push({
					index: index
				});
			};
		}
	};
});