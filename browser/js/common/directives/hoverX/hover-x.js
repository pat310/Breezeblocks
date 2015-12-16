app.directive('hoverX', function (ParseTreeFactory) {
	return {
		restrict: 'A',
		link: function (scope, elem) {
			var $elem = $(elem);
			$elem.on('mouseover', function () {
				if ($elem.children().length === 0) {
					$elem.append('<div class="x-button"><span class="glyphicon glyphicon-remove"></span></div>');
					$('.x-button').on('click', function () {
						ParseTreeFactory.removeRow(scope.$parent, $elem.attr('class').split(" ")[1]);
						$(this).fadeOut("fast");
						$elem.slideUp("fast", function () {
							$elem.remove();
						});
					});
				}
			});
			$elem.on('mouseleave', function () {
				$('.x-button').remove();
			});
		}
	};
});