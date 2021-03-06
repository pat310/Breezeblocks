app.directive('contenteditable', ['$sce', function($sce, $compile) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      // Write data to the model
      function read() {
        var text = element.text();
        // text = $compile(text)(scope);
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        // if ( attrs.stripBr && html == '<br>' ) {
        //   html = '';
        // }
        ngModel.$setViewValue(text);
      }

      function initialRead() {
        var text = element.text();
        text = $compile(text)(scope);
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        // if ( attrs.stripBr && html == '<br>' ) {
        //   html = '';
        // }
        ngModel.$setViewValue(text);
      }
      
      // Listen for change events to enable binding
      element.on('blur keyup change', function() {

        scope.$evalAsync(read);
      });
      initialRead(); // initialize

    }
  };
}]);