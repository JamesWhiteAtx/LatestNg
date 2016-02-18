/// <reference path="../common-refs.d.ts" />
/// <reference path="base-modal-service.ts" />
/// <reference path="../services/modal-service.ts" />
/// <reference path="find-row-definition.ts" />
/// <reference path="base-modal-find-controller.ts" />

namespace Cmp.Ui.Bases {

    /** 
    * @service
    * @description
    * This service is designed 
    */
	export class BaseModalFindService extends Cmp.Ui.Bases.BaseModalService {

		protected _templateOptions: Cmp.Ui.Bases.ICmpFindModalSettings;
		protected _title: string;
		protected _modalOptions: ng.ui.bootstrap.IModalSettings;
		protected _size: string;
		protected _rowDefinition: Cmp.Ui.Bases.IFindRowDefinition;
		protected _showSearchBox: boolean = true;
		protected _buttonText: string;
		protected _closeOnPick: boolean = true;

		/*@ngInject*/
		constructor($uibModal: angular.ui.bootstrap.IModalService) {
			super($uibModal);
		}

		/** 
		* @method
		* @description
		* Gets the defined template options, if a title has been defined, assigns it to the title property of template options
		*/
		protected GetTemplateOptions = (): Cmp.Ui.Bases.ICmpFindModalSettings => {
			var self = this;
			var templateOptions: Cmp.Ui.Bases.ICmpFindModalSettings;

			templateOptions = self._templateOptions || {};

			templateOptions.ShowSearchBox = self._showSearchBox;

			if (self._title) {
				templateOptions.TitleText = self._title;
			}

			if (self._buttonText) {
				templateOptions.CancelText = self._buttonText;
			}

			templateOptions.CloseOnPick = self._closeOnPick;

			return templateOptions;
		}

		/** 
		* @method
		* @description
		* Accepts the source list of objects and Open method of the base class to display the modal dialog.
		* Responsible for defining the template and well as the controller.
		* Responsible for defininf the resolve object that will inject the template options, the row definition and the list of objects that will be injected into the controller.
		* @param {array or promise of an array or a function returing an array or a function returning a promise of an array} listSource - raw source for the rows.
		*/
		protected ModalPick(listSource: any[]| cmp.IPromise<any[]> | { (): any[] } | { (): cmp.IPromise<any[]> }): angular.ui.bootstrap.IModalServiceInstance {
			var self = this;

			var listResolver: { (): any[] } | { (): cmp.IPromise<any[]> };

			if (angular.isFunction(listSource)) {
				listResolver = <{ (): any[] }>listSource;
			} else {
				listResolver = () => {
					return <any[]>listSource;
				}
			}

			/** Set up modal options for the find modal dialog. Assign the base modal find controller */
			var newModalOptions = BaseModalFindController.AssignToModalSettings({
				size: self._size || 'md',
				templateUrl: 'cmp-ui/Bases/modal-find.html',
				resolve: {
					templateOptions: (): Cmp.Ui.Bases.ICmpFindModalSettings => {
						return self.GetTemplateOptions();
					},
					rowDefinition: (): Cmp.Ui.Bases.IFindRowDefinition => {
						return self._rowDefinition;
					},
					list: (): any[]| cmp.IPromise<any[]> => {
						return listResolver();
					}
				}
			});


			/** Open the modal dialog, assigning the find options, as well as any options defined by the base class */
			return self.Open(newModalOptions, self._modalOptions);
		}
	}

}