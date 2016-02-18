/// <reference path="../common-refs.d.ts" />
/// <reference path="base-find-field-definition.ts" />
/// <reference path="find-row-instance.ts" />

namespace Cmp.Ui.Bases {

	/** 
	* @interface
	* @description
	* Describes the type of object used to define the rows of a modal find dialog
	*/
	export interface IFindRowDefinition {
		FieldDefns: IFindFieldDefinition[];
		AddFieldDefn(fieldDefn: IFindFieldDefinition): IFindRowDefinition;
		StringField(configParam: IFindFieldConfig): IFindRowDefinition;
		DateField(configParam: IFindFieldConfig): IFindRowDefinition;
		DateTimeField(configParam: IFindFieldConfig): IFindRowDefinition;
		NumberField(configParam: IFindFieldConfig): IFindRowDefinition;
		CurrencyField(configParam: IFindFieldConfig): IFindRowDefinition;
		BooleanField(configParam: IFindFieldConfig): IFindRowDefinition;
		SortBy(sortBy: IFindFieldDefinition): void;
		MakeRowInstance(rawObj: any, initialSort?: any): IFindRowInstance;
		RowSortCallback: Function;
	}

	/** 
	* @class
	* @description
	* The defintion of the rows of a modal find dialog
	*/
	export class FindRowDefinition implements IFindRowDefinition {
		protected _fieldDefns: IFindFieldDefinition[] = [];
		protected _rowSortCallback: Function;
		private _$filter: angular.IFilterService;
        private _$translate: angular.translate.ITranslateService;
		constructor($filter?: angular.IFilterService,
			$translate?: angular.translate.ITranslateService) {
			var self = this;
			self._$filter = $filter;
			self._$translate = $translate;
		}

		/** 
		* @setter
		* @description
		* Assigns the row sort callback function
		* @param {Function} rowSortCallback - callback function
		*/
		public set RowSortCallback(rowSortCallback: Function) {
			this._rowSortCallback = rowSortCallback;
		}

		/** 
		* @gettter
		* @description
		* Gets the row sort callback function
		*/
		public get RowSortCallback(): Function {
			return this._rowSortCallback;
		}

		/** 
		* @getter
		* @description
		* Gets the list of field defintion objects
		*/
		public get FieldDefns(): IFindFieldDefinition[] {
			return this._fieldDefns;
		}

		/** 
		* @method
		* @description
		* Adds a field defintion object to the list of field defintion objects
		* @param {IFindFieldDefinition} fieldDefn
		*/
		public AddFieldDefn = (fieldDefn: IFindFieldDefinition): IFindRowDefinition => {
			var self = this;

			fieldDefn.RowDefn = self;
			self.FieldDefns.push(fieldDefn);

			return self;
		}

		/** 
		* @method
		* @description
		* Creates a new field defintion for the passed class and adds it to the list of field defintion objects
		* @param {IFindFieldDefinitionConstructable} fieldDefnClass - class of field defintion
		* @param {IFindFieldConfig} configParam - configuration parameter
		*/
        public MakeFieldDefn = (fieldDefnClass: IFindFieldDefinitionConstructable, configParam: IFindFieldConfig): IFindRowDefinition => {
			var self = this;

			if (self._$filter && !configParam.formatter) {
				configParam.formatter = self._$filter;
			}

			self.AddFieldDefn(new fieldDefnClass(configParam));
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a new string field defintion and adds it to the list of field defintion objects
		* @param {IFindFieldConfig} configParam - configuration parameter
		*/
		public StringField = (configParam: IFindFieldConfig): IFindRowDefinition => {
			var self = this;
			self.MakeFieldDefn(Cmp.Ui.Bases.FindStringField, configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a new date field defintion and adds it to the list of field defintion objects
		* @param {IFindFieldConfig} configParam - configuration parameter
		*/
		public DateField = (configParam: IFindFieldConfig): IFindRowDefinition => {
			var self = this;
			configParam.formatString = self._$translate ? self._$translate.instant('Core$MomentFullDateString') : undefined;
			self.MakeFieldDefn(Cmp.Ui.Bases.FindDateField, configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a new date time field defintion and adds it to the list of field defintion objects
		* @param {IFindFieldConfig} configParam - configuration parameter
		*/
		public DateTimeField = (configParam: IFindFieldConfig): IFindRowDefinition => {
			var self = this;
			configParam.formatString = self._$translate ? self._$translate.instant('Core$MomentFullDateTimeString') : undefined;
			self.MakeFieldDefn(Cmp.Ui.Bases.FindDateTimeField, configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a new number field defintion and adds it to the list of field defintion objects
		* @param {IFindFieldConfig} configParam - configuration parameter
		*/
		public NumberField = (configParam: IFindNumberFieldConfig): IFindRowDefinition => {
			var self = this;
			self.MakeFieldDefn(Cmp.Ui.Bases.FindNumberField, configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a new currency field defintion and adds it to the list of field defintion objects
		* @param {IFindFieldConfig} configParam - configuration parameter
		*/
		public CurrencyField = (configParam: IFindNumberFieldConfig): IFindRowDefinition => {
			var self = this;
			self.MakeFieldDefn(Cmp.Ui.Bases.FindCurrencyField, configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Creates a new boolean field defintion and adds it to the list of field defintion objects
		* @param {IFindFieldConfig} configParam - configuration parameter
		*/
		public BooleanField = (configParam: IFindFieldConfig): IFindRowDefinition => {
			var self = this;
			self.MakeFieldDefn(Cmp.Ui.Bases.FindBooleanField, configParam);
			return self;
		}

		/** 
		* @method
		* @description
		* Unsorts all of other fields in the row and calles the rw sort callback function
		* @param {IFindFieldDefinition} sortBy - the field definition to sort by
		*/
		public SortBy = (sortBy: IFindFieldDefinition): void => {
			var self = this;
			self.UnsortOthers(sortBy);
			if (self._rowSortCallback) {
				self._rowSortCallback(sortBy);
			}
		}

		/** 
		* @method
		* @description
		* Unsorts all of the other field defintions for the row.
		* @param {IFindFieldDefinition} sortBy - the field definition to sort by
		*/
		protected UnsortOthers = (sortBy: IFindFieldDefinition) => {
			var self = this;
			self.FieldDefns.forEach((fieldDefn: IFindFieldDefinition) => {
				if (fieldDefn !== sortBy) {
					fieldDefn.UnSort();
				}
				fieldDefn.RowDefn = self;
			});
		}

		/** 
		* @method
		* @description
		* Creates a new instance of a row for the passed 
		* @param {any} rawObj - data used to populate the new instance.
		* @param {any} initialSort - initial sort value   
		*/
		public MakeRowInstance = (rawObj: any, initialSort?: any): IFindRowInstance => {
			var self = this;

			var rowInstance: IFindRowInstance = new FindRowInstance(self, rawObj, initialSort);

			return rowInstance;
		}
	}

}