/// <reference path="../common-refs.d.ts" />
/// <reference path="services-module.ts" />

namespace Cmp.Ui.Services {    
	/**
	 * Interface for hash object returned by Angular's $$cookieReader service
	 * @interface
	 */
	export interface ICookieHash {
        [key: string]: string;
    }

	/**
	 * Interface for function that returns ICookieHash interface
	 * @interface
	 */
    export interface ICookieReaderFunc {
        (): ICookieHash;
    }

	/**
	 * Service class to read values from cookies.
	 * @class
	 */
    export class CookieReaderService {
        private _$$cookieReader: ICookieReaderFunc;
		/**
		 * Creates CookieReaderService and sets private $$cookieReader 
		 * @constructor
		 * @param {string} $$cookieReader - Injected Angular cookie reader service.
		 */

        /*@ngInject*/
        constructor($$cookieReader: ICookieReaderFunc) {
            this._$$cookieReader = $$cookieReader;
        }

		/**
		 * Gets the string value of cookies
		 * @method
		 * @param {string} key - name of the cookie.
		 * @returns {string}
		 */
        public GetKey(key: string): string {
            return this._$$cookieReader()[key];
        }

		/**
		 * Returns a deserialized object of type T from a cookie. If the cookie read does not
		 * generate a string, or the deserialization fails, null is returned.
		 * @method
		 * @param {string} key - name of the cookie.
		 * @returns {Object} 
		 */
        public GetObject<T>(key: string): T {
            var self = this;
            var value: string = self.GetKey(key);

            if (angular.isString(value)) {
                try {
                    return <T>angular.fromJson(value)
                } catch (e) {
                    return null;
                }
            } else {
                return null;
            }
        }

    }
    angular
        .module('cmp.ui.services')
        .service('cookieReader', CookieReaderService);
}