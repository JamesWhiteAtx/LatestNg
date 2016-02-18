/// <reference path="../common-refs.d.ts" />
/// <reference path="base-find-field-definition.ts" />

namespace Cmp.Ui.Bases {

	/** 
	* @interface
	* @description
	* Describes the instance of a field (column) of modal find dialog row
	*/
	export interface IFindFieldInstance {
		Defn: IFindFieldDefinition;
		Data: any;
		Value: any;
		Display: string;
		Match(matchStr: string): boolean;
	}

	/** 
	* @class
	* @description
	* The instance of a field (column) of modal find dialog row
	*/
	export class FindFieldInstance implements IFindFieldInstance {
		public Defn: IFindFieldDefinition;
		public Data: any;
		public Value: any;
		public Display: string;
		private _filterCompare: string;

		constructor(rawObj: any, defn: IFindFieldDefinition) {
			var self = this;
			self.Defn = defn;
			self.Data = rawObj;
			if (defn.IsText) {
				self.Display = defn.TextValue(rawObj);
			} else {
				self.Value = defn.Value(rawObj);
			}
		}

		/** 
		* @method
		* @description
		* Returns true if the passed match string matches the display value
		* @param {string} matchStr - string value to match 
		*/
		/** define this on the prototype so that all instances share one version of method in memory */
		public Match(matchStr: string): boolean {
			var self = this;
			if (Cmp.Js.IsNullOrUndefined(self.Display)) {
				return false;
			} else {
				if (Cmp.Js.IsNullOrUndefined(self._filterCompare)) {
					self._filterCompare = self.Display.toLowerCase().trim();
				}
				return (self._filterCompare.indexOf(matchStr) !== -1);
			}
		}

	}

}