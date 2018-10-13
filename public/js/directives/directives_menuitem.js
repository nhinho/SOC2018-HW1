app.directive('menuitem', function($compile){
	return {
		restrict: 'A',
		scope:{
			menuitem: '=info'
		},
		templateUrl: "js/directives/templates_menuitem.html",
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {
					//console.log('pre!');
				},
				post: function postLink(scope, iElement, iAttrs, controller) {
					//console.log('post-link!');

					if(scope.menuitem.type == 'dropdown'){
						iAttrs.$addClass('dropdown');
						iElement.children('a').append(' <span class="caret"></span>');
						iElement.children('a').addClass('dropdown-toggle');
						iElement.children('a').attr({
							'data-toggle' : "dropdown", 
							'role' : "button", 
							'aria-haspopup' : "true",
							'aria-expanded' : "false"
						});
						iElement.append('<ul class="dropdown-menu"></ul>');
						var inner_html = '<li ng-repeat="item in menuitem.dropdown_items" menuitem info="item"></li>';
						var linkFn = $compile(inner_html);
						var content = linkFn(scope);
						iElement.children('ul.dropdown-menu').append(content);
					}
					else if(scope.menuitem.type == 'drop_header'){
						iAttrs.$addClass('dropdown-header');
						iElement.children('a').remove();
						iElement.append(scope.menuitem.name);
					}
					else if(scope.menuitem.type == 'drop_separator'){
						iAttrs.$addClass('divider');
						iElement.children('a').attr({
							'role' : 'separator'
						});
					}
					else if(scope.menuitem.type == 'drop_normal'){

					}


				}
			}
		}
	}});