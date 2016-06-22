var app = angular.module("article", ['ngRoute']);

//We use hashbangs here, not your terrible html5 urls
app.config(['$locationProvider', function($locationProvider){
	$locationProvider.html5Mode(false);
	$locationProvider.hashPrefix('!');
}]);



app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'template/articleList.html',
		controller: 'ArticleListController'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.directive('redditHeadline', function() {
	return {
		restrict: 'A',
		//scope: {item: '=redditHeadline'},
		templateUrl: 'template/redditHeadline.html',
		//template: "<p>{{post.data.title}}</p>"
		link: function(scope, ele, attrs, con){
			scope.image = (scope.post.data.thumbnail != "" && scope.post.data.thumbnail != "self");
		},
	};
});


//Can provide reddit
app.factory('RedditService', ['$http', '$q', function($http, $q) {
	var service = {}
	var data = {posts: undefined};
	//We return data, which contains nothing but articles
	//This is so when the articles change, things are still bound to data

	service.reload = function(){
		var defer = $q.defer();
		$http.get('https://www.reddit.com/.json')
			.then(
				function(response){
					data.posts = response.data.data.children;
					defer.resolve(data);
				},
				function(error){
					defer.reject(error);
				}
			);
		return defer.promise;
	};


	return service;
}]);

app.controller('ArticleListController', ['$scope', 'RedditService',
		function($scope, reddit) {
	$scope.refresh = function(){
		reddit.reload().then(
			function(redditData){
				$scope.redditData = redditData;
			},
			function(error){
				$scope.errmsg = error;
				$scope.error = true;
			});
	}
	$scope.refresh();//Initial load
}]);
