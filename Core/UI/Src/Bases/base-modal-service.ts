/// <reference path="../common-refs.d.ts" />

namespace Cmp.Ui.Bases {

	export interface IBaseModalService {
		 Open: (...passedOptions: angular.ui.bootstrap.IModalSettings[]) => angular.ui.bootstrap.IModalServiceInstance;
	}

	// controlls the look and feel and behavior of the angular ui modal

	/** 
	* @service

	* @description
	* This service is designed to work with the the angular-ui-bootstrap modal service.
	* This service serves as a base for other task specific modal services. 
	* This service defines a base method to define default modal dialog settings, as well as a 
	* method to combine multiple settings objects.
	*
	* @requires
	* ui.bootstrap - modal service 
	*/
	export class BaseModalService implements IBaseModalService {
		/*@ngInject*/
		constructor(public $uibModal: angular.ui.bootstrap.IModalService) {
		}

		/** 
		* @method
		* @description
		* Override in ancestor services to define default angular-ui-bootstrap modal service settings.
		*/
		protected DefaultModalOptions = (): angular.ui.bootstrap.IModalSettings => {
			return <angular.ui.bootstrap.IModalSettings>{
				backdrop: 'static'
			};
		}

		/** 
		* @method
		* @description
		* Opens an angular-ui-bootstrap modal service and returns a modal instance. 
		* Can accept multiple settings objects that will be combibed in modal dialog.
		*/
		public Open = (...passedOptions: angular.ui.bootstrap.IModalSettings[]): angular.ui.bootstrap.IModalServiceInstance => {
			var self = this;

			var modalOptions: angular.ui.bootstrap.IModalSettings;

			modalOptions = self.DefaultModalOptions();
			if (passedOptions && passedOptions.length) {
				passedOptions.forEach((options) => {
					angular.extend(modalOptions, options);
				});
			}
			return self.$uibModal.open(modalOptions);
		}
	}

}