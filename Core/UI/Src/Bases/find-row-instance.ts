/// <reference path="../common-refs.d.ts" />

namespace Cmp.Ui.Bases {

	/** 
	* @interface
	* @description
	* Describes an instance object of a row for the modal find dialog servivce.
	*/
	export interface IFindRowInstance {
		Data: any;
		Fields: IFindFieldInstance[];
		SortVal: any;
		Selected: boolean;
		NotFound: boolean;
		AssignFound(matchStr: string): boolean;
		GetDataByDefn(defn: IFindFieldDefinition): any;
		SortValDataByDefn(defn?: IFindFieldDefinition): any;
	}

	/** 
	* @class
	* @description
	* Represents an instance of a row for the modal find dialog servivce.
	*/
	export class FindRowInstance implements IFindRowInstance {
		public Data: any;
		public Fields: IFindFieldInstance[] = [];
		public SortVal: any;
		public Selected: boolean;
		public NotFound: boolean;

		private _rowDefn: IFindRowDefinition;
		private _defaultSort: any;

		constructor(rowDefn: IFindRowDefinition, rawObj: any, initialSort?: any) {
			var self = this;
			self._rowDefn = rowDefn;
			self.AssignRaw(rawObj);
			self._defaultSort = initialSort;
			self.SortVal = self._defaultSort;
			self.Selected = false;
			self.NotFound = false;
		}

		/** 
		* @method
		* @description
		* Assigns the raw object to the row, this data will be used to populate the fields (columns)
		* @param {any} rawObj 
		* define this on the prototype so that all instances share one version of method in memory 
		*/
		private AssignRaw(rawObj: any) {
			var self = this;
			self.Data = rawObj;
			self._rowDefn.FieldDefns.forEach((fieldDef) => {
				var fldName = fieldDef.Name;
				self.Fields.push(fieldDef.MakeInstance(self.Data[fldName]));
			});
		}

		/** 
		* @method
		* @description
		* Finds a field instance for the passed field definition and returns the raw data of the field instance 
		* @param {IFindFieldDefinition} defn - a field definition
		* define this on the prototype so that all instances share one version of method in memory 
		*/
		public GetDataByDefn(defn: IFindFieldDefinition): any {
			var self = this;
			var field: IFindFieldInstance;
			for (var i = 0; i < self.Fields.length; i++) {
				field = self.Fields[i];
				if (field.Defn === defn) {
					return field.Data;
				}
			}
		}

		/** 
		* @method
		* @description
		* Finds a field instance for the passed field definition and returns the sort value
		* @param {IFindFieldDefinition} defn - a field definition
		* define this on the prototype so that all instances share one version of method in memory 
		*/
		public SortValDataByDefn(defn: IFindFieldDefinition): any {
			var self = this;

			if (defn) {
				self.SortVal = self.GetDataByDefn(defn);
			} else {
				self.SortVal = self._defaultSort;
			}

			return self.SortVal;
		}

		/** 
		* @method
		* @description
		* Loop through all the field instances and returns true when one is found that matches
		* @param {string} matchStr - the string value to match
		* define this on the prototype so that all instances share one version of method in memory 
		*/
		public AssignFound(matchStr: string): boolean {
			var self = this;

			var found = false;

			var field: IFindFieldInstance;
			for (var i = 0; i < self.Fields.length; i++) {
				field = self.Fields[i];
				if (field.Match(matchStr)) {
					found = true;
					break;
				}
			}

			self.NotFound = !found;
			return found;
		}
	}

}