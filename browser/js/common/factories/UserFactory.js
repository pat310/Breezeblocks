app.factory("UserFactory", function($http) {
	return {
		getAllUsers: function() {
			return $http.get('api/users')
				.then(function(res) {
					return res.data;
				});
		},
		getUser: function(id) {
			return $http.get(`api/users/${id}`)
				.then(function(res) {
					return res.data;
				});
		},
		updateUser: function(id, data) {
			return $http.put(`api/users/${id}`, data)
				.then(function(res) {
					return res.data;
				});
		},
		deleteUser: function(id) {
			return $http.delete(`api/users/${id}`)
				.then(function(res) {
					return res.data;
				});
		}
	};
});