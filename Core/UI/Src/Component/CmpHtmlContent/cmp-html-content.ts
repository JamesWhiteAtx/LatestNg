/// <reference path="../../common-refs.d.ts" />
/// <reference path="../components-module.ts" />

namespace Cmp.Ui.Components {

	/** 
	* @interface

	* @description
	* Describes the settings used by CmpHtmlContent directive.
	*/
	export interface ICmpHtmlAttributeSettings {
		cgUrl: string;
		cgContent: string;
		cgIf: string;
	}

	/** 
	* @interface

	* @description
	* Describes the values assigned to the CmpHtmlContent directive's scope.
	*/
	export interface ICmpHtmlScopeValues {
		Url?: string;
		Content?: string;
		Display: boolean;
	}

	/**
	* @directive
	*
	* @description
	* This directive will display content as transcluded html, or via a bound url, or as a bound content string.
	*
	* @param {string=} cgUrl. If specified, bound to ng-include to display the url's instead of any trasncluded markup.
	* @param {string=} cgContent. If specified, bound ng-bind-html to display the content string as html instead of any trasncluded markup.
	* @param {expression=} cgIf. Determines if any of the markup is displayed.
	*
	* @requires
	* ngSanitize - ng-bind-html is used to display bound content, and including the ngSanitize ensures that the content is santized for safety.
	* 
	* @example
	<cmp-html-content cg-url="vm.Url" cg-content="vm.Content">
	<div>
		<label>This is the transcluded default markup that will appear, if not url or content are bound. </label>
		<input />
	</div>
	</cmp-html-content>
	*
	* @todo - use watches on the bound attributes to allow live content switching.
	*/
	export class CmpHtmlContent implements ng.IDirective {

		/**  inject $parse service because this directive does not have an isolated scope */
		constructor(private $parse: angular.IParseService) { }
	
		/*@ngInject*/
		static Instance($parse: angular.IParseService): ng.IDirective {
			return new CmpHtmlContent($parse);
		}

		/** create a new child scope inherited from the parent scope */
		scope = true;

		link = (
			scope: ICmpHtmlScopeValues | angular.IScope,
			element: angular.IAugmentedJQuery,
			attrs: angular.IAttributes,
			nullController: any,
			/** Include the transclude function so transclusion can be conditional. */
			transclude: angular.ITranscludeFunction) => {

			var self = this;
			var attrSettings: ICmpHtmlAttributeSettings;
			var scopeValues: ICmpHtmlScopeValues;
			var displayIf: boolean;
			var modelAs: string;

			/** cast as settings */
			scopeValues = <ICmpHtmlScopeValues>scope;
			attrSettings = <ICmpHtmlAttributeSettings><any>attrs;

			/** use $parse service to determine the values of attribute settings */
			scopeValues.Url = self.$parse(attrSettings.cgUrl)(scope);
			scopeValues.Content = self.$parse(attrSettings.cgContent)(scope);
			
			/** determine cg-if is defined */
			displayIf = self.$parse(attrSettings.cgIf)(scope);

			/** Assign Display from the ngIf attribute. ngIf might be defined on scope, so don't change it, copy the calculated value. */
			scopeValues.Display = Cmp.Js.IsNullOrUndefined(displayIf) ? true : Cmp.Js.Boolify(displayIf);

			/** If display is not false, and neither a url nor a content string are bound, transclude any contained markup. */
			if (scopeValues.Display && !scopeValues.Url && !scopeValues.Content) {
				transclude(function (clone: any) {
					element.append(clone);
				});
			}
		};

		/** Markup template with ng-include and ng-bind-html directives for dislaying bound markup. */
		templateUrl: string = 'cmp-ui/Component/CmpHtmlContent/cmp-html-content.html';
		restrict: string = 'EA';
		transclude: boolean = true;
	}

	angular
		.module('cmp.ui.components')
		.directive('cmpHtmlContent', CmpHtmlContent.Instance);
}