/// <reference path="../common-refs.d.ts" />
/// <reference path="find-row-instance.ts" />
/// <reference path="find-row-definition.ts" />
/// <reference path="../services/modal-service.ts" />

import IFindRowInstance = Cmp.Ui.Bases.IFindRowInstance;

namespace Cmp.Ui.Bases {

	/** 
	* @interface

	* @description
	* Describes the additional settings to the Cmp.Ui.Services.ICmpModalServiceSettings interface 
	* used by the BaseModalFindController to bind to the cmp-modal-template directive.
	*/
	export interface ICmpFindModalSettings extends Cmp.Ui.Services.ICmpModalServiceSettings {
		ShowSearchBox?: boolean;
		CloseOnPick?: boolean;
	}

	/** 
	* @interface
	* @description
	* Describes the base controller for the modal find dialog.
	*/
	export interface IModalFindController {
		Rows: IFindRowInstance[];
		Picked: any;
		FilterText: string;
		ReverseSort: boolean;
		ShowSearchBox: boolean;
		CloseOnPick: boolean;
		Filter(): void;
		PickRow(pickedRow: IFindRowInstance): any;
	}

    /** 
    * @controller
    * @description
    * the base controller for the modal find dialog.
    */
	export class BaseModalFindController extends Cmp.Ui.Bases.CmpModalTemplateController implements IModalFindController {
		public Rows: IFindRowInstance[];
		public Picked: any;
		public FilterText: string;
		public ReverseSort: boolean = false;
		public ShowSearchBox: boolean = true;
		public CloseOnPick: boolean = true;
		public OnMobile: boolean;

		protected RowDefinition: Cmp.Ui.Bases.IFindRowDefinition;

		/*@ngInject*/
		constructor(
			baseTools: Cmp.Ui.Services.IBaseTools,
			$modalInstance: angular.ui.bootstrap.IModalServiceInstance,
			rowDefinition: Cmp.Ui.Bases.IFindRowDefinition,
			list: any[],
			templateOptions?: Cmp.Ui.Bases.ICmpFindModalSettings) {
			super(baseTools, $modalInstance);
			var self = this;

			self.OnMobile = Js.OnMobile();

			self.RowDefinition = rowDefinition; //new rowDefinitionClass(self.SortRows);
			self.RowDefinition.RowSortCallback = self.SortRows;

			self.Rows = self.MakeRows(list);

			self.TitleText = 'App$Find';
			self.HideIcons();
			self.HideOk = true;

			/** If there are injected options, apply them to the controller.  */
			if (templateOptions) {
				Cmp.Ui.Services._CmpModalService.SafeExtend<Cmp.Ui.Bases.ICmpFindModalSettings>(self, templateOptions);
			}

		}

		/** 
		* @method
		* @description
		* Makes the actual row instances for each of the raw objects passed
		* @param {array of any} - source list of objects
		*/
		protected MakeRows = (list: any[]): IFindRowInstance[]=> {
			var self = this;
			var num: number = 0;

			var rows = list.map((item) => {
				var row = self.RowDefinition.MakeRowInstance(item, num);
				num++;
				return row;
			});

			if (rows && rows.length) {
				rows[0].Selected = true;
			}

			return rows;
		}

		/** 
		* @method
		* @description
		* Assigns the sort values of the rows of the dialog
		* @param {IFindFieldDefinition} sortBy - field definition object used to set sort values
		*/
		protected SortRows = (sortBy: IFindFieldDefinition): void => {
			var self = this;
			self.ReverseSort = (sortBy.Sort === -1);

			self.Rows.forEach((row) => {
				if (sortBy.Sort === 0) {
					row.SortValDataByDefn();
				} else {
					row.SortValDataByDefn(sortBy);
				}
			});
		}

		/** 
		* @method
		* @description
		* Assigns filter found for each row of the dialog
		*/
		public Filter = () => {
			var self = this;

			var filterStr = self.FilterText.toLowerCase().trim();

			self.Rows.forEach((row: IFindRowInstance): void => {
				row.AssignFound(filterStr);
			});
		}

		/** 
		* @method
		* @description
		* Overrides the base method to returns the picked value.
		*/
		protected OkResult = (): any => {
			return this.Picked;
		}

		/** 
		* @method
		* @description
		* Assigns the picked value from the passed row instance object
		* @param {IFindRowInstance} pickedRow - the row instant that was picked
		*/
		public PickRow = (pickedRow: IFindRowInstance): any => {
			var self = this;
			self.Picked = pickedRow.Data;
			if (self.CloseOnPick) {
				self.Ok();
			}
			return self.Picked;
		}

	}

}