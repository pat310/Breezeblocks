app.config(function($stateProvider) {
	$stateProvider
		.state("userDash", {
			url: "/:id",
			templateUrl: "js/user-dash/user-dash.html",
			controller: 'UserDashController',
			resolve: {
				user: function(UserFactory, $stateParams) {
					return UserFactory.getUser($stateParams.id);
				}
			}
		});
});

app.controller("UserDashController", function($scope, $state, UserFactory, ProjectFactory, user, $rootScope) {
	$scope.user = user;
	$scope.latestProject;
	$scope.deleteProject = function(idToDelete) {
		ProjectFactory.deleteProject(idToDelete)
			.then(function() {
				return UserFactory.getUser(user._id);
			})
			.then(function(updatedUser) {
				$scope.user = updatedUser;
				user = updatedUser;
			});
	};
	$scope.createNewProject = function() {
		ProjectFactory.createProject()
			.then(function(project) {
				$scope.latestProject = project._id;
				user.projects.push(project._id);
				return UserFactory.updateUser(user._id, user);
			})
			.then(function(returnedUserId) {

				$scope.user = returnedUserId;
				user = returnedUserId;
				$state.go('userDash.project', ({
					id: user._id,
					projectId: $scope.latestProject
				}));
			});
	};

	$rootScope.$on("project updated", function(event) {
		UserFactory.getUser(user._id)
			.then(function(newUser) {
				$scope.user = newUser;
			});
	});
});