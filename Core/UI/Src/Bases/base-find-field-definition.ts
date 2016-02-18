/// <reference path="../common-refs.d.ts" />
/// <reference path="find-field-instance.ts" />
/// <reference path="find-row-definition.ts" />
/// <reference path="../app/cmp-app-info.ts" />

import IFindFieldInstance = Cmp.Ui.Bases.IFindFieldInstance;

namespace Cmp.Ui.Bases {

	export enum DisplayType { Text, Boolean };
	export enum DisplayAlignment { Left, Center, Right };

	/** 
	* @interface
	* @description
	* Describes the definition of a field (column) of a modal fid dialog.
	*/
	export interface IFindFieldDefinition {
		RowDefn: IFindRowDefinition;
		Name: string;
		Type: string;
		Title: string;
		Width: number;
		Right: boolean;
		Center: boolean;
		Sort: number;
		Filterable: boolean;
		IsText: boolean;
		IsBool: boolean;
		Value(rawObj: any): any;
		TextValue(rawObj: any): string;
		UnSort(): void;
		SortToggle(): number;
		MakeInstance(rawObj: any): IFindFieldInstance;
	}

	/** 
	* @interface
	* @description
	* Describes a service used to return a formatter function
	*/
	export interface IFormatService {
        (formatName: string): Function;
    }

	/** 
	* @interface
	* @description
	* Describes the configuration settings object of a definition of a field (column) of a modal fid dialog
	*/
	export interface IFindFieldConfig {
        name: string;
        /** will be run through translate  */
		title: string;
        /** This is the number of bootstrap grid columns this column should take up */
		width: number;
		filterable?: boolean;
		formatter?: IFormatService;
		formatString?: string;
	}

	/** 
	* @interface
	* @description
	* Describes the configuration settings object of a definition of a number field (column) of a modal fid dialog
	*/
	export interface IFindNumberFieldConfig extends IFindFieldConfig {
		decimals?: number
	}

	/** 
	* @class
	* @description
	* Base class of all definition objects of a field (column) of a modal fid dialog.
	*/
	export class BaseFindFieldDefinition implements IFindFieldDefinition {
		public Name: string;
		public Type: string;
		public Title: string;
		public Width: number;
		public Sort: number;
		public FormatString: string;

		protected _rowDefn: IFindRowDefinition;
		protected _filterable: boolean;
		protected _displayType: DisplayType;
		protected _alignment: DisplayAlignment;

		constructor(type: string, configParam: IFindFieldConfig) {
			var self = this;
			self.Type = type;

			self.Name = configParam.name;
			self.Title = configParam.title;
			self.Width = configParam.width;
			self._filterable = !!configParam.filterable;

			self.Sort = 0;
			self._displayType = DisplayType.Text;
			self._alignment = DisplayAlignment.Left;
			self.FormatString = configParam.formatString;
		}

		/** 
		* @getter
		* @description
		* Indicates if the field is filterable
		*/
		public get Filterable(): boolean {
			return this._filterable;
		}

		/** 
		* @method
		* @description
		* Indicates if the field is rendered a text
		*/
		public get IsText(): boolean {
			return (this._displayType === DisplayType.Text);
		}

		/** 
		* @method
		* @description
		* Indicates if the field is represents a boolean value
		*/
		public get IsBool(): boolean {
			return (this._displayType === DisplayType.Boolean);
		}

		/** 
		* @method
		* @description
		* Indicates if the field is rendered right justified
		*/
		public get Right(): boolean {
			return (this._alignment === DisplayAlignment.Right);
		}

		/** 
		* @method
		* @description
		* Indicates if the field is rendered center justified
		*/
		public get Center(): boolean {
			return (this._alignment === DisplayAlignment.Center);
		}

		/** 
		* @getter
		* @description
		* Gets the row definition object for this instance
		*/
		public get RowDefn(): IFindRowDefinition {
			return this._rowDefn;
		}

		/** 
		* @method
		* @description
		* Sets the row definition object for this instance
		*/
		public set RowDefn(defn: IFindRowDefinition) {
			this._rowDefn = defn;
		}

		/** 
		* @method
		* @description
		* Makes the text display value based on the raw object 
		*/
		protected MakeTextDisplayValue = (rawObj: any): string => {
			return rawObj ? rawObj.toString() : null;
		}

		/** 
		* @method
		* @description
		* Returns the text display value based on the raw object 
		*/
		public TextValue = (rawObj: any): string => {
			return this.MakeTextDisplayValue(rawObj);
		};

		/** 
		* @method
		* @description
		* Returns the display value based on the raw object 
		*/
		protected MakeDisplayValue = (rawObj: any): any => {
			return rawObj;
		}

		/** 
		* @method
		* @description
		* Returns the display value based on the raw object 
		*/
		public Value = (rawObj: any): any => {
			return this.MakeDisplayValue(rawObj);
		};

		/** 
		* @method
		* @description
		* Creates an instance of a modal find dialog field based on the passed raw value
		*/
		public MakeInstance = (rawObj: any): IFindFieldInstance => {
			var self = this;
			var instance = new FindFieldInstance(rawObj, self);
			return instance;
		}

		/** 
		* @method
		* @description
		* Sets the sorted value to 0, unsorted
		*/
		public UnSort = (): void => {
			this.Sort = 0;
		}

		/** 
		* @method
		* @description
		* Toggles the sorted value to next sort value
		*/
		public SortToggle = (): number => {
			var self = this;

			switch (self.Sort) {
				case 0:
					self.Sort = 1;
					break;
				case 1:
					self.Sort = -1;
					break;
				case -1:
					self.Sort = 0;
					break;
				default:
					self.Sort = 0;
			}

			self.RowDefn.SortBy(self);

			return self.Sort;
		}
	}

	/** 
	* @interface

	* @description
	* Describes a find field class that can be created with the new keyword
	*/
	export interface IFindFieldDefinitionConstructable {
		new (configParam: IFindFieldConfig): IFindFieldDefinition;
	}

	/** 
	* @class
	* @description
	* Definition of a string field (column) of a modal fid dialog.
	*/
	export class FindStringField extends BaseFindFieldDefinition {
		constructor(configParam: IFindFieldConfig) {
			super('string', configParam);
		}

		/** 
		* @method
		* @description
		* Returns the text display value for a string field
		*/
		protected MakeTextDisplayValue = (rawObj: string): string => {
			return angular.isString(rawObj) ? rawObj.trim() : null;
		}
	}

	/** 
	* @class
	* @description
	* Definition of a date field (column) of a modal fid dialog. 
	*/
	export class FindDateField extends BaseFindFieldDefinition {
		constructor(configParam: IFindFieldConfig) {
			super('date', configParam);
		}

		/** 
		* @method
		* @description
		* Returns the text display value for a date field
		*/
		protected MakeTextDisplayValue = (rawObj: Date): string => {
			var format = this.FormatString;
			return rawObj ? moment(rawObj).format(format && format.length ? format : 'M/D/YYYY') : null;
		}
	}

	/** 
	* @class
	* @description
	* Definition of a date time field (column) of a modal fid dialog.
	*/
	export class FindDateTimeField extends FindDateField {

		/** 
		* @method
		* @description
		* Returns the text display value for a date time field
		*/
		protected MakeTextDisplayValue = (rawObj: Date): string => {
			var format = this.FormatString;
			return rawObj ? moment(rawObj).format(format && format.length ? format : 'M/D/YYYY hh:mm A') : null;
		}
	}

	/** 
	* @class
	* @description
	* Definition of a number field (column) of a modal fid dialog.
	*/
	export class FindNumberField extends BaseFindFieldDefinition {
		protected _decimals: number;

		constructor(configParam: IFindNumberFieldConfig) {
			super('number', configParam);
			var self = this;
			self._decimals = configParam.decimals;
			self._alignment = DisplayAlignment.Right;
		}

		/** 
		* @method
		* @description
		* Returns the text display value for a number field
		*/
		protected MakeTextDisplayValue = (rawObj: number): string => {
			var self = this;
			return rawObj
				? (angular.isNumber(self._decimals) ? rawObj.toFixed(this._decimals) : rawObj.toString())
				: null;
		}
	}

	/** 
	* @class
	* @description
	* Definition of a currencey field (column) of a modal fid dialog. 
	*/
	export class FindCurrencyField extends FindNumberField {
		protected _formatFcn: Function;

		constructor(configParam: IFindNumberFieldConfig) {
			super(configParam);
			var self = this;
			if (!angular.isNumber(self._decimals)) {
				self._decimals = 2;
			}

			if (configParam.formatter) {
				self._formatFcn = configParam.formatter('currency');
			}

		}

		/** 
		* @method
		* @description
		* Returns the text display value for a currency field
		*/
		protected MakeTextDisplayValue = (rawObj: number): string => {
			var self = this;
			if (self._formatFcn) {
				return self._formatFcn(rawObj, void 0, self._decimals);
			} else {
				return rawObj ? rawObj.toFixed(self._decimals) : null;
			}
		}
	}

	/** 
	* @class
	* @description
	* Definition of a boolean field (column) of a modal fid dialog. 
	*/
	export class FindBooleanField extends BaseFindFieldDefinition { 
		constructor(configParam: IFindFieldConfig) {
			super('boolean', configParam);
			var self = this;
			self._displayType = DisplayType.Boolean;
			self._alignment = DisplayAlignment.Center;
			//** override _filterable to always be false, otherwise how do you search boolean
			self._filterable = false;
		}

		/** 
		* @method
		* @description
		* Returns the text display value for a boolean field
		*/
		protected MakeDisplayValue = (rawObj: any): any => {
			return Cmp.Js.Boolify(rawObj);
		}
	}

	

}