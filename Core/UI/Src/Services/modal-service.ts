/// <reference path="../common-refs.d.ts" />
/// <reference path="../app/cmp-constants.ts" />
/// <reference path="services-module.ts" />
/// <reference path="../bases/base-modal-controller.ts" />
/// <reference path="../bases/base-modal-service.ts" />
/// <reference path="../app/cmp-enums.ts" />

namespace Cmp.Ui.Services {

	/** 
	* @interface

	* @description
	* Describes the additional settings to the Cmp.Ui.Bases.ICmpModalTemplateSettings interface 
	* used by the CmpModalServiceController to bind to the cmp-modal-template directive.
	* An object implementing this interface can be used as view model for the cmp-modal-template directive.
	*/
	export interface ICmpModalControllerSettings extends Cmp.Ui.Bases.ICmpModalTemplateSettings {
		BodyContent?: string;
		BodyUrl?: string;
	}

	export interface ICmpModalServiceSettings extends ICmpModalControllerSettings {
		Model?: any;
	}

	/**
	* @controller
	*
	* @description
	* This controller is designed to work with CmpModalService to bind to the cmp-modal-template directive,
	* contained in then cmp-modal-base.html template.
	* This controller is essentially a view model for the modal dialog defined by the CmpModalService service.
	*
	* @param {ICmpModalServiceSettings=} templateOptions. Settings object injected via a resolve on the $uibModal.open options. 
	*	These are setting that apply to the cmp-modal-template directive, not the angular-ui-bootstrap modal.
	*
	* @requires
	* ui.bootstrap - modal service 
	* Cmp.Ui.Bases.CmpModalTemplateController
	*
	* @example
		...
			templateUrl: 'cmp-ui/Component/CmpModal/cmp-modal-base.html',
			controller: CmpModalServiceController,
			controllerAs: CmpModalServiceController.ModalControllerName,
		...
	*/
	export class CmpModalServiceController extends Cmp.Ui.Bases.CmpModalTemplateController implements ICmpModalControllerSettings {

		public BodyContent: string;
		public BodyUrl: string;
		public Model: any;

		/*@ngInject*/
		constructor(
			baseTools: Cmp.Ui.Services.IBaseTools,
			$modalInstance: angular.ui.bootstrap.IModalServiceInstance,
			/** The CmpModalService service injects this via a resolve on the $uibModal.open options. */
			templateOptions?: ICmpModalControllerSettings,
			model?: any) {
			super(baseTools, $modalInstance);
			var self = this;

			/** If there are injected options, apply them to the controller.  */
			if (templateOptions) {
				Cmp.Ui.Services._CmpModalService.SafeExtend<ICmpModalControllerSettings>(self, templateOptions);
			}

			self.Model = model;
		}
	}

    /** 
    * @service

    * @description
    * This service is designed to work with the the angular-ui-bootstrap modal service.
    * This service combines the a template which contains the cmp-modal-template directive with the CmpModalServiceController.
    * This service allows a consumer to define opions for both cmp-modal-template directive and the angular-ui-bootstrap modal service.
    * This service contains shortcut methods for common uses of a modal dialog, such as a confirmation dialog and an informatonal dialog.
    *
    * @requires
    * ui.bootstrap - modal service 
    * Cmp.Ui.Bases.CmpModalTemplateController
    */
    export interface ICmpModalService extends Cmp.Ui.Bases.IBaseModalService { 
		/** 
		* @method
		* @description
		* Opens a modal dialog, defined by the passed options objects.
		*/
        OpenModal: (passedTemplateOptions?: ICmpModalControllerSettings,
            passedModalOptions?: angular.ui.bootstrap.IModalSettings) => angular.ui.bootstrap.IModalServiceInstance;

		/** 
		* @method
		* @description
		* Opens a confirmational modal dialog, with the content defined by a passed content string;
		*/
        Confirm: (message: string) => angular.ui.bootstrap.IModalServiceInstance;

		/** 
		* @method
		* @description
		* Opens a confirmational modal dialog, with the content defined by a passed url string;
		*/
        ConfirmUrl: (url: string) => angular.ui.bootstrap.IModalServiceInstance;

		/** 
		* @method
		* @description
		* Opens a informational modal dialog, with the content defined by a passed content string;
		*/
        Info: (message: string) => angular.ui.bootstrap.IModalServiceInstance;

		/** 
		* @method
		* @description
		* Opens a informational modal dialog, with the content defined by a passed url string;
		*/
        InfoUrl: (url: string) => angular.ui.bootstrap.IModalServiceInstance;

		/** 
		* @method
		* @description
		* Opens a modal dialog, with yes, no, and cancel buttons. The content is defined by a passed content string.
		* @returns {Cmp.Ui.Enums.Response}
		*/
		YesNoCancel: (message: string, title?: string) => cmp.IPromise<Cmp.Ui.Enums.Response>;
    }

	/** 
	* @service

	* @description
	* This service is designed to work with the the angular-ui-bootstrap modal service.
	* This service combines the a template which contains the cmp-modal-template directive with the CmpModalServiceController.
	* This service allows a consumer to define opions for both cmp-modal-template directive and the angular-ui-bootstrap modal service.
	* This service contains shortcut methods for common uses of a modal dialog, such as a confirmation dialog and an informatonal dialog.
	*
	* @requires
	* ui.bootstrap - modal service 
	* Cmp.Ui.Bases.CmpModalTemplateController
	*/
    export class _CmpModalService extends Cmp.Ui.Bases.BaseModalService implements ICmpModalService { 
	
		/*@ngInject*/
        constructor($uibModal: angular.ui.bootstrap.IModalService) {
			super($uibModal);
        }

		/** 
		* @method
		* @description
		* Override in ancestor services to define default template look and feel settings
		*/
		protected DefaultTemplateOptions = (): ICmpModalControllerSettings => {
			return null;
		}

		/** 
		* @method
		* @description
		* Defines the base options for the angular-ui-bootstrap modal service. Combines the cmp-modal-base.html template 
		* and the CmpModalServiceController controller.
		*/
		protected DefaultModalOptions = (): angular.ui.bootstrap.IModalSettings => {
			return CmpModalServiceController.AssignToModalSettings({
				animation: true,
				templateUrl: 'cmp-ui/Component/CmpModal/cmp-modal-base.html',
				size: 'sm',
				backdrop: 'static',
				resolve: {
					templateOptions: null,
					model: null
				}
			});
		}

		/** 
		* @method
		* @description
		* Combines angular-ui-bootstrap modal service options with cmp-modal-template directive options in the way
		* required for the use with the CmpModalServiceController and the cmp-modal-template directive.
		*/
		private MakeModalOptions = (
			passedTemplateOptions: ICmpModalServiceSettings,
			passedModalOptions: angular.ui.bootstrap.IModalSettings): angular.ui.bootstrap.IModalSettings => {
			var self = this;
			var modalOptions: angular.ui.bootstrap.IModalSettings;
			var templateOptions: ICmpModalControllerSettings;
			var passedValuesResolve: any;
			var passedModel: any;

			modalOptions = Cmp.Ui.Services._CmpModalService.SafeExtend<angular.ui.bootstrap.IModalSettings>(self.DefaultModalOptions(), passedModalOptions);

			if (!Cmp.Js.IsNullOrUndefined(passedTemplateOptions)) {
				passedModel = passedTemplateOptions.Model;
				passedTemplateOptions.Model = undefined;
			}

			templateOptions = Cmp.Ui.Services._CmpModalService.SafeExtend<ICmpModalControllerSettings>(self.DefaultTemplateOptions(), passedTemplateOptions);

			if (!Cmp.Js.IsNullOrUndefined(templateOptions) || !Cmp.Js.IsNullOrUndefined(passedModel)) { 
				passedValuesResolve = {};

				if (!Cmp.Js.IsNullOrUndefined(templateOptions)) {
					passedValuesResolve.templateOptions = (): ICmpModalControllerSettings => templateOptions;
				}
				if (!Cmp.Js.IsNullOrUndefined(passedModel)) {
					passedValuesResolve.model = angular.isFunction(passedModel) ? passedModel : (): ICmpModalControllerSettings => passedModel;
				}
			}

			modalOptions.resolve = Cmp.Ui.Services._CmpModalService.SafeExtend<any>(modalOptions.resolve, passedValuesResolve);

			return modalOptions;
		}

		/** 
		* @method
		* @description
		* Opens a modal dialog, defined by the passed options objects.
		*/
		public OpenModal = (passedTemplateOptions?: ICmpModalServiceSettings,
			passedModalOptions?: angular.ui.bootstrap.IModalSettings): angular.ui.bootstrap.IModalServiceInstance => {

			var self = this;

			var options = self.MakeModalOptions(passedTemplateOptions, passedModalOptions);

			return self.Open(options);
		}

		/** 
		* @method
		* @description
		* Opens a confirmational modal dialog, with the content defined by a passed content string;
		*/
		public Confirm = (message: string): angular.ui.bootstrap.IModalServiceInstance => {
			return this.OpenModal({ BodyContent: message });
		}

		/** 
		* @method
		* @description
		* Opens a confirmational modal dialog, with the content defined by a passed url string;
		*/
		public ConfirmUrl = (url: string): angular.ui.bootstrap.IModalServiceInstance => {
			return this.OpenModal({ BodyUrl: url }, { size: 'lg' });
		}

		/** 
		* @method
		* @description
		* Makes an ICmpModalServiceSettings options object for the display of an informational dialog.
		*/
		private MakeInfoTemplateOptions = (passedTemplateOptions: ICmpModalControllerSettings): ICmpModalControllerSettings => {
			var baseInfoOptions = {
				ConfirmIcon: false,
				InfoIcon: true,
				HideCancel: true,
				TitleText: 'Core$Info'
			};
			return Cmp.Ui.Services._CmpModalService.SafeExtend<ICmpModalControllerSettings>(baseInfoOptions, passedTemplateOptions);
		}

		/** 
		* @method
		* @description
		* Opens a informational modal dialog, with the content defined by a passed content string;
		*/
		public Info = (message: string): angular.ui.bootstrap.IModalServiceInstance => {
			var self = this;
			return self.OpenModal(self.MakeInfoTemplateOptions({ BodyContent: message }));
		}

		/** 
		* @method
		* @description
		* Opens a informational modal dialog, with the content defined by a passed url string;
		*/
		public InfoUrl = (url: string): angular.ui.bootstrap.IModalServiceInstance => {
			var self = this;
			return self.OpenModal(self.MakeInfoTemplateOptions({ BodyUrl: url }), { size: 'lg' });
		}

		/** 
		* @method
		* @description
		* Opens a modal dialog, with yes, no, and cancel buttons. The content is defined by a passed content string.
		* @returns {Cmp.Ui.Enums.Response}
		*/
		public YesNoCancel = (message: string, title?:string): cmp.IPromise<Cmp.Ui.Enums.Response> => {
			var self = this;
			return self.OpenModal( 
				{
					TitleText: title,
					BodyContent: message,
					FooterUrl: 'cmp-ui/Component/CmpModal/yes-no-cancel.html'
				},
				{ size: 'md' }
			).result.then((result) => {
				if (result) {
					return Cmp.Ui.Enums.Response.Yes;
				} else {
					return Cmp.Ui.Enums.Response.No;
				}
			}).catch(() => {
				return Cmp.Ui.Enums.Response.Cancel;
			});
		}

		/** 
		* @method
		* @description
		* Utitlity method to combine two objects. Used to extend options objects with additional options objects. 
		* Uses angular.extend, which raises an exception if the first parameter is null undefined.
		*/
		public static SafeExtend<T>(object1: T, object2: T): T {
			if (Cmp.Js.IsNullOrUndefined(object1)) {
				if (Cmp.Js.IsNullOrUndefined(object2)) {
					return object1;
				} else {
					object1 = <T>{};
				}
			}
			return <T>angular.extend(object1, object2);
		}


	}

    angular.module('cmp.ui.services').service('cmpModalService', _CmpModalService);

}