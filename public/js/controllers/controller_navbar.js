app.controller('NavbarController', ['$scope', function($scope){
	$scope.title = 'DASH examplec';
	$scope.menuitems = [{
		type : 'normal',
		name : 'Home',
		ref : '/index.html'
	}];
}]);