/// <reference path="../common-refs.d.ts" />
/// <reference path="base-controller.ts" />

namespace Cmp.Ui.Bases {

	/** 
	* @interface

	* @description
	* Describes the settings used by CmpModalTemplateController, that are bound to the cmp-modal-template directive.
	* An object implementing this interface can be used as view model for the cmp-modal-template directive.
	*/
	export interface ICmpModalTemplateSettings {
		HeaderContent?: string;	// string (html) that overrides the default header content - via a cmp-html-content directive
		HeaderUrl?: string;		// string url identifying content that overrides the default header content - via a cmp-html-content directive
		HideHeader?: boolean;	// expression that determines if the header section is displayed - via a cmp-html-content directive
		TitleContent?: string;	// string (html) that overrides the default title content - via a cmp-html-content directive
		TitleUrl?: string;		// string url identifying content that overrides the default title content - via a cmp-html-content directive
		HideTitle?: boolean;	// expression that determines if the title section is displayed - via a cmp-html-content directive
		ConfirmIcon?: boolean;	// expression that determines if the confirmation icon is displayed
		InfoIcon?: boolean;		// expression that determines if the informational icon is displayed
		TitleText?: string;		// the displayed title text
		FooterContent?: string;	// string (html) that overrides the default footer content - via a cmp-html-content directive
		FooterUrl?: string;		// string url identifying content that overrides the default footer content - via a cmp-html-content directive
		HideFooter?: boolean;	// expression that determines if the footer section is displayed - via a cmp-html-content directive
		HideOk?: boolean;		// expression that determines if the ok button is displayed
		OkText?: string;		// expression that determines if the text of the ok button
		HideCancel?: boolean;	// expression that determines if the cancel button is displayed
		CancelText?: string;	// expression that determines if the text of the cancel button
	}

	/** 
	* @constant

	* @description
	* The standard modal controller name, typically 'modalVm'. 
	*/
	const ModalControllerName: string = 'modalVm';

	/**
	* @controller
	*
	* @description
	* This controller can be used as the ancestor for controllers used by the angular-ui-bootstrap modal service.
	* Specifically this controller is designed to work with a template containg the cmp-modal-template directive.
	* This directive implements the settings described by the ICmpModalTemplateSettings interface.
	* The angular-ui-bootstrap modal service binds a contoller and a view template in order to render a modal dialog.
	*
	* @requires
	* ui.bootstrap - modal service 
	*
	* @example
		export class CmpMyModalController extends Cmp.Ui.Bases.CmpModalTemplateController {
		...

		var modalInstance = $uibModal.open({
		  templateUrl: 'myModalContent.html', // contains the cmp-modal-template directive
		  controller: CmpMyModalController,
		  size: size,
		  resolve: {
			items: function () {
			  return $scope.items;
			}
		  }
		});
	*/
	export class CmpModalTemplateController extends Cmp.Ui.Bases.BaseController implements ICmpModalTemplateSettings {

		/** see ICmpModalTemplateSettings for explanation settings */
		public HeaderContent: string;
		public HeaderUrl: string;
		public HideHeader: boolean = false; 
		public TitleContent: string;
		public TitleUrl: string;
		public HideTitle: boolean = false; 
		public ConfirmIcon: boolean = true;
		public InfoIcon: boolean = false; 
		public TitleText: string = 'Core$Confirm';
		public FooterContent: string;
		public FooterUrl: string;
		public HideFooter: boolean = false;
		public HideOk: boolean = false;
		public OkText: string = 'Core$OK';
		public HideCancel: boolean = false;
		public CancelText: string = 'Core$Cancel';

		/*@ngInject*/
		constructor( 
			baseTools: Cmp.Ui.Services.IBaseTools,
			/** because this controller will be used with angular-ui-bootstrap modal service, the $modalInstance will be injected */
			public $modalInstance: angular.ui.bootstrap.IModalServiceInstance) {
			super(baseTools);
		}

		/** 
		* @property

		* @description
		* The modal controller name, typically 'modalVm'. 
		*/
		public static get ModalControllerName(): string { return ModalControllerName; }

		/** 
		* @method
		* @description
		* Assigns this controller class (constructor method) as the contoller and the modal controller name to the modal settings.
		* @returns angular.ui.bootstrap.IModalSettings
		*/
		public static AssignToModalSettings(modalSettings?: angular.ui.bootstrap.IModalSettings): angular.ui.bootstrap.IModalSettings {
			modalSettings = modalSettings || {};

			modalSettings.controller = this;
			modalSettings.controllerAs = this.ModalControllerName;

			return modalSettings;
		}
		/** 
			if this is defined, its result will allow or prevent the modal from closing on ok, returning true will allow it to close.
		*/
		protected AllowOkToClose: () => cmp.IPromise<boolean>;

		/** 
		* @method
		* @description
		* The value returned when the Ok button is clicked. Override in descendant classes to provide ok result. 
		*/
		protected OkResult = (): any => {
			return true;
		}

		/** 
		* @method
		* @description
		* Executed when the Ok button is clicked
		*/
		public Ok = (argResult?: any) => {
			var closeFunction = (allowClose: boolean) => {
				if (allowClose) {
					this.$modalInstance.close(Cmp.Js.IsNullOrUndefined(argResult) ? this.OkResult() : argResult);
				}
			};
			if (this.AllowOkToClose) {
				this.AllowOkToClose().then(closeFunction);
			} else {
				closeFunction(true);
			}
		}

		/** 
		* @method
		* @description
		* The value returned when the Cancel button is clicked. Override in descendant classes to provide cancel result.
		*/
		protected CancelResult = (): any => {
			return null;
		}

		/** 
		* @method
		* @description
		* Executed when the Cancel button or the window close icon in the upper right of the modal is clicked
		*/
		public Cancel = (argResult?: any) => {
			this.$modalInstance.dismiss(Cmp.Js.IsNullOrUndefined(argResult) ? this.CancelResult() : argResult);
		}

		/** 
		* @method
		* @description
		* Shortcut method to suppress display of any icons
		*/
		public HideIcons = () => {
			var self = this;
			self.ConfirmIcon = false;
			self.InfoIcon = false;
		}
		//'Core$Confirm' 
		//'Core$Info'
	}
}