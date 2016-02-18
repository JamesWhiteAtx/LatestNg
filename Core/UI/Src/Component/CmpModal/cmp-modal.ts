/// <reference path="../../common-refs.d.ts" />
/// <reference path="../components-module.ts" />

namespace Cmp.Ui.Components {

	interface ICmpModal {
		CgModalId: string;	// the id for the modal dialog, will be used in jQuery to show it
		CgShowCancel: boolean | string;
		CgOkClick: string;
		CgCancelClick: string;
		CgShowHeader: boolean | string;
	}

	class CmpModal implements ng.IDirective {
		constructor() { }
		
		/*@ngInject*/
		static Instance(): ng.IDirective {
			return new CmpModal();
		}

		scope: ICmpModal = {
			'CgModalId': '@cgModalId',
			'CgShowCancel': '=cgShowCancel',
			'CgOkClick': '&cgOkClick',
			'CgCancelClick': '&cgCancelClick',
			'CgShowHeader': '=cgShowHeader'
		};

		link = (scope: ICmpModal | angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
			var self = this;
			var scopeAsModal: ICmpModal = <ICmpModal>scope;
			var scopeAsNgScope: angular.IScope = <angular.IScope>scope;

			if (scopeAsModal.CgShowHeader !== "false") {
				scopeAsModal.CgShowHeader = true;
			}

			if (!scopeAsModal.CgModalId) {
				scopeAsModal.CgModalId = "dlgModal";
			}
		};

		templateUrl: string = 'cmp-ui/Component/CmpModal/cmp-modal.html';
		restrict: string = 'E';
		transclude: boolean = true;
	}

	angular
		.module('cmp.ui.components')
		.directive('cmpModal', CmpModal.Instance);
}
