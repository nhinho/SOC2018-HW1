app.directive('videostatus', function($compile){
	return {
		restrict: 'A',
		scope:{
			key: '=key',
			val: '=val'
		},
		template: "<dt style='width:40%;'>{{key}}</dt><dd style='margin-left:43%;'>{{val}}<dd>",
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {
				},
				post: function postLink(scope, iElement, iAttrs, controller) {
				}
			}
		}
	}});