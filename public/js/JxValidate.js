/*
 * Copyright (C) 2021 Christian Jean
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

var JxValidate = (function () {
   //-------------------------------------------------------------------
   // Private Variables...
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxValidate';
   const MODULE_VERSION = '1.10.0';

   const MODULE_HASHCODE = generateRandomHashcode();

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.WARN);

   //-------------------------------------------------------------------
   // Constructor...
   //-------------------------------------------------------------------

   init.apply(null, arguments);

   //-------------------------------------------------------------------
   // Private Methods...
   //-------------------------------------------------------------------

   /**
    * Initialize our questionnaire.
    */
   function init() {
      log.info("Initializing '" + MODULE_NAME + "' module");

      log.debug(' >> Version  : ' + getVersion());
      log.debug(' >> Hashcode : ' + getHashcode());
      log.debug(' >> Args     : ' + arguments.length);
   }

   /**
    * Provide a unique ID for this instance.
    *
    * @param {Number} maximum length of ID to return (optional).
    *
    * @returns {String} the ID representation of this instance.
    */
   function getHashcode(max = 8) {
      log.info('Get hashcode');
      let id = MODULE_HASHCODE;

      log.debug(' >> Hashcode  : ' + id);
      log.debug(' >> Max value : ' + max);

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
   function getModuleName() {
      return MODULE_NAME;
   }

   //---------------------------------------------------------------------------------------------
   // Public functions
   //---------------------------------------------------------------------------------------------

   /**
    * Validate if the 'value' is 'null' or 'undefined'.
    *
    * @param {Any} value to validate.
    *
    * @returns 'true' if value is 'null' or 'undefined', 'false' otherwise.
    */
   function isNull(value) {
      return value === null || value === undefined;
   }

   /**
    *
    * @param {Any} value to validate.
    *
    * @returns 'true' if value is a Number, 'false' otherwise.
    */
   function isNumber(value) {
      return isInteger(value) || isDouble(value);
   }

   function isInteger(value) {
      // var v = value;
      // if (typeof value === 'object' && value instanceof Number) v = value.valueOf();
      // return Number.isInteger(v);
      if (isNaN(value)) return false;
      // return typeof value === 'number' && Number.isInteger(value);
      let v = parseFloat(value);
      return (v | 0) === v;
   }

   /**
    * Is this even the same as 'isDouble()'?
    *
    * @see isDecimal
    *
    * @param {Number} value
    *
    * @returns 'true' if is of type Double, 'false' otherwise.
    */
   function isDouble(value) {
      if (isInteger(value)) return false;
      let type = typeof value;
      if (type === 'number' || (type === 'object' && value instanceof Number)) return true;
      return false;
   }

   /**
    * We can check the number by dividing it with 1, if it is completely
    * divided by 1 then the function will return value as 0 and the number
    * is a whole number. Otherwise, the number is a decimal point number.
    *
    * Is this even the same as 'isDouble()'? Would seem to be!
    *
    * @see isDouble
    *
    * @param {Number} value
    *
    * @returns 'true' if a decimal, 'false' otherwise.
    */
   function isDecimal(value) {
      return isDouble(value) && value % 1 !== 0;
   }

   function isBoolean(value) {
      let type = typeof value;
      return type === 'boolean' || (type === 'object' && value instanceof Boolean);
   }

   /**
    * Ensures that 'boolean' is valid (not null), of type 'Boolean' and
    * evaluates to 'true'.
    *
    * @since   v1.0, 2021.04.30
    * @author  Christian Jean
    *
    * @param {Boolean} boolean
    *
    * @returns 'true' if 'boolean' is not null and is of type 'Boolean', 'false' otherwise.
    */
   function isTrue(boolean) {
      log.info('Is true');
      var isBool = isBoolean(boolean);
      log.debug(' >> isBoolean: ' + isBool);
      var result = isBool && boolean === true;
      log.debug(' >> Result: ' + result);
      return result;
   }

   /**
    * Ensure that all items in the list are booleans and
    * are all true.
    *
    * @param {Array} list
    *
    * @return 'true' if all booleans and true, 'false' otherwise.
    */
   function allTrue(list) {
      if (!list) return false;
      if (!Array.isArray(list)) return false;
      let b = list.every((entry) => isTrue(entry));
      return b;
   }

   /**
    * Will convert a boolean 'String' or boolean 'Object' to a native 'true'
    * or 'false' value.
    *
    * TEST ONLY - NOT COMPLETED OR TESTED!!
    *
    * @param {String|Boolean} val
    *
    * @returns
    */
   function toBoolean(val) {
      var b = null;

      if (val) {
         switch (typeof val) {
            case 'string':
               switch (val.toLowerCase()) {
                  case '0':
                  case 'no':
                  case 'false':
                  case 'off':
                  case 'negative':
                  case 'disabled':
                     b = false;
                     break;
                  case '1':
                  case 'yes':
                  case 'true':
                  case 'on':
                  case 'positive':
                  case 'enabled':
                     b = true;
                     break;
               }
               break;
            case 'object':
               if (val > 0) b = true;
               if (val == 0) b = false;
               break;
         }
      }

      return b;
   }

   /**
    * Will verify that 'value' is of type String.
    *
    * Optionally, a second parameter ('option') can be provided for additional validation.
    *
    * Where 'option' is:
    *
    *    Number   To check if the length of string is at least N characters or more.
    *
    *    Boolean  If 'true', indicates that the string may be null ('false' otherwise).
    *
    *    String   To verify if string is an exact match (case sensitive).
    *
    *    RegEx    If a regular expression, use it to test the string value.
    *
    * @since   v1.0.0
    * @since   2021.04.30
    *
    * @author  Christian Jean
    *
    * @returns 'true' if a string and/or string conditions are met, 'false' otherwise.
    */
   function isString(value, option) {
      let b1 = false;

      b1 = (typeof value === 'object' && value instanceof String) || typeof value === 'string';

      if (arguments.length == 1) return b1;

      // If option = true, then string may be null
      if (isBoolean(option)) return b1 || (value == null && option === true);

      // If option is a number, then string length must be GTE
      if (isInteger(option)) return b1 && option >= value.length;

      // If option is a string, then exact match evalation
      if (isString(option)) return b1 && value === option;

      // If option is a RegEx, then test for it
      if (isRegex(option)) return b1 && option.test(value);

      return false;
   }

   /**
    * Validates that this is an actual array.
    *
    * Can optionally provide a 'min' value, where the array must have at least
    * 'min' elements in it. Default min is zero (0).
    *
    * @param {Array} value is the array to validate.
    * @param {Number} min is the minimum number of elements expected.
    *
    * @returns 'true' if this is array having at least 'min' elements.
    */
   function isArray(value, min = 0) {
      return Array.isArray(value) && value.length >= min;
   }

   function isFunction(value) {
      return (typeof value === 'object' && value instanceof Function) || typeof value === 'function';
   }

   /**
    * Determine if the 'value' is of type 'object'.
    *
    * @param {Object} value is the object to evaluate.
    * @param {String} ofType to determin a specific type of object.
    *
    * @returns 'true' if an object, 'false' otherwise.
    */
   function isObject(value, ofType = null) {
      let b = false;

      b = (typeof value === 'object' || isFunction(value)) && value != null;

      // TODO: Test this logic!
      if (ofType) {
         let tt = getType(value);

         if (isString(ofType)) return b && tt == ofType;

         if (isArray(ofType)) {
            return b && ofType.oneOf((type) => tt == type);
         }
      }

      return b;
   }

   function isBuffer(value) {
      return Buffer.isBuffer(value);
   }

   function isDate(value) {
      return value && value instanceof Date;
   }

   /**
    * A special validator which determines if the parameter is the
    * 'arguments' object.
    *
    * @param {Object} value is the 'arguments' special object.
    *
    * @returns 'true' if type is arguments object, 'false' otherwise.
    */
   function isArguments(value) {
      return isObject(value) && value.length !== 'undefined';
   }

   /**
    * Determine if the 'value' provided is a valid RegEx instance.
    *
    * Example:
    *
    *    const re1 = /\w+/;
    *
    *    // OR
    *
    *    const re2 = new RegExp("\\w+");
    *
    * Where:
    *
    *    isRegex(re1); // true
    *    isRegex(re2); // true
    *
    * @param {RegExp} value representing the regular expression.
    *
    * @see MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
    * @see RegExp https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
    *
    * @returns 'true' if a RegExp, 'false' otherwise.
    */
   function isRegex(value) {
      return value instanceof RegExp && value.constructor.name === 'RegExp';
   }

   /**
    * Determine if the specified IP address is valid.
    *
    * @see IP-Classes https://www.meridianoutpost.com/resources/articles/IP-classes.php
    * @see Bitmask https://www.pawprint.net/designresources/netmask-converter.php
    *
    * @author  Christian Jean
    * @since   1.7.0
    *
    * @param {String} ip address to validate
    *
    * @returns 'true' if a valid IP address, 'false' otherwise.
    */
   function isIPAddress(ip) {
      log.info('Determine if an IP address');
      log.debug(" >> IP address : '" + ip + "'");
      // let b = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$)/g.test(ip);
      let b = /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d{1})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d{1})\b/g.test(ip);
      log.debug(' >> Is valid   : ' + b);
      return b;
   }

   /**
    * Will compare two objects for equality.
    *
    * This uses a 'JSON.stringify' comparision, which means it could be
    * slow (not necessarily optimized for frequent calls).
    *
    * Both parameters must be of type 'object', otherwise an emmediate
    * fail (false) is returned.
    *
    * @param {Object} o1 is the first object to compare.
    * @param {Object} o2 is the second object to compare.
    *
    * @returns 'true' if equal, 'false' otherwise.
    */
   function equals(o1, o2) {
      log.info('Evaluating if objects are equal');
      if (!isObject(o1)) return false;
      if (!isObject(o2)) return false;
      let j1 = JSON.stringify(o1);
      let j2 = JSON.stringify(o2);
      log.debug(' >> JSON len 1: ' + j1.length);
      log.debug(' >> JSON len 2: ' + j2.length);
      log.trace(' >> JSON value 1: ' + j1);
      log.trace(' >> JSON value 2: ' + j2);
      return j1 === j2;
   }

   /**
    * A convenient multi-type checker, where types can be any of:
    *
    *  o = Object
    *  f = Function
    *  a = Array
    *  s = String
    *  b = Boolean
    *  d = Double
    *  i = Integer
    *  n = Number
    *  u = UUID (any version)
    *
    *  m = MD5     (having 32-bytes ... NOT currently implemented!)
    *  1 = SHA-1   (having 40-bytes ... NOT currently implemented!)
    *  2 = SHA-256 (having 64-bytes ... NOT currently implemented!)
    *  3 = SHA-384 (having 96-bytes ... NOT currently implemented!)
    *  5 = SHA-512 (having 128-bytes ... NOT currently implemented!)
    *
    * More than one type can be provided in a call, such as:
    *
    *   isTypes('oas', value);   // check if object, array or string
    *   isTypes('fo', value);    // check if function or object
    *   isTypes('nid', value);   // check if number, integer or double
    *
    * @author  Christian Jean
    * @since   v1.1, 2021.05.21
    *
    * @param types is a string of types (lowercase letters).
    * @param value is the value object to validate for types.
    *
    * @returns 'true' if a match was made, 'false' otherwise.
    */
   function isTypes(types, value) {
      var x = false;
      var c = null;

      log.info('Validating for multiple types');

      if (!isString(types)) return false;
      if (arguments.length < 2) return false;

      log.debug(" > Types: '" + types + "'");
      log.debug(" > Value: '" + typeof value + "'");

      for (var i = 0; i < types.length; i++) {
         c = types.substr(i, 1);

         switch (c) {
            case 'o':
               x = isObject(value);
               break;
            case 'f':
               x = isFunction(value);
               break;
            case 'a':
               x = isArray(value);
               break;
            case 's':
               x = isString(value);
               break;
            case 'b':
               x = isBoolean(value);
               break;
            case 'd':
               x = isDouble(value);
               break;
            case 'i':
               x = isInteger(value);
               break;
            case 'n':
               x = isNumber(value);
               break;
            case 'u':
               x = isUUID(value);
               break;
         }

         log.debug(' > Type at ' + i + ": '" + c + "' = " + x);

         if (x) return x;
      }

      return false;
   }

   /**
    * Will get the object's precise type as a string.
    *
    * This is acheived by processing the object in a very specific order.
    *
    * It is recommended to only use 'double' and 'integer', and not 'number' as
    * JavaScript will type 'integer' for 'Number(12)'. Can get confusing!
    *
    * @see testObjectType test case.
    *
    * @param {Object} obj to get the type for.
    */
   function getType(obj) {
      log.info('Getting object type');

      let ret = 'unknown';

      if (obj === null) ret = 'null';
      else if (obj === undefined) ret = 'undefined';
      // Basic/simple types
      else if (isString(obj)) ret = 'string';
      else if (isBoolean(obj)) ret = 'boolean';
      else if (isDouble(obj)) ret = 'double';
      else if (isInteger(obj)) ret = 'integer';
      else if (isNumber(obj)) ret = 'number';
      // These are 'object' derived types
      else if (isDate(obj)) ret = 'date';
      else if (isArray(obj)) ret = 'array';
      else if (isFunction(obj)) ret = 'function';
      else if (isRegex(obj)) ret = 'regex';
      // else if (isArguments(obj)) ret = 'argument';
      else if (isBuffer(obj)) ret = 'buffer';
      else if (isObject(obj)) ret = 'object'; // object literal

      log.debug(" >> Returning: '" + ret + "'");

      return ret;
   }

   /**
    * Will take a list of types and resolve each into their full name and return it
    * as a list.
    *
    * If the 'short' is 'true', instead of returning long names, such as "String", "Boolean"
    * or "Integer", short names will be used instead, such as "Str", "Bool", "Int".
    *
    * @param types a String of single-letter types.
    * @param short boolean to shorten each name.
    *
    *
    * @author  Christian Jean
    * @since   v1.1, 2021.05.21
    * @see     isType
    *
    * @returns a comma delimited list of types.
    */
   function getTypeNames(types, short = false) {
      var list = [];

      log.info('Resolving type list');

      if (!isString(types)) return '<none>';
      if (arguments.length === 2 && !isBoolean(short)) short = false;

      log.debug(" > Types: '" + types + "'");

      for (var i = 0; i < types.length; i++) {
         c = types.substr(i, 1);

         switch (c) {
            case 'o':
               list.push(short ? 'Obj' : 'Object');
               break;
            case 'f':
               list.push(short ? 'Func' : 'Function');
               break;
            case 'a':
               list.push(short ? 'Arr' : 'Array');
               break;
            case 's':
               list.push(short ? 'Str' : 'String');
               break;
            case 'b':
               list.push(short ? 'Bool' : 'Boolean');
               break;
            case 'd':
               list.push(short ? 'Dbl' : 'Double');
               break;
            case 'i':
               list.push(short ? 'Int' : 'Integer');
               break;
            case 'n':
               list.push(short ? 'Num' : 'Number');
               break;
         }
      }

      list = list.join(', ');

      log.debug(' > Resolved list: ' + list);

      return list;
   }

   /**
    * Will check for the existence of 'property' (by name) on the specified 'obj'.
    *
    * If the property exists, it will be returned. If the property does not exist,
    * the value of 'response' will be returned instead.
    *
    * Example:
    *
    *    const X = {
    *       a: null,
    *       b: undefined,
    *       c: "foo bar"
    *    }
    *
    *    console.log("A1: " + hasProp(X, 'a'));                // --> null
    *    console.log("A2: " + hasProp(X, 'a', 'default'));     // --> null
    *    console.log("B1: " + hasProp(X, 'b');                 // --> undefined
    *    console.log("B2: " + hasProp(X, 'b', 'default'));     // --> undefined
    *    console.log("C1: " + hasProp(X, 'c'));                // --> "foo bar"
    *    console.log("C2: " + hasProp(X, 'c', 'default'));     // --> "foo bar"
    *    console.log("D1: " + hasProp(X, 'd'));                // --> null
    *    console.log("D2: " + hasProp(X, 'd', 'default'));     // --> "default"
    *
    * @param {Object} obj to check existence of property on.
    * @param {String} prop to check existance for.
    * @param {Object} response to return if property does not exist (default: null).
    *
    * @returns the object's property if it exists, 'response' othewise.
    */
   function hasProp(obj, prop, response = null) {
      log.info('Object has property');
      log.debug(' >> Object   : ' + getType(obj));
      log.debug(" >> Property : '" + prop + "'");
      log.debug(' >> Response : ' + response);

      let b = Object.hasOwn(obj, prop);

      log.debug(' >> Exists   : ' + b);

      return b ? obj[prop] : response;
   }

   /**
    * Determine if the 'uuid' (string) is a valid UUID of any version.
    *
    * As an optional second parameter, you can also validate for a specific
    *
    * Sample UUIDv4 Strings:
    *
    *   91c7bdd5-68d8-488a-abba-35014ccdedd1
    *   0fd1041c-9316-46c8-8b6b-3bb9e0463bc4
    *
    * UUID version number (ie: 1, [2], 3, 4, or 5).
    *
    * @since v1.0, 2021.04.29
    * @author Christian Jean (christian.jean@gmail.com)
    *
    * @param uuid (String) is a UUID string to validate.
    * @param version (Number) is a version number to test for.
    *
    * @returns 'true' if not 'null' and is a valid UUID.
    */
   function isUUID(uuid = null, versions = []) {
      log.info('Testing for UUID string');

      if (!isString(uuid)) throw "Invalid 'uuid' parameter, expected 'string' and got '" + typeof uuid + "'.";
      if (!isArray(versions)) throw "Invalid 'versions' parameter, expected 'Array' and got '" + typeof versions + "'.";

      log.debug(" >> UUID     : '" + uuid + "'");
      log.debug(' >> Versions : ', versions);

      // A standard UUID code contains 32 hex digits along with
      // 4 “-” symbols, which makes its length equal to 36 characters.
      if (uuid.length != 36) return false;

      // Test for any UUID version
      const RE = /^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

      let validFormat = RE.test(uuid);

      log.debug(' >> Valid format: ' + validFormat);

      let version = uuid.substring(14, 15);
      log.debug(' >> UUID is version : ' + version);

      // Format is good, do we care which version?
      if (!versions || versions.length == 0) return validFormat;

      log.debug(' >> Validating version(s)');

      versions = versions.flat();

      let validVersion = versions.some((v) => v == version);

      log.debug(' >> Valid version: ' + validVersion);

      return validVersion;
   }

   /**
    * Determine if the 'sha1' string provided is a SHA1.
    *
    * Sample SHA1 strings:
    *
    *   4468e5deabf5e6d0740cd1a77df56f67093ec943
    *   9075724d89dc565c1e720cc3cc6974d26a058e01
    *
    * A SHA1 hash digest is exactly 40-characters in length.
    *
    * @since  2023.04.27
    * @author Christian Jean (christian.jean@gmail.com)
    *
    * @param {String} sha1
    *
    * @returns 'true' if a valid SHA1 digest, 'false' otherwise.
    */
   function isSHA1(sha1) {
      if (!sha1) return false;
      if (!isString(sha1)) return false;
      sha1 = sha1.toLowerCase();
      let match = sha1.match(/^[0-9a-f]{40}$/g);
      return match != null ? true : false;
   }

   /**
    * Determins if the start of the string seems to be a valid
    * BASE64 string.
    *
    * This function does NOT validate the entirety of the data.
    * Only the header portion of the data.
    *
    * WARNING
    *
    * Using REGEX on large strings can lead to performance issues and out of
    * memory errors. This function must be used with extreme caution.
    *
    * This has not been tested and has shown doubtful results so far.
    *
    * @since  2023.04.27
    * @author Christian Jean (christian.jean@gmail.com)
    *
    * @param {String} base64
    *
    * @returns 'true' if a Base64, 'false' otherwise.
    */
   function isBase64(base64) {
      const NOT_BASE64 = /[^A-Z0-9+\/=]/i;
      if (!base64) return false;
      const len = base64.length;

      /**
       * The quickest test:
       *
       *  1. Length is not equal to 0
       *  2. Length is always divisible by four (ie: 8, 16, 20, etc.)
       *  3. Either
       *     a. If it has spaces, tabs, newlines or carriage return, then it is not.
       *     b. Perform a characer validation with REGEX.
       */
      if (!len || len % 4 !== 0 || NOT_BASE64.test(base64)) {
         // if (!len || len % 4 !== 0 || base64.search(/[\s\t\r\n\v]/) >= 0) {
         return false;
      }

      const FIRST_PADDING_CHAR = base64.indexOf('=');
      return FIRST_PADDING_CHAR === -1 || FIRST_PADDING_CHAR === len - 1 || (FIRST_PADDING_CHAR === len - 2 && base64[len - 1] === '=');
   }

   /**
    * Validate to ensure the date provided is ISO 8601 formated.
    *
    * Required structure:
    *
    *   year    - as a valid 4-digit year (1000 to 1999, and 2000 to 2999).
    *   month   - as a valid 2-digit month (01-09, 10, 11, 12)
    *   day     - as a valid 2-digit day (01-09, 10-19, 20-29, 30, 31), with no Feb. 29, 30, 31 validation
    *
    *   Date components can be delimted with any of '.', '-' or space (' ').
    *
    *   hour    - as a valid 2-digit hour (00-09, 10-19, 20-24).
    *   minutes - as a valid 2-digit minute (00-59).
    *   seconds - as a valid 2-digit minute (00-59), and can optionally be omitted.
    *
    *   Time components can be delimited with any of ':' or no delimitation (ie: 013345).
    *
    *   An optional 'Z' to indicate UTC time
    *   An optional +/- and 1 to 3 digit time offset (ie: +1, -05, +003)
    *
    * Examples include:
    *
    *   2023-04-27T0104
    *   2023-04-27T0104+3
    *   2023-04-27T01:04-8
    *   2023-04-27T01:04:55-8
    *   2023-04-27T01:04:55Z-5
    *   2023-04-27T01:04:55Z+05
    *   2023-04-27T01:04:55Z+005
    *   2023-04-27T01:04:55-5
    *   2023-04-30T03:34:06.493Z
    *
    * @since  2023.04.27
    * @author Christian Jean (christian.jean@gmail.com)
    *
    * @param {String} ts is a timestamp
    *
    * @returns 'true' if properly structured date, 'false' otherwise.
    */
   function isTimestamp(ts) {
      if (!ts) return valid;
      let match = ts.match(/^[12][\d]{3}[-. ]?([0][1-9]|[1][0-2])[-. ]?([0][1-9]|[12][\d]|[3][01])[T]([0][\d]|[1][\d]|[2][0-4])[:]?[0-5][\d][:]?([0-5][\d])?(\.\d{1,3})?[Z]?([+-]?[\d]{1,3})?$/g);

      return match != null ? true : false;
   }

   /**
    * Will validate to see if the package name adheres to the NPM package name
    * standards.
    *
    * Package name conventions:
    *
    *    1. The name must be less than or equal to 214 characters.
    *       This includes the scope for scoped packages.
    *    2. The names of scoped packages can begin with a dot or an underscore.
    *       This is not permitted without a scope.
    *    3. New packages must not have uppercase letters in the name. The name
    *       ends up being part of a URL, an argument on the command line, and
    *       a folder name. Therefore, the name can't contain any non-URL-safe
    *       characters.
    *
    * The following package names were tested:
    *
    *    'some-package'             // true
    *    'example.com'              // true
    *    'under_score'              // true
    *    'period.js'                // true
    *    '123numeric'               // true
    *    '@npm/thingy'              // true
    *
    *    'crazy!'                   // false
    *    '@npm-zors/money!time.js'  // false
    *    ''                         // false
    *    '.start-with-period'       // false
    *    '_start-with-underscore'   // false
    *    'contain:colons'           // false
    *    ' leading-space'           // false
    *    'trailing-space '          // false
    *    's/l/a/s/h/e/s'            // false
    *    'CAPITAL-LETTERS'          // false
    *
    * Above list was taken from: https://github.com/npm/validate-npm-package-name
    *
    * Considerations:
    *
    *    According to the `package-json` doc (10.4.0), it says "The names of
    *    scoped packages can begin with a dot or an underscore. This is not
    *    permitted without a scope. Does anyone know if this implies;
    *
    *       (a) @_scope/foobar, or
    *       (b) @scope/_foobar
    *
    *    It's a bit confusing. Also I don't believe anyone ever tests for this!
    *
    * @see Guidelines https://docs.npmjs.com/package-name-guidelines
    * @see Unscoped https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages
    * @see Scoped https://docs.npmjs.com/package-scope-access-level-and-visibility
    * @see Publish https://docs.npmjs.com/cli/v10/commands/npm-publish
    * @see package.json https://docs.npmjs.com/cli/v10/configuring-npm/package-json
    *
    * @param {String} package is an NPM package name.
    *
    * @returns 'true' if is valid, 'false' otherwise.
    */
   function isNpmPackageName(package) {
      const PACKAGE_NAME_REGEX = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
      let b = PACKAGE_NAME_REGEX.test(package);
      return b;
   }

   /**
    * Determine if this is a valid URL string.
    *
    * Example:
    *
    *    https://foo.bar.com:1234/some/path?query=string#target
    *
    * Where:
    *
    *    Protocol (ie: "https")
    *
    *    Domain name (ie: "foo.bar.com")
    *
    *       Subdomain (ie: "foo")
    *       Second-level domain (SLD, or 2LD) (ie: "bar")
    *       Top-level domain (TLD) (ie: "com")
    *
    *    Port (ie: 1234)
    *
    *    Path (ie: "/some/path")
    *
    *    Query, delimited by a question mark ("?") (ie: "query=string")
    *
    *    Fragment, delimited by a pound character ('#') (ie: "target")
    *
    *    Notes:
    *
    *       Subdomains are also referred as 'third-level' domains, or '3LD'.
    *
    * Types of 'top-level' domains:
    *
    *    Generic top-level domains (gTLD), such as:
    *
    *       .com, .net, .biz, .org, .info, and so on.
    *
    *       .com is the most popular by far. As of Jan. 2022, 54% of global
    *       websites used a .com top-level domain. The next most popular was
    *       .ru, which ranked at 5%.
    *
    *    Country code top-level domains (ccTLD), such as:
    *
    *       .cn (China), .ru (Russia), .de (Germany), .br (Brazil),
    *       .au (Australia), .uk (United Kingdom), .nl (Netherlands),
    *       .us (USA), .ca (Canada).
    *
    * @param {String} url string to validate.
    * @param {String|Array} protocol validate for one (String) or more (Array<String>) protocols (optional).
    *
    * @returns 'true' if a valid URL, 'false' otherwise.
    */
   function isURL(url, protocol = null) {
      log.info('Validating for URL');
      log.debug(" >> URL      : '" + url + "'");
      log.debug(" >> Protocol : '" + protocol + "'");

      let val;

      try {
         val = new URL(url);
      } catch (e) {
         return false;
      }

      log.debug(" >> Value    : '" + val + "'");

      // No protocol validation
      if (protocol == null) return true;

      if (isString(protocol)) protocol = [protocol];

      let b = false;

      if (isArray(protocol)) {
         let proto = val.protocol.substring(0, val.protocol.length - 1).toLocaleLowerCase();
         log.debug(" >> Proto    : '" + proto + "'");
         b = protocol.some((el) => el === proto);
      }

      log.debug(' >> Found    : ' + b);

      return b;
   }

   /**
    * Will check if 'value' can be found in any values of the
    * list provided.
    *
    * TODO: There are now native ways to do this!
    * TODO: Should we deprecated this function?
    *
    * @since  2023.04.25
    * @author Christian Jean
    *
    * @param {String} value to compare with list of values
    * @param {Array} list (array) of values to check with
    *
    * @return 'true' if 'value' is found in 'list'.
    */
   function oneOf(value, list) {
      if (isString(value) && isArray(list)) {
         for (let i = 0; i < list.length; i++) {
            if (value === list[i]) return true;
         }
      }
      return false;
   }

   /**
    * NOTE: EXPERIMENTAL
    *
    * Will validate an argument ('arg'), at the specified 'index' to see if
    * its type is in the list of 'types' provided.
    *
    * Examples:
    *
    *    param(args, 0, 's');       // argument 0 is a string?
    *    param(args, 1, 'nf');      // argument 1 is a number or a function?
    *    param(args, 2, 'nf');      // argument 2 is a number or a function?
    *
    * If 'args' (at 'index') is of the same type as provided in the list of
    * expected 'types', then a TRUE value will be returned.
    *
    * If 'args' (at 'index') is not of the same type as provied in the list of
    * expected 'types', then a FALSE value will be returned.
    *
    * If the length of 'args' is less than the proposed 'index', an explicit
    * TRUE value is returned.
    *
    * The primary difference between this function and the 'isTypes(types, arg)'
    * is that this function can determine that an argument is null, for which
    * it will explicitly pass, whereas 'isTypes(types, arg)' will always fail
    * if arg is null.
    *
    * @since   v1.2.0 2023.10.27
    * @author  Christian Jean
    *
    * @see args(args, types) which validates every arguments.
    *
    * @param {Array} args is an array of arguments (values).
    * @param {Number} index is the index of argument to evaluate.
    * @param {String} types is an array of possible parameter types.
    *
    * @returns 'true' if param is of types list, otherwise 'false'.
    */
   function arg(args, index, types) {
      log.info('Validating argument:');
      log.debug(' >> Args   : ' + args.length);
      log.debug(' >> Index  : ' + index);
      log.debug(' >> Types  : ' + types);

      if (!args) return false;
      // if (!arguments[1]) return false;
      if (!types) return false;

      if (index >= args.length) {
         log.debug(' >> Args.length (' + args.length + ') is greater than index (' + index + ')');
         return true;
      }

      let arg = args[index];
      let b = isTypes(types, arg);

      log.debug(' >> Validating arg ' + index + ', type: ' + typeof arg + ", expecting: '" + types + "', result: " + b);

      return b;
   }

   /**
    * NOTE: EXPERIMENTAL
    *
    * Will evaluate each 'arg' in the array of 'args' to ensure its type
    * will match with the one corresponding with the list of 'types', at
    * the same 'index'.
    *
    * If the length of 'args' does not match the length of 'types', a 'false'
    * value will be returned.
    *
    * This is convenient to determin if a function signature is exactly as
    * expected, including varients (ie: when an argument at a given position
    * can be of multiple types).
    *
    * Sample pseudocode:
    *
    *       for each arg in args {
    *          if (typeof args[idx] is NOT in list of types[idx]) return false;
    *       }
    *
    *       return true;
    *
    * Examples:
    *
    *    To validate this signature:   myFunction('string')
    *    You would call it like:       params(arguments, ['s']);
    *
    *    To validate this signature:   myFunction('string', 'number|function')
    *    You would call it like:       params(arguments, ['s', 'nf']);
    *
    *    To validate this signature:   myFunction('string', 'number|function|object')
    *    You would call it like:       params(arguments, ['s', 'nfo']);
    *
    * @since   v1.2.0 2023.10.27
    * @author  Christian Jean
    *
    * @see arg(args, index, types) which conditionally validates a specific argument.
    *
    * @param {Array} args is an array of argument values.
    * @param {Array} types is an array of possible data types.
    *
    * @returns 'true' if all params match, 'false' otherwise.
    */
   // function args(args, types) {
   //    log.info('Validating arguments:');
   //    log.debug(' >> Args   : ' + args.length);
   //    log.debug(' >> Types  : ' + types.length);

   //    if (!args) return false;
   //    if (!types) return false;

   //    if (args.length != types.length) {
   //       log.debug(' >> Args.length (' + args.length + ') does not match types.length (' + types.length + ')');
   //       return false;
   //    }

   //    for (let i = 0; i < args.length; i++) {
   //       let a = args[i];
   //       b = isTypes(types[i], a);
   //       log.debug(' >> Validating arg ' + i + ', type: ' + typeof a + ", expecting: '" + types[i] + "', result: " + b);
   //       if (!b) return false;
   //    }

   //    return true;
   // }
   function args(args, types) {
      log.info('Validating arguments:');

      log.debug(' ### ' + typeof arguments);
      log.debug(' ### ' + { one: 1, two: 'two' }.length);

      // if (!JxValidate.isArray(args)) {
      if (!JxValidate.isArguments(args)) {
         log.error(' >> ' + JxValidate.invalidType(args, 'args', 'string'));
         return false;
      }

      if (JxValidate.isString(types)) {
         log.debug(" >> Converting 'types' from string to array");
         types = types.split('');
      }

      if (!JxValidate.isArray(types)) {
         log.error(' >> ' + JxValidate.invalidType(types, 'types', 'array'));
         return false;
      }

      if (args.length != types.length) {
         log.error(' >> Length mismatch (args.length=' + args.length + ' and types.length=' + types.length + ' are not of same length)');
      }

      return true;
   }

   /**
    * Will conveniently construct an 'invalide type' error string.
    *
    * Calling:    invalidType(arg1, 'name', 'String');
    * Produces:   Invalid type for 'name', expecting 'String' and receieved 'Number'.
    *
    * Calling:    invalidType(arg2, 'ops', 'Object');
    * Produces:   Invalid type for 'ops', expecting 'Object' and receieved 'null'.
    *
    * @param {Object} arg object being validated.
    * @param {String} name of the argument being validated.
    * @param {String} expected type name (ie: String, Number, Object, etc.).
    *
    * @returns an error message string.
    */
   function invalidType(arg, name, expected) {
      let msg = ["Invalid type for '"];
      let type = typeof arg;
      if (type == 'undefined') type = 'null';
      msg.push(name);
      msg.push("', expecting '");
      msg.push(expected);
      msg.push("' and received '");
      msg.push(type);
      msg.push("'.");
      return msg.join('');
   }

   /**
    * Determine if the 'strict mode' flag is active in JavaScript.
    *
    * To validate, we call `eval(var test = 010)`, as Octal literals are
    * forbidden in strict mode.
    *
    * Warning: This function could be slow to invoke repeatedly!
    *
    * @returns 'true' if 'strict mode' is active, 'false' otherwise.
    */
   function isStrictMode() {
      try {
         eval('var test = 010');
         return false; // Success indicates 'strict mode' is inactive!
      } catch (e) {
         return true; // Error indicates 'strict mode' is active!
      }
   }

   //---------------------------------------------------------------------------------------------
   // Support functions
   //---------------------------------------------------------------------------------------------

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
    * String representation of this instance.
    */
   function toString() {
      let status = [];

      status.push('Version: ' + getVersion());

      var text = getModuleName() + '@' + getHashcode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //-------------------------------------------------------------------
   // Exported Methods...
   //-------------------------------------------------------------------

   return {
      log: log,

      isNull: isNull,
      isNumber: isNumber,
      isInteger: isInteger,
      isDouble: isDouble,
      isBoolean: isBoolean,
      isString: isString,
      isArray: isArray,
      isFunction: isFunction,
      isObject: isObject,
      isBuffer: isBuffer,
      isDate: isDate,
      isArguments: isArguments,
      isRegex: isRegex,
      isIPAddress: isIPAddress,

      isStrictMode: isStrictMode,

      equals: equals,

      isTrue: isTrue,
      allTrue: allTrue,

      invalidType: invalidType,

      arg: arg,
      args: args,

      oneOf: oneOf,

      isTypes: isTypes,
      getType: getType,
      getTypeNames: getTypeNames,

      hasProp: hasProp,

      isSHA1: isSHA1,
      isUUID: isUUID,
      isBase64: isBase64,
      isTimestamp: isTimestamp,
      isURL: isURL,

      isNpmPackageName: isNpmPackageName,

      getModuleName: getModuleName,
      getVersion: getVersion,
      getHashcode: getHashcode,
      getObject: getObject,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

console.log(JxValidate.toString());

function testObject() {
   let o1 = { name: 'O1', desc: 'This is object 1' };
   let o2 = { name: 'O1', desc: 'This is object 1' };
   let o3 = { name: 'O3', desc: 'This is object 3' };
   let d1 = { name: 'D1', desc: 'This is deep object 1', obj: { foo: 'foo', bar: 'bar', baz: 'baz' } };
   let d2 = { name: 'D1', desc: 'This is deep object 1', obj: { foo: 'foo', bar: 'bar', baz: 'baz' } };
   let d3 = { name: 'D1', desc: 'This is deep object 2', obj: { foo: 'foo', bar: 'bar', baz: 'xxx' } };

   console.log('01: ' + JxValidate.equals(o1, o2) + '\t expecting TRUE');
   console.log('02: ' + JxValidate.equals(o1, o3) + '\t expecting FALSE');
   console.log('03: ' + JxValidate.equals(o2, o3) + '\t expecting FALSE');
   console.log('04: ' + JxValidate.equals(d1, d2) + '\t expecting TRUE');
   console.log('05: ' + JxValidate.equals(d1, d3) + '\t expecting FALSE');
   console.log('06: ' + JxValidate.equals(d2, d3) + '\t expecting FALSE');
   console.log('07: ' + JxValidate.equals(o1, d1) + '\t expecting FALSE');

   console.log('t1: ' + typeof JSON.stringify(d1));
   console.log('t2: ' + typeof JSON.stringify(d2));

   console.log('x1: ' + JSON.stringify(d1));
   console.log('x2: ' + JSON.stringify(d2));
   console.log('x3: ' + (JSON.stringify(d1) == JSON.stringify(d2)));
   console.log('x4: ' + (JSON.stringify(d1) === JSON.stringify(d2)));
}

function testUrlValidations() {
   const URL_LIST = [
      'http://foo.bar.com:1234/some/path?query=string#target',
      'https://foo.bar.com:1234/some/path?query=string#target',
      'ftp://foo.bar.com:1234/some/path?query=string#target',
      'ftps://foo.bar.com:1234/some/path?query=string#target',
      'xxx://foo.bar.com:1234/some/path?query=string#target',
      '://foo.bar.com:1234/some/path?query=string#target',
      '//foo.bar.com:1234/some/path?query=string#target',
      'https:/foo.bar.com:1234/some/path?query=string#target',
      'https:foo.bar.com:1234/some/path?query=string#target',
      'https//foo.bar.com:1234/some/path?query=string#target',
      'bar.com:1234/some/path?query=string#target',
      'bar.com:1234',
      'ws://foo.bar.com:1234/some/path?query=string#target',
      'wss://foo.bar.com:1234/some/path?query=string#target',
      'file://foo.bar.com',
      'file://foo.bar.com:1234',
      'file://foo.bar.com/some/path',
      'foo://foo.bar.com:1234/some/path?query=string#target',
      'bar://foo.bar.com:1234/some/path?query=string#target',
   ];

   // JxValidate.log.setLevel(JxLogger.DEBUG);

   URL_LIST.forEach((url, idx) => {
      console.log(JxValidate.isURL(url) + ' : ' + url);
   });

   // JxValidate.log.setLevel(JxLogger.DEBUG);

   console.log('-------------------------------------------------------------------');
   let proto1 = 'https';
   console.log('PROTO: ' + proto1);

   URL_LIST.forEach((url, idx) => {
      console.log(JxValidate.isURL(url, proto1) + ' : ' + url);
   });

   console.log('-------------------------------------------------------------------');
   let proto2 = ['ftp', 'http'];
   console.log('PROTO: ' + proto2);

   URL_LIST.forEach((url, idx) => {
      console.log(JxValidate.isURL(url, proto2) + ' : ' + url);
   });

   console.log('-------------------------------------------------------------------');
   let proto3 = ['file', 'xxx'];
   console.log('PROTO: ' + proto3);

   URL_LIST.forEach((url, idx) => {
      console.log(JxValidate.isURL(url, proto3) + ' : ' + url);
   });
}

function testObjectType() {
   const OBJS = [
      { type: 'null', obj: null },
      { type: 'undefined', obj: undefined },

      { type: 'string', obj: 'foo bar' },
      { type: 'string', obj: new String('foo bar') },
      { type: 'string', obj: String('foo bar') },

      { type: 'integer', obj: 12 },
      { type: 'integer', obj: parseInt('12') },

      { type: 'double', obj: 12.1 },
      { type: 'double', obj: parseFloat('12.3') },

      { type: 'boolean', obj: true },
      { type: 'boolean', obj: false },
      { type: 'boolean', obj: new Boolean(true) },
      { type: 'boolean', obj: new Boolean(false) },
      { type: 'boolean', obj: Boolean(true) },
      { type: 'boolean', obj: Boolean(false) },

      { type: 'date', obj: new Date() },

      { type: 'array', obj: [] },
      { type: 'array', obj: new Array() },

      { type: 'function', obj: () => {} },
      { type: 'function', obj: function () {} },

      { type: 'regex', obj: /^[a-z]+$/ },
      { type: 'regex', obj: /^[a-z]+$/gi },

      { type: 'object', obj: {} },
      { type: 'object', obj: new Object() },
      { type: 'object', obj: JSON.parse('{}') },
   ];

   console.log('===========================================================================================================');

   OBJS.forEach((obj, idx) => {
      console.log('----------------------------------------------------------------------------------------------');
      let ret = JxValidate.getType(obj.obj);
      console.log('>> ' + (idx + 1) + ': type: ' + obj.type + ', ret: ' + ret + ', match: ' + (ret === obj.type ? 'YES' : 'ERROR'));
   });
}

// testObject();
//testUrlValidations();
// testObjectType();
