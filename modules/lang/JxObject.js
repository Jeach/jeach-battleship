/*
 * Copyright (C) 2023 Christian Jean
 * All rights reserved.
 *
 * CONFIDENTIAL AND PROPRIETARY INFORMATION!
 *
 * Disclosure or use in part or in whole without prior written consent
 * constitutes an infringement of copyright laws which may be punishable
 * by law.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL
 * THE LICENSOR OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const JxLogger = require('../utils/JxLogger');
const JxValidate = require('./JxValidate');

/**
 * The module will provide general helper functionalities for operations
 * an Oject.
 *
 * @author Christian Jean
 * @date   2023.03.05
 */
var JxObject = (function () {
   //-------------------------------------------------------------------
   // Module variables
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxObject';
   const MODULE_VERSION = '2.2.1';

   const MODULE_HASHCODE = generateRandomHashcode();

   //-------------------------------------------------------------------
   // Private variables
   //-------------------------------------------------------------------

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.WARN);

   //-------------------------------------------------------------------
   // Constructor
   //-------------------------------------------------------------------

   init.apply(null, arguments);

   /**
    * Initialize our module.
    *
    * @author Christian Jean
    * @since  2023.03.05
    */
   function init() {
      log.info("Initializing '" + MODULE_NAME + "' module");

      log.debug(' >> Version  : ' + getVersion());
      log.debug(' >> Hashcode : ' + getHashcode());
      log.debug(' >> Args     : ' + arguments.length);
   }

   //-------------------------------------------------------------------
   // Private module functions
   //-------------------------------------------------------------------

   /**
    * Provide a unique ID for this instance.
    *
    * @param {Number} maximum length of ID to return (optional).
    *
    * @returns {String} the ID representation of this instance.
    */
   function getHashcode(max) {
      let id = MODULE_HASHCODE;
      if (max && typeof max === 'number') {
         if (max < 4) max = 4;
         if (max > id.length) max = id.length;
         id = MODULE_HASHCODE.substring(0, max);
      }
      return id;
   }

   /**
    * Will generate a random SHA1 hashcode.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {String} of a SHA1 hashcode.
    */
   function generateRandomHashcode() {
      return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         var r = (Math.random() * 16) | 0;
         return r.toString(16);
      });
   }

   /**
    * Provides the name of this module.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {String} The name of this module.
    */
   function getName() {
      return MODULE_NAME;
   }

   /**
    * Provides the module version number represented as a three-digit
    * sequence delimited by decimals (ie: '1.2.3').
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {String} the module version number.
    */
   function getVersion() {
      return MODULE_VERSION;
   }

   /**
    * Provides this module's reference.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {Object} the module object reference.
    */
   function getObject() {
      return this;
   }

   /**
    * Provide a string representation of this instance.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {String} a string representation of this object.
    */
   function toString() {
      let status = [];

      status.push('version: ' + getVersion());

      var text = getName() + '@' + getHashcode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //---------------------------------------------------------------------------------------------
   // Private domain functions
   //---------------------------------------------------------------------------------------------

   /**
    * Will determine if the object is of a specific named instance type.
    *
    * Example:
    *
    *    let fileList = new FileList();
    *    let file = fileList[0]; // is a 'File' type
    *
    *    JxObject.instanceOf(fileList, 'FileList');   // true
    *    JxObject.instanceOf(fileList, 'File');       // false
    *    JxObject.instanceOf(file, 'File');           // true
    *    JxObject.instanceOf(file, 'FileList');       // false
    *
    * Note that a 'File' inherits from a 'Blob'. So when calling this
    * function, it is important that you understand the distinction
    * between calling it with an Object or with a String, such as:
    *
    *    file instanceof File    // true
    *    file instanceof Blob    // true
    *
    *    JxObject.instanceOf(file, 'File');  // true
    *    JxObject.instanceOf(file, 'Blob');  // false
    *
    *    JxObject.instanceOf(file, File);    // true
    *    JxObject.instanceOf(file, Blob);    // true
    *
    * @param {Object} obj to compare with.
    * @param {String|Object} type of the instance.
    */
   function isInstanceOf(obj, type) {
      log.info('Is object instance of');

      let b = false;

      log.debug(' >> Object type    : ' + typeof obj);
      log.debug(" >> Comparing with :  '" + type + "' (as a '" + typeof type + "')");

      if (JxValidate.isString(type)) {
         let name = getInstanceName(obj);
         log.debug(" >> Object name : '" + name + "'");
         b = type == name;
      } else if (JxValidate.isObject(type)) {
         b = obj instanceof type;
      }

      log.debug(' >> Compare result : ' + b);

      return b;
   }

   /**
    * Will merge two objects together.
    *
    * Where 'obj1' is the source, and 'obj2' is the override which will
    * be added to 'obj1' if they don't exist, or override them if they do.
    *
    * @since   1.0, 2021.07.12
    * @author  Christian Jean
    *
    * @see merge https://www.npmjs.com/package/merge
    *
    * @param {object} obj1 is the source object to be merged with.
    * @param {object} obj2 is the overides object to be merged into.
    *
    * @return  A merged options object.
    */
   function merge(obj1, obj2) {
      log.info('Merging two objects together');

      var final = {};

      log.debug(' >> Before: ' + JSON.stringify(obj1));
      var final = merge.recursive(true, obj2, obj1);
      log.debug(' >> Merged: ' + JSON.stringify(final));

      return final;
   }

   /**
    * Determine if 'obj' has a property of the specified 'name'.
    *
    * This is similar to 'obj.hasOwnProperty(name)', but on top of full validation and logging,
    * the actual value is also returned.
    *
    * @author  Christian Jean
    * @since   v1.1, 2021.05.21
    *
    * @see hasKey which only checks for the existance of a key/property.
    *
    * @param {Object} obj is the object to seek property.
    * @param {String} name is the property name.
    *
    * @returns the property value.
    */
   function getProperty(obj, name) {
      var value = null;

      log.info('Get object property');
      log.debug(' >> Object type    : ' + typeof obj);
      log.debug(" >> Property name  : '" + name + "'");

      if (JxValidate.isObject(obj) && obj.hasOwnProperty(name)) {
         value = obj[name];
      }

      log.debug(' >> Property value : ' + value + " (type '" + typeof value + "')");

      return value;
   }

   /**
    * Will check to see if the specified object has the named property.
    *
    * @see hasKey which does the exact same functionality.
    *
    * @param {Object} obj to use for property ckeckup.
    * @param {String} name of the property to check for.
    *
    * @returns 'true' if the property exists, 'false' otherwise.
    */
   function hasProperty(obj, name) {
      return getProperty(obj, name) != null;
   }

   /**
    * This is similar to 'getProperty(obj, name)' except that it can also
    * validate if the propery is of a specific data type.
    *
    * If the property does not exist, a 'null' value will be returned.
    *
    * If the property does exist and is also one of the specified types, then
    * it's value will be returned.
    *
    * If the property does exist but is not one of the specified types, then
    * a 'null' value will be returned.
    *
    * Note that multiple types can be specified at a time, such as:
    *
    *    "snbu"  // Check for: string, number, boolean or UUID
    *
    * @author  Christian Jean
    * @since   v1.1, 2021.05.21
    *
    * @see getProperty which gets a property of any type (no type validation).
    * @see JxValidate.isTypes which allows to validate a types string.
    *
    * @returns the property value
    */
   function getPropertyOfType(obj, name, types) {
      log.info('Get object property of type');
      var value = getProperty(obj, name);
      if (!value) return value;
      log.debug(" > Type  : '" + types + "'");
      if (!JxValidate.isTypes(types, value)) return null;
      return value;
   }

   /**
    * Will get the object instance type (name).
    *
    * @see getType which is similar.
    *
    * @param {Object} obj to get instance type for.
    */
   function getInstanceName(obj) {
      return obj ? obj.constructor.name : 'null';
   }

   /**
    * Check to determine if two objects are equal.
    *
    * It's easy to check for equality with JavaScript primitives, like
    * numbers and strings.
    *
    * But checking for equality between arrays and objects is a bit more
    * difficlut. Fortunately, theres this function which offers to use
    * 'JSON.stringify()' to convert arrays or objects into JSON strings
    * for comparison. If all the elements match, this will return a value
    * of 'true', otherwise 'false' will be returned.
    *
    * Be warned that the order of the array elements or the object properties
    * will matter.
    *
    * @param {Object} a an object or an array to compare.
    * @param {Object} b an object or an array to compare.
    *
    * @returns
    */
   function areEqual(a, b) {
      return JSON.stringify(a) === JSON.stringify(b);
   }

   /**
    * Will determine if the object is 'even'.
    *
    * If parameter 'obj' is:
    *
    *    1. An Array, will check if its length is even.
    *    2. A Number, will check if its length is even.
    *    3. A String, will check if its length is even.
    *    4. A Buffer, will check if its length is even.
    *    5. An Object, will check if its length of keys is even.
    *
    * @param {*} obj to validate if it is even.
    *
    * @returns 'true' if even, 'false' otherwise.
    */
   function isEven(obj) {
      log.info("Checking if object is 'even' or 'odd'");

      if (!obj) throw 'Invalid object provided';

      let cnt = null;

      if (JxValidate.isArray(obj)) cnt = obj.length;
      else if (JxValidate.isNumber(obj)) cnt = obj;
      else if (JxValidate.isString(obj)) cnt = obj.length;
      else if (JxValidate.isBuffer(obj)) cnt = obj.length;
      else if (JxValidate.isObject(obj)) cnt = Object.keys(obj).length;
      else throw 'Unable to verify even/odd for this type of object.';

      return cnt % 2 === 0;
   }

   /**
    * Will determine if the object is 'odd'.
    *
    * If parameter 'obj' is:
    *
    *    1. An Array, will check if its length is odd.
    *    2. A Number, will check if its length is odd.
    *    3. A String, will check if its length is odd.
    *    4. A Buffer, will check if its length is odd.
    *    5. An Object, will check if its length of keys is odd.
    *
    * @param {*} obj to validate if it is odd.
    *
    * @returns 'true' if odd, 'false' otherwise.
    */
   function isOdd(obj) {
      return !isEven(obj);
   }

   /**
    * Will count the number of occurence for each value requested.
    *
    * TODO: Not tested!
    *
    * Example 1:
    *
    *    getOccurences(array, 12);      // { value: 12, occurence: 3 }
    *    getOccurences(array, 33, 55);  // { value: 33, occurence: 5, value: 55, occurence: 13 }
    *
    *    getOccurences(array, 33, 55, 66, 77, ...);
    *    getOccurences(array, [33, 55, 66, 77, ...]);
    *
    * Example 2:
    *
    *    const pollResponses = [ "Yes", "Yes", "No", "No", "Yes", "No" ];
    *
    *    const response = "Yes";    *
    *    getOccurrences(pollResponses, response); // 3
    *
    * @param {Array} array to get occurences from.
    * @param  {...values} values a variable length of values.
    *
    * @returns an array of ocurence counts for each value requested.
    */
   function getOccurences(array, ...values) {
      let results = [];

      values.forEach((value, idx) => {
         let oc = array.reduce((a, v) => (v === value ? a + 1 : a), 0);
         results.push({ value: value, occurence: oc });
      });

      return results;
   }

   /**
    * This allows to insert a new item at a precise location in an array.
    *
    * TODO: Not yet tested!
    *
    * Example:
    *
    *    const items = [1, 2, 4, 5];
    *
    *    // insert the number 3 at index 2:
    *
    *    insert(items, 2, 3); // [1, 2, 3, 4, 5]
    *
    * @author  Christian Jean
    * @since   2.2.0
    *
    * @param {Array} array to insert an item into.
    * @param {Number} index the zero-based position where we will insert the item.
    * @param {*} item an object to be inserted into the array.
    *
    * @returns a new array with the insertion.
    */
   function insertAt(array, index, item) {
      return (array, index, item) => [...array.slice(0, index), item, ...array.slice(index)];
   }

   /**
    * An async/await sleep function.
    *
    * @param {Number} milliseconds
    */
   async function sleep(milliseconds) {
      return new Promise((resolve) => {
         setTimeout(resolve, milliseconds);
      });
   }

   /**
    * A convenient way to print various data types.
    *
    * @param {Object} object to print to console
    */
   function print(object) {
      if (Array.isArray(object)) {
         for (e in object) {
            console.log(e.padStart(3, '0') + ': ' + JSON.stringify(object[e]));
         }
      } else {
         console.log(JSON.stringify(object, null, 3));
      }
      return object;
   }

   function print2(obj, prefix, depth = Number.MAX_SAFE_INTEGER) {
      let list = obj;

      if (depth < 0) return;

      if (JxValidate.isObject(list)) {
         list = listify(obj);
      }

      if (JxValidate.isArray(obj)) {
         list.forEach((item, idx) => {
            if (JxValidate.isObject(item.value)) {
               print2(item.value, '  ' + prefix, depth - 1);
            } else {
               log.print(prefix + item.label + ': ' + item.value);
            }
         });
      }
   }

   /**
    * Accepts an object, for which we will produce an array of 'label/values'
    * where each label will have been pre-formatted to the longest length of
    * the object keys.
    *
    * Example:
    *
    *    {
    *       "one": 1,
    *       "two": 2,
    *       "three": 3,
    *       "four": 4
    *    }
    *
    * Would produce an array of objects:
    *
    *    [
    *       { label: "one  ", value: 1 }
    *       { label: "two  ", value: 2 }
    *       { label: "three", value: 3 }
    *       { label: "four ", value: 4 }
    *    ]
    *
    * @param {Object} obj
    */
   function listify(obj) {
      let keys = Object.keys(obj);

      let max = 0;

      keys.forEach((key, idx) => {
         if (key.length > max) max = key.length;
      });

      let list = [];

      keys.forEach((key, idx) => {
         list.push({
            label: key + ' '.repeat(max - key.length),
            value: obj[key],
         });
      });

      return list;
   }

   /**
    * Will print to screen using 'log.print()' the listified object or array.
    *
    * @param {Object|Array} list to be printed.
    * @param {String} prefix
    */
   function printListify(list, prefix = '   >> ') {
      log.info('Printing a listified list');

      if (JxValidate.isObject(list)) {
         log.debug(' >> Converting object to listified list');
         list = listify(list);
      }

      if (JxValidate.isArray(list)) {
         list.forEach((item, idx) => {
            if (JxValidate.isString(item.value)) log.print(prefix + item.label + ' : ' + item.value);
            // if (JxValidate.isObject(item.value)) log.print(prefix + item.label + ' : ' + JSON.stringify(item.value, null, 3));
            // if (JxValidate.isObject(item.value)) printListify(item.value, '  ' + prefix);
         });
      }
   }

   /**
    * Will sort the elements in the array, per the sort algorithm (function)
    * provided.
    *
    * If no function is provided, will assume all data elements are primitives:
    *
    *    a) String
    *    b) Number
    *    c) Date
    *
    * Sort an array of primitives, you would simply call it as such:
    *
    *    let sortedList = JxObject.sort(listOfStrings);
    *    let sortedList = JxObject.sort(listOfNumbers);
    *    let sortedList = JxObject.sort(listOfDates);
    *
    * If the list contains custom objects, the following would be used:
    *
    *    let sortedList = JxObject.sort(listOfObjects, (e1, e2) => {
    *       return e2.percent - e1.percent;
    *    });
    *
    *    let sortedList = JxObject.sort(profiles, (e1, e2) => {
    *       return e2.hired.start_date - e1.hired.start_date;
    *    });
    *
    * TODO: Validate that native sort works for Date objects.
    *
    * @param {Array} array is an array object to sort.
    * @param {Function} sortFunction is the sort function to apply.
    * @param {String} locale an optional locale (ie: 'en-US' is default).
    *
    * @returns a sorted array
    */
   function sort(array, sortFunction, locale = 'en-US') {
      let fn = null;

      log.trace('Sorting an array');

      if (!Array.isArray(array)) return null;
      if (array.length < 2) return array;

      if (JxValidate.isFunction(sortFunction)) fn = sortFunction;

      log.debug(' >> Array length  : ' + array.length);
      log.debug(' >> Sort function : ' + (fn ? 'yes' : 'no'));

      if (fn) {
         log.debug(' >> Applying custom sort');
         array.sort(fn);
      } else {
         log.debug(' >> Applying native sort');
         if (JxValidate.isString(array[0])) {
            array.sort((e1, e2) => {
               return e1.localeCompare(e2, locale);
            });
         } else if (JxValidate.isDate(array[0])) {
            array.sort((e1, e2) => {
               return e1.getTime() - e2.getTime();
               // return e1.toISOString().localeCompare(e2.toISOString(), locale);
            });
         } else {
            array.sort((e1, e2) => {
               return e1 - e2;
            });
         }
      }

      return array;
   }

   /**
    * Will make the elements in the array/list unique.
    *
    * @param {Array} array is an array object to sort.
    * @param {Function} filterFunction is the filtering function to apply.
    *
    * @returns a unique array
    */
   function unique(array, filterFunction) {
      let fn = null;
      let before = 0;
      let after = 0;

      log.trace('Making array unique');

      if (!Array.isArray(array)) return null;
      if (array.length < 2) return array;

      if (JxValidate.isFunction(filterFunction)) fn = filterFunction;

      before = array.length;

      log.debug(' >> Array length    : ' + before);
      log.debug(' >> Filter function : ' + (fn ? 'yes' : 'no'));

      if (fn) {
         log.debug(' >> Applying custom filter');
         array.filter(fn);
      } else {
         log.debug(' >> Applying native filter');
         array = array.filter((value, index, array) => {
            return array.indexOf(value) === index;
         });
      }

      after = array.length;

      log.debug(' >> Array length    : ' + after);
      log.debug(' >> Removed items   : ' + (before - after));

      return array;
   }

   /**
    * Create a unique and sorted list of entries, which will also provide
    * a count for each entry.
    *
    * Example:
    *
    *    [
    *       { entry: "bar", count: 22 },
    *       { entry: "baz", count: 9 },
    *       { entry: "foo", count: 17 },
    *       ...
    *    ]
    *
    * The default properties will be named "entry" and "count" respectively.
    *
    * If one wishes to override these values, it can be done by providing them
    * in the function call.
    *
    * @param {Array} dataList is the array of data to use.
    * @param {String} entryName is the property representing the value.
    * @param {String} countName is the property representing the count.
    *
    * @return a new unique and sorted list having a count for each entry.
    */
   function countedList(dataList, entryName = 'entry', countName = 'count') {
      let list = [];

      if (!JxValidate.isArray(dataList)) throw JxValidate.invalidType(dataList, 'dataList', 'Array');
      if (!JxValidate.isString(entryName)) throw JxValidate.invalidType(entryName, 'entryName', 'String');
      if (!JxValidate.isString(countName)) throw JxValidate.invalidType(countName, 'countName', 'String');

      let uniqueData = JxObject.unique(dataList);
      let sortedData = JxObject.sort(uniqueData);

      sortedData.forEach((val, idx) => {
         let entry = {};
         let start = dataList.length;
         let obj = countValues(dataList, val);
         let end = dataList.length;
         entry[entryName] = val;
         entry[countName] = obj.count;
         dataList = obj.list;
         list.push(entry);
      });

      return list;
   }

   /**
    * Get an object's type by name.
    *
    * The main distinction of this function compared to JavaScripts native
    * types is that it will always attempt to resolve '1' and '3' to Integer
    * and '3.4' and '5.6' to Double instead of the Number type.
    *
    * @param {Object} obj is the object to obtain the type of.
    *
    * @since   1.0, 2022.03.17
    * @author  Christian Jean
    *
    * @see getInstanceName which has a similar functionality.
    *
    * @returns an object type.
    */
   function getType(obj) {
      log.info('Getting type name');

      if (obj === null) return '<null>';
      if (obj === undefined) return '<undefined>';

      if (JxValidate.isString(obj)) return 'String';
      if (JxValidate.isBoolean(obj)) return 'Boolean';
      if (JxValidate.isDouble(obj)) return 'Double';
      if (JxValidate.isInteger(obj)) return 'Integer';
      if (JxValidate.isNumber(obj)) return 'Number'; // Keep after double and int
      if (JxValidate.isFunction(obj)) return 'Function';
      if (JxValidate.isArray(obj)) return 'Array';
      if (JxValidate.isObject(obj)) return 'Object';

      return getInstanceName(obj);
   }

   /**
    * Will loop the list of values and provide an instance count.
    *
    * TODO: Should we optimze by removing counted entries?
    *
    * @param {Array} list having entries to be counted.
    * @param {Object} value to compare for count.
    *
    * @returns a number.
    */
   function countValues(list, value) {
      let count = 0;

      list.forEach((val, idx) => {
         if (val === value) {
            count++;
            list.splice(idx, 1);
         }
      });

      return { count: count, list: list };
   }

   /**
    * Get a list of object keys in an object.
    *
    * @param {Object} obj to get object keys for.
    *
    * @returns a list (array) of object keys.
    */
   function getKeys(obj) {
      return Object.keys ? Object.keys(obj) : _getKeysLegacy(obj);
   }

   /**
    * Determine if the specified object has an internal property
    * by the 'name' provided.
    *
    * @see getProperty which will also get the value of the property/key.
    *
    * @param {Object} obj is the object to check with.
    * @param {String} name of the property to look on object.
    *
    * @returns 'true' if property exists, 'false' otherwise.
    */
   function hasKey(obj, name) {
      return getProperty(obj, name) != null;
   }

   /**
    * Will get the value for the named property.
    *
    * @see hasKey which only checks for the existance of a property/key.
    * @see getProperty which will also get the value of a property/key.
    *
    * @param {Object} obj is the object to check with.
    * @param {String} name of the property to look on object.
    *
    * @returns 'true' if property exists, 'false' otherwise.
    */
   function getKey(obj, name) {
      return getProperty(obj, name);
   }

   /**
    * A less efficient way to get a list of object keys in an object.
    *
    * @param {Object} obj to get object keys for.
    *
    * @returns a list (array) of object keys.
    */
   function _getKeysLegacy(obj) {
      let keys = [];
      for (var key in obj) {
         keys.push(key);
      }
      return keys;
   }

   /**
    * Get a list of object values in an object.
    *
    * @param {Object} obj to get object values for.
    *
    * @returns a list (array) of object values.
    */
   function getValues(obj) {
      return Object.values ? Object.values(obj) : _getValuesLegacy(obj);
   }

   /**
    * A less efficient way to get a list of object values in an object.
    *
    * @param {Object} obj to get object values for.
    *
    * @returns a list (array) of object values.
    */
   function _getValuesLegacy(obj) {
      let keys = getKeys(obj);
      let values = [];
      for (k in keys) {
         values.push(keys[k]);
      }
      return values;
   }

   /**
    * Loop through object and count its properties (keys).
    *
    * @param {Object} obj to count properties (keys) for.
    *
    * @returns a number of properties (keys).
    */
   function getSize(obj) {
      return getKeys(obj).length;
   }

   function _isArray(lst) {
      if (!lst) return true;
      let any = false;
      lst.forEach((e) => {
         if (e) any = true;
      });
      return any;
   }

   function _isMissmatch(lst, obj) {
      if (!lst) return true;
      if (!obj) return true;

      let ret = false;
      let any = _isArray(lst);
      let arr = Array.isArray(obj);

      log.debug(' >> Part is expecting array: ' + any);
      log.debug(' >> Object is an array: ' + arr);

      if (any && !arr) ret = true;
      if (!any && arr) ret = true;

      if (ret) log.debug(' >> MISSMATCH found, aborting!');

      return ret;
   }

   /**
    * Will seek objects or values for an object, using the
    * path provided.
    *
    * Given the following object:
    *
    *   let obj = {
    *      some: {
    *         value: 22,
    *         x: {
    *            value: 'alkjdf',
    *         },
    *         y: 3.4,
    *         z: true,
    *      },
    *      inner: {
    *         array: [
    *            { x: 1, y: 2, s: '12' },
    *            { x: 3, y: 4, s: '34', o: { v: 1 } },
    *            { x: 5, y: 6, s: '56' },
    *         ],
    *      },
    *   }
    *
    * You can do the following:
    *
    *  'some.value'              Will return '22' (type 'number')
    *  'some.x'                  Will return an object (type 'object')
    *  'some.x.value'            Will return 'alkjdf' (type 'string')
    *  'some.y'                  Will return 3.4 (type 'number')
    *  'some.z'                  Will return true (type 'boolean')
    *  'inner.array'             Will return an array (type 'object')   // Same as 'inner.array[]'
    *  'inner.array[]'           Will return an array (type 'object')   // Same as 'inner.array[*]'
    *  'inner.array[*]'          Will return an array (type 'object')   // Same as 'inner.array'
    *  'inner.array[#]'          Will return 3 (type 'number')          // The length of the array
    *  'inner.array[*].x'        Will return an array of 'x' (numbers)  // ie: [ 1, 3, 5 ]
    *  'inner.array[*].s'        Will return an array of 's' (strings)  // ie: [ '12', '34', 56' ]
    *  'inner.array[*].o'        Will return an array of 'o' (object)   // ie: [ { v: 1 } ]
    *  'inner.array[*].o.v'      Will return an array of 'v' (number)   // ie: [ 1 ]
    *  'inner.array[].p'         Will return null (path does not exist)
    *
    * Also should (not tested):
    *
    *   'inner[].x'              Will return 'null' since 'inner' is not an array.
    *   'inner.array.x'          Will return 'null' since 'inner' is an object (with path after it).
    *
    * Also future support (TODO):
    *
    *   'inner.array[%2]'        Will return an array of items when index is 'idx % 2 = 0' (every 2nd).
    *   'inner.array[%3]'        Will return an array of items when index is 'idx % 3 = 0' (every 3rd).
    *
    *   'inner.array[1,3,5]'     Will return an array of items when index is 1, 3 and 5.
    *   'inner.array[1-7]'       Will return an array of items when index is between 1 to 7.
    *
    * -----------------------------------------------------------------------------------------------
    *                     [ (*|4|-5|%2|#)                ( 6-9 )             ( 3,5,7 )          ]
    * if (part.match(/\[\s*((\*?|\d+|-\d+|\%\s*\d+|#)|(\d+\s*-\s*\d+)|(\d+(\s*,\s*\d+)+)+)\s*\]$/g))
    *
    * @param {Object} obj to count properties/keys for.
    * @param {String} path is an object path.
    *
    * @returns the property value (ie: a number, object or object value).
    */
   function getAt(obj, path) {
      let value = null;

      log.info('Getting object value for path');

      if (!obj) return value;
      if (!path) return value;

      log.debug(" >> Path  : '" + path + "'");

      let parts = path.split('.');
      let prefix = [];
      let ptr = obj;

      log.debug(' >> Parts : ' + JSON.stringify(parts));

      for (var i = 0, len = parts.length; i < len; i++) {
         let part = parts[i];

         prefix.push(part);

         log.debug('------------------------------------------------------------');
         log.debug(' >> Part ' + i + ": '" + part + "'");
         log.debug(" >> Prefix (so far): '" + prefix.join('.') + "'");

         log.debug('   >> Ptr type     : ' + typeof ptr);
         log.debug('   >> Ptr is array : ' + Array.isArray(ptr));
         log.debug('   >> Ptr value    : ' + JSON.stringify(ptr));

         // Is our pattern an array?
         let cnt = part.match(/\[\s*#\s*\]$/g);
         let all = part.match(/\[\s*(\*?|\s*)\s*\]$/g);
         let arr = _isArray([cnt, all]);

         log.debug(' >> Match cnt: ' + cnt);
         log.debug(' >> Match all: ' + all);

         if (arr) {
            log.debug(' >> Part is expecting an array, pop next item');
            let ll = 0;
            if (cnt) ll = cnt[0].length;
            if (all) ll = all[0].length;
            let pp = part.substring(0, part.length - ll);
            ptr = ptr[pp];
            log.debug('   >> Cut length   : ' + ll);
            log.debug("   >> New part     : '" + pp + "'");
            log.debug('   >> Ptr type     : ' + typeof ptr);
            log.debug('   >> Ptr is array : ' + Array.isArray(ptr));
            log.debug('   >> Ptr value    : ' + JSON.stringify(ptr));
         }

         if (_isMissmatch([cnt, all], ptr)) break;

         if (arr) {
            log.debug(" >> Processing 'popped' array");
            if (cnt) {
               log.debug(' >> Count is being requested');
               value = ptr.length;
               break;
            }
            if (all) {
               if (i == len - 1) {
                  log.debug(' >> Our last part, returning entire array');
                  value = ptr;
                  break;
               } else {
                  log.debug(' >> This part is not our target, moving along to each array item.');
                  let pfx = prefix.join('.');
                  log.debug(" >> Old path: '" + path + "', prefix length: " + pfx.length);
                  let npath = path.substring(pfx.length);
                  if (npath[0] == '.') npath = npath.substring(1);
                  log.debug(" >> New path: '" + npath + "'");
                  let list = [];
                  ptr.forEach((e, i) => {
                     log.debug(' >> Recursing on array item ' + i);
                     let ret = getAt(e, npath);
                     if (ret) list.push(ret);
                  });
                  if (list.length > 0) value = list;
                  break;
               }
            }
         } else {
            if (ptr[part]) {
               ptr = ptr[part];
               if (i == len - 1) {
                  log.debug(" >> Our last part, returning it's value");
                  value = ptr;
               } else log.debug(' >> This part is not our target, moving along.');
            } else {
               log.debug(" >> Expecting part '" + part + "', but it doesn't exist, aborting!");
               break;
            }
         }
      }

      log.debug(' >> Returning (type: ' + typeof value + '): ' + value);

      return value;
   }

   /**
    * Will flatten an array nested with other arrays.
    *
    * This will work with a deep nesting of arrays.
    *
    * Example:
    *
    *    const nested = [1, 2, 3, [4, 5, [6, 7, ['a', 'b', 'c']], 8, 9]];
    *
    *    flattenArray(nested); // [1, 2, 3, 4, 5, 6, 7, a, b, c, 8, 9]
    *
    * TODO: Not yet tested!!!
    *
    * @param {Array} array object to flatten.
    *
    * @returns an array that has been flattened.
    */
   function flattenArray(array) {
      log.info('Flattening array');

      const result = [];

      array.forEach((item) => {
         if (Array.isArray(item)) {
            result.push(...flattenArray(item));
         } else {
            result.push(item);
         }
      });

      return result;
   }

   /**
    * Will remove duplicate (native) values from the array.
    *
    * TODO: Not tested!
    *
    * @author  Christian Jean
    * @since   2.2.0
    *
    * @param {Array} array to remove duplicates from.
    *
    * @returns a new array of unique values.
    */
   function removeDuplicates(array) {
      return [...new Set(array)];
   }

   /**
    * Sort the array of objects, using the specified 'key', in ascending
    * order.
    *
    * This uses the native sort method for optimal speeds.
    *
    * TODO: Not tested!
    *
    * @author  Christian Jean
    * @since   2.2.0
    *
    * @param {Array} array of objects.
    * @param {String} key value to sort.
    *
    * @returns
    */
   function sortArrayByKey(array, key) {
      return array.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0));
   }

   /**
    * Sort the array of objects, using the specified 'path', in ascending
    * order.
    *
    * The advantage here is that the object may be abt complex object.
    *
    * This uses the native sort method for optimal speeds.
    *
    * TODO: Not tested!
    *
    * @author  Christian Jean
    * @since   2.2.0
    *
    * @param {Array} array of objects to sort.
    * @param {String} key value to sort.
    *
    * @returns
    */
   function sortArrayByPath(array, key) {
      return null;
   }

   //-------------------------------------------------------------------
   // Exported functions and constants
   //-------------------------------------------------------------------

   return {
      log: log,

      print: print,
      sleep: sleep,

      listify: listify,
      printListify: printListify,

      sort: sort,
      unique: unique,
      countedList: countedList,

      countValues: countValues,

      merge: merge,

      hasProperty: hasProperty,
      getProperty: getProperty,
      getPropertyOfType: getPropertyOfType,

      hasKey: hasKey,
      getKey: getKey,

      getKeys: getKeys,
      getValues: getValues,
      getSize: getSize,
      getAt: getAt,

      getType: getType,
      isInstanceOf: isInstanceOf,
      getInstanceName: getInstanceName,

      areEqual: areEqual,

      isEven: isEven,
      isOdd: isOdd,

      // Array specific (should probably be moved
      // to a JxArray module)
      flattenArray: flattenArray,
      removeDuplicates: removeDuplicates,
      sortArrayByKey: sortArrayByKey,
      sortArrayByPath: sortArrayByPath,
      getOccurences: getOccurences,
      insertAt: insertAt,

      getName: getName,
      getVersion: getVersion,
      getHashcode: getHashcode,
      getObject: getObject,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

module.exports = JxObject;

console.log(JxObject.toString());

function testProperties() {
   console.log(JxObject.getKeys({ a: 1, b: 2, c: 3, d: { x: 8, y: 9 } }));
   console.log(JxObject.getSize(new Object()));
   console.log(JxObject.getSize({}));
   console.log(JxObject.getSize({ a: 1, b: 2, c: 3, d: { x: 8, y: 9 } }));
}

function testTraversalCases() {
   let obj = {
      some: {
         value: 22,
         x: {
            value: 'alkjdf',
         },
         y: 3.4,
         z: true,
      },
      inner: {
         array: [
            { x: 1, y: 2, s: '12' },
            { x: 3, y: 4, s: '34', o: { v: 1 } },
            { x: 5, y: 6, s: '56' },
         ],
      },
      another: {
         deeper: {
            path: 'another/deeper/path',
            me: 23432,
            too: null,
         },
      },
   };

   const CASES = [
      { str: 'some.value', val: 22, type: 'number' },
      { str: 'some.x', val: null, type: 'object' },
      { str: 'some.x.value', val: 'alkjdf', type: 'string' },
      { str: 'some.y', val: 3.4, type: 'number' },
      { str: 'some.z', val: true, type: 'boolean' },
      { str: 'inner.array', val: null, type: '$array' }, // same as 'inner.array[]'
      { str: 'inner.array[]', val: null, type: '$array' }, // same as 'inner.array[#]'
      { str: 'inner.array[#]', val: 3, type: 'number' }, // get an array length
      { str: 'inner.array[*]', val: null, type: '$array' }, // array of objects
      { str: 'inner.array[*].x', val: null, type: '$array' }, // an array of x
      { str: 'inner.array[*].s', val: null, type: '$array' }, // an array of s
      { str: 'inner.array[*].o', val: null, type: '$array' }, // an array of o: { v: 1 }
      { str: 'inner.array[*].o.v', val: null, type: '$array' }, // an array of v
      { str: 'inner.array[].p', val: null, type: null },
   ];

   function values(expecting, received) {
      return " (expecting '" + expecting + ", received: '" + received + "')";
   }
   function types(expecting, received) {
      return " (expecting '" + typeof expecting + ", received: '" + typeof received + "')";
   }

   JxObject.log.setToError(); // disable internal logging

   for (var i = 0; i < CASES.length; i++) {
      let tc = CASES[i];
      console.log('');
      console.log('Running test case: ' + i);
      console.log(" >> Case: '" + JSON.stringify(tc) + "'");
      let val = JxObject.getAt(obj, tc.str);
      console.log(' >> Received: ' + JSON.stringify(val));

      if (tc.val != null) {
         if (tc.val == val) console.log(' >> Value SUCCESS' + values(tc.val, val));
         if (tc.val != val) console.log(' >> Value FAILED' + values(tc.val, val));
      }

      if (tc.type != null) {
         if (tc.type[0] == '$') {
            if (tc.type == '$array') {
               if (Array.isArray(val)) console.log(' >> Type SUCCESS' + types(tc.val, val));
            }
         } else {
            if (tc.type == typeof val) console.log(' >> Type SUCCESS' + types(tc.val, val));
            if (tc.type != typeof val) console.log(' >> Type FAILED' + types(tc.val, val));
         }
      }
   }

   JxObject.log.setToDebug(); // enable it back on
}

function testSort() {
   const JxRand = require('./JxRand');
   const JxStopwatch = require('./../utils/JxStopwatch');
   const JxLogger = require('../utils/JxLogger');

   const log = JxLogger.getInstance('JxObjectTest', JxLogger.DEBUG);

   let list1 = []; // booleans
   let list2 = []; // numbers
   let list3 = []; // strings (uuid's)
   let list4 = []; // dates

   JxStopwatch.start('loop');
   for (let i = 0; i < 100000; i++) {
      list1.push(JxRand.getBool());
      list2.push(JxRand.getNumber(0, 1000));
      list3.push(JxRand.uuid());
      list4.push(JxRand.getDOB());
   }
   JxStopwatch.stop('loop');

   JxStopwatch.start('list1', 'sort');
   // JxObject.sort(list1);
   // JxStopwatch.split('list1', 'unique');
   list1 = JxObject.unique(list1);
   JxStopwatch.stop('list1');
   // JxObject.print(list1);

   JxStopwatch.start('list2', 'sort');
   // JxObject.sort(list2);
   // JxStopwatch.split('list2', 'unique');
   list2 = JxObject.unique(list2);
   JxStopwatch.stop('list2');
   // JxObject.print(list2);

   JxStopwatch.start('list3', 'sort');
   // JxObject.sort(list3);
   // JxStopwatch.split('list3', 'unique');
   list3 = JxObject.unique(list3);
   JxStopwatch.stop('list3');
   // JxObject.print(list3);

   JxStopwatch.start('list4', 'sort');
   // JxObject.sort(list4);
   // JxStopwatch.split('list4', 'unique');
   list4 = JxObject.unique(list4);
   JxStopwatch.stop('list4');
   // JxObject.print(list4);

   console.log('-----------------------------------------------------------------------------------');

   JxStopwatch.print();
}

function testFlattenArray() {
   const nested = [1, 2, 3, [4, 5, [6, 7, ['a', 'b', 'c']], 8, 9]];
   const final = JxObject.flattenArray(nested);
   console.log(JSON.stringify(final));
}

// testSort();
// testProperties();
// testTraversalCases();
// testFlattenArray();
