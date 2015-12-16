app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function() {
                return AuthService.getLoggedInUser();
            })
            .then(function(user) {
                $state.go('userDash', {
                    id: user._id
                });
            })
            .catch(function() {
                $scope.error = 'Invalid login credentials.';
            });
    };

});