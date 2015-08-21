app.config(function($stateProvider) {

	// Register our *about* state.
	$stateProvider.state('editPage', {
		url: '/edit',
		controller: 'EditPageController',
		templateUrl: 'js/edit-page/edit-page.html'
	});

});

function colorChange($scope) {
	$scope.$on('changeSelect', function(event, data) {
		$scope.currentlySelected = $(data)
		$scope.$apply()
	})
}

app.controller('EditPageController', function($scope, $compile, UILibraryFactory, EmitterizerFactory, Interactory, StyleFactory,ParseTreeFactory, CssTreeFactory) {
	$scope.convertObjToInlineStyle = CssTreeFactory.objToInlineStyle;
	$scope.cssTree = CssTreeFactory.cssTree;
	$scope.parseTree = ParseTreeFactory.parseTree.tree;

	$scope.pathName = function(elemPath){
		return "js/common/components/" + elemPath + ".html"
	}


	$scope.changeSelected = function(className){
		if($scope.currentlySelected) $scope.currentlySelected.removeClass('shadow')
		$scope.activeCSSEdit = CssTreeFactory.cssTree[className];
		$scope.currentlySelected = $('.'+ className);
		var thisParent = $scope.currentlySelected.parent()[0]
		$scope.currentlySelected.addClass('shadow')
		$scope.activeHTMLEdit = ParseTreeFactory.findActiveElement($scope, className, thisParent);
	}



	$scope.uiLibrary = UILibraryFactory;
	//properties to edit styling:
	$scope.activeCSSEdit = {};
	//properties to edit HTML
	$scope.activeHTMLEdit = {};
	$scope.currentlySelected = null;
	$scope.lessFlex = StyleFactory.lessFlex($scope);
	$scope.moreFlex = StyleFactory.moreFlex($scope);
	$scope.deleteElem = function(){
		var thisParent = $scope.currentlySelected.parent()[0]
		ParseTreeFactory.removeElement($scope,$scope.currentlySelected,thisParent)
		$scope.activeCSSEdit = {};
		$scope.activeHTMLEdit = {};
	}

	//delete button code, not quite working yet:
	
	// $scope.showDeleteButton = function(className){
	// 	var $elem = $('.'+className)
	// 	$elem.prepend('<span style="display: inline-block; position: absolute; float: left; align-self: flex-start;" class="x-button">x</span>')
	// 	$('.x-button').on('click',function(){
	// 		ParseTreeFactory.removeRow($scope, className)
	// 		$(this).remove();
	// 	})
	// }

	// $scope.hideDeleteButton = function(className){
	// 	$('.x-button').remove();
	// }

	//event emitter to catch whenever someone selects a template in the iPhone
	// $scope.$on('changeSelect', function(event, data) {
	// 	if($scope.currentlySelected) $scope.currentlySelected.removeClass('shadow')
	// 	$scope.currentlySelected = $(data)
	// 	$scope.currentlySelected.addClass('shadow')
	// 	$scope.editProps = {flexGrowSize: 1};
	// 	$scope.$apply()
	// });
	EmitterizerFactory.makeEmitterListeners($scope);

	Interactory.Interact($scope);
});