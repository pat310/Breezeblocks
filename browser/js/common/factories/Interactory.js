app.factory("Interactory", function($compile, ParseTreeFactory, CssTreeFactory, ZoomService) {
	return {
		Interact: function($scope) {
			interact('#app')
				.dropzone({
					accept: '#dropThumb',
					overlap: 0.75,
					ondrop: function() {
						var eventClass = ParseTreeFactory.addRow($scope);
						CssTreeFactory.addViewClass(eventClass, $scope);
						$scope.$digest();
					}

				});



			interact('.drop-area')
				.dropzone({
					accept: '#elemThumb',
					ondrop: function(event) {
						var thisComponentName = event.relatedTarget.getAttribute('component');
							//thisCOmponentName = "Navbar", "Image", etc...
						var eventClass = ParseTreeFactory.addElement($scope, event.target.className.split(' ')[1], thisComponentName);
						CssTreeFactory.addChildClass(eventClass, $scope);
						$scope.$digest();
					}
				})
				.resizable({
					edges: {
						bottom: true
					},
				})
				.on('resizemove', function(event) {
					var scaleRatio = ZoomService.getZoom() / 100;
					var target = event.target,
						x = (parseFloat(target.getAttribute('data-x')) || 0),
						y = (parseFloat(target.getAttribute('data-y')) || 0);

					// update the element's style
					target.style.width = event.rect.width / scaleRatio + 'px';
					target.style.height = event.rect.height / scaleRatio + 'px';
					// translate when resizing from top or left edges
					x += event.deltaRect.left;
					y += event.deltaRect.top;

					target.style.webkitTransform = target.style.transform =
						'translate(' + x + 'px,' + y + 'px)';
					if ($scope.project.css[target.className.split(" ")[1]]) $scope.project.css[target.className.split(" ")[1]].height = target.style.height;
					target.setAttribute('data-x', x);
					target.setAttribute('data-y', y);
					$scope.$digest();
					// target.textContent = event.rect.width + '×' + event.rect.height;
				});

		}
	};
});