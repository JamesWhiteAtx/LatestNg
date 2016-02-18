/// <reference path="../common-refs.d.ts" />
/// <reference path="services-module.ts" />
/// <reference path="../bases/base-modal-find-service.ts" />
/// <reference path="../bases/find-row-definition.ts" />
/// <reference path="modal-service.ts" />

namespace Cmp.Ui.Services {

	/** 
	* @interface
	* @description
	* Describes the service is that extends the base modal find service with fluent helper methods to allow for defining a modal find dialog with a single statement.
	*/
	export interface IModalFindFluentService {
        Size(size: string): IModalFindFluentService;
        /** will be passed through translater */
		Title(title: string): IModalFindFluentService;

		SearchBox(show: boolean): IModalFindFluentService;
		ButtonText(text: string): IModalFindFluentService;
		CloseOnPick(close: boolean): IModalFindFluentService;
		DisplayOnly(): IModalFindFluentService;

		TemplateOptions(settings: Cmp.Ui.Services.ICmpModalServiceSettings): IModalFindFluentService;
		ModalOptions(settings: ng.ui.bootstrap.IModalSettings): IModalFindFluentService;

		AddFieldDefn(fieldDefn: Cmp.Ui.Bases.IFindFieldDefinition): IModalFindFluentService;
		StringField(configParam: Cmp.Ui.Bases.IFindFieldConfig): IModalFindFluentService;
		DateField(configParam: Cmp.Ui.Bases.IFindFieldConfig): IModalFindFluentService;
		DateTimeField(configParam: Cmp.Ui.Bases.IFindFieldConfig): IModalFindFluentService;
		NumberField(configParam: Cmp.Ui.Bases.IFindNumberFieldConfig): IModalFindFluentService;
		CurrencyField(configParam: Cmp.Ui.Bases.IFindNumberFieldConfig): IModalFindFluentService;
		BooleanField(configParam: Cmp.Ui.Bases.IFindFieldConfig): IModalFindFluentService;

		Show<TReturnType>(listSource: any[]| cmp.IPromise<any[]> | { (): any[] } | { (): cmp.IPromise<any[]> } ): cmp.IPromise<TReturnType>;
	}

    /** 
    * @service
    * @description
    * This service is designed extend the base modal find service with fluent helper methods to allow for defining a modal find dialog with a single statement.
    */
	export class _FluentModalFindService extends Cmp.Ui.Bases.BaseModalFindService implements IModalFindFluentService {

		/*@ngInject*/
		constructor(
			$uibModal: angular.ui.bootstrap.IModalService,
			private $q: angular.IQService,
			$filter: angular.IFilterService,
			$translate: angular.translate.ITranslateService
			) {
			super($uibModal);
			var self = this;
			self._rowDefinition = new Cmp.Ui.Bases.FindRowDefinition($filter, $translate);
		}

		/** 
		* @method
		* @description 
		* Accepts the list of itms to display, shows the modal dialog, and returns a promise of the type of object to be picked.
		* @param {array or promise of an array or a function returing an array or a function returning a promise of an array} listSource
		*/
		public Show<TReturnType>(listSource: any[]| cmp.IPromise<any[]> | { (): any[] } | { (): cmp.IPromise<any[]> } ): cmp.IPromise<TReturnType> {
			var self = this;

			var deferred = self.$q.defer<TReturnType>();

			self.ModalPick(listSource)
				.result
				.then((picked: any) => {
					deferred.resolve(picked);
				}, (reason: any) => {
					deferred.reject(reason);
				});

			return deferred.promise;
		}

		/** 
		* @method
		* @description 
		* Sets the size of
		* @param {string} size (sm, md, or lg)
		*/
		public Size = (size: string): IModalFindFluentService => {
			var self = this;
			self._size = size;
			return self;
		}

		/** 
		* @method
		* @description
		* Sets the Title text at top modal dialog.
		* @param {string} title - Title text 
		*/
		public Title = (title: string): IModalFindFluentService => {
			var self = this;
			self._title = title;
			return self;
		}

		/** 
		* @method
		* @description
		* Shows or hides the search text input box.
		* @param {boolean} show - show the box
		*/
		public SearchBox = (show: boolean = true): IModalFindFluentService => {
			var self = this;
			self._showSearchBox = show;
			return self;
		}

		/** 
		* @method
		* @description
		* Sets the text displayed in the button that appears at the bottom of the dialog.
		* @param {string} text - button text
		*/
		public ButtonText = (text: string): IModalFindFluentService => {
			var self = this;
			self._buttonText = text;
			return self;
		}

		/** 
		* @method
		* @description
		* Enables or disables closing the find dialog when a row is clicked
		* @param {boolean} close - close the dialog
		*/
		public CloseOnPick = (close: boolean = true): IModalFindFluentService => {
			var self = this;
			self._closeOnPick = close;
			return self;
		}

		/** 
		* @method
		* @description
		* Shortcut method to formatt the dialog for display only:
		* no search box, ok button, does not close on row click
		*/
		public DisplayOnly = (): IModalFindFluentService => {
			var self = this;
			self.SearchBox(false)
				.ButtonText('Core$OK')
				.CloseOnPick(false);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a field defnition object and adds it to the list of field defninitions.
		* @param {Cmp.Ui.Bases.IFindFieldDefinition} fieldDefn - definition settings of the field defninition
		*/
		public AddFieldDefn = (fieldDefn: Cmp.Ui.Bases.IFindFieldDefinition): IModalFindFluentService => {
			var self = this;
			self._rowDefinition.AddFieldDefn(fieldDefn);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a string field defnition for a string field
		* @param {Cmp.Ui.Bases.IFindFieldConfig} configParam - configuration parameter
		*/
		public StringField = (configParam: Cmp.Ui.Bases.IFindFieldConfig): IModalFindFluentService => {
			var self = this;
			self._rowDefinition.StringField(configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a date field defnition for a string field
		* @param {Cmp.Ui.Bases.IFindFieldConfig} configParam - configuration parameter
		*/
		public DateField = (configParam: Cmp.Ui.Bases.IFindFieldConfig): IModalFindFluentService => {
			var self = this;
			self._rowDefinition.DateField(configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a date time field defnition for a string field
		* @param {Cmp.Ui.Bases.IFindFieldConfig} configParam - configuration parameter
		*/
		public DateTimeField = (configParam: Cmp.Ui.Bases.IFindFieldConfig): IModalFindFluentService => {
			var self = this;
			self._rowDefinition.DateTimeField(configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a number field defnition for a string field
		* @param {Cmp.Ui.Bases.IFindFieldConfig} configParam - configuration parameter
		*/
		public NumberField = (configParam: Cmp.Ui.Bases.IFindNumberFieldConfig): IModalFindFluentService => {
			var self = this;
			self._rowDefinition.NumberField(configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a currency field defnition for a string field
		* @param {Cmp.Ui.Bases.IFindFieldConfig} configParam - configuration parameter
		*/
		public CurrencyField = (configParam: Cmp.Ui.Bases.IFindNumberFieldConfig): IModalFindFluentService => {
			var self = this;
			self._rowDefinition.CurrencyField(configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a boolean field defnition for a string field
		* @param {Cmp.Ui.Bases.IFindFieldConfig} configParam - configuration parameter
		*/
		public BooleanField = (configParam: Cmp.Ui.Bases.IFindFieldConfig): IModalFindFluentService => {
			var self = this;
			self._rowDefinition.BooleanField(configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Sets the template options
		* @param {Cmp.Ui.Services.ICmpModalServiceSettings} settings - template options
		*/
		public TemplateOptions = (settings: Cmp.Ui.Services.ICmpModalServiceSettings): IModalFindFluentService => {
			var self = this;
			self._templateOptions = settings;
			return self;
		}

		/** 
		* @method
		* @description
		* Sets the modal settings options
		* @param {ng.ui.bootstrap.IModalSettings} settings - modal settings options
		*/
		public ModalOptions = (settings: ng.ui.bootstrap.IModalSettings): IModalFindFluentService => {
			var self = this;
			self._modalOptions = settings;
			return self;
		}
	}

	/** 
	* @interface
	* @description
	* Describes modal find dialog service
	*/
	export interface ICmpModalFindDialogService {
		Modal(): IModalFindFluentService;
	}

    /** 
    * @service
    * @description
    * This service is designed to be injected and used to display a modal find dialog via a fluent modal dialog interface
    */
	export class _CmpModalFindDialogService implements ICmpModalFindDialogService {

		private _$uibModal: angular.ui.bootstrap.IModalService;
		private _$q: angular.IQService;
		private _$filter: angular.IFilterService;
		private _$translate: angular.translate.ITranslateService;

		/*@ngInject*/
		constructor(
			$uibModal: angular.ui.bootstrap.IModalService,
			$q: angular.IQService,
			$filter: angular.IFilterService,
			$translate: angular.translate.ITranslateService) {
			var self = this;
			self._$uibModal = $uibModal;
			self._$q = $q;
			self._$filter = $filter;
			self._$translate = $translate; 
		}

		/** 
		* @method
		* @description
		* Returns an fluent modal dialog object for displaying a modal find dialog.
		*/
		public Modal = (): IModalFindFluentService => {
			var self = this;
			return new _FluentModalFindService(self._$uibModal, self._$q, self._$filter, self._$translate);
		}

	}

	angular.module('cmp.ui.services').service('modalFindDlg', _CmpModalFindDialogService);
}