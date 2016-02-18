/// <reference path="../../common-refs.d.ts" />
/// <reference path="../components-module.ts" />

namespace Cmp.Ui.Components {

	/**
	* @directive
	*
	* @description
	* This directive allows you to use the cmp-modal-template.html template as a wrapper around other 
	* html that will rendered in the modal-body section of a bootstrap modal. 
	* The pupose of the directive is to enable re-use of the bootstrap modal styling provided by cmp-modal-template.html.
	* This directive is for use with the angular-ui-bootstrap modal service (http://angular-ui.github.io/bootstrap/).
	* This directive does not not have an isolated scope, sharing it's scope with the controller. 
	* This should be used in conjuction with a descendant of the CmpModalTemplateController, 
	* or another controller that extends ICmpModalTemplateSettings. See ICmpModalTemplateSettings source for a 
	* explanation of how the settings affect the rendering of the template.
	*
	* @requires
	* ui.bootstrap - modal service 
	* ngAnimate - used to animate modal showing
	*
	* @example
	<cmp-modal-template>
	<div>
		<label>My Entry Markup</label>
		<input />
	</div>
	</cmp-modal-template>
	*/
	export class CmpModalTemplate implements ng.IDirective {
		constructor() { }
		
		/** Instance method used to instantiate directive constructor function. */
		/*@ngInject*/
		static Instance(): ng.IDirective {
			return new CmpModalTemplate();
		}

		/** html template with bootstrap modal  */
		templateUrl: string = 'cmp-ui/Component/CmpModal/cmp-modal-template.html';
		restrict: string = 'E';
		/**  */
		transclude: boolean = true;
	}

	/** register directive */
	angular
		.module('cmp.ui.components')
		.directive('cmpModalTemplate', CmpModalTemplate.Instance);
}