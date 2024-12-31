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
var JxString = (function () {
   //-------------------------------------------------------------------
   // Module variables
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxString';
   const MODULE_VERSION = '1.1.1';

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

      status.push('Version: ' + getVersion());

      var text = getName() + '@' + getHashcode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //---------------------------------------------------------------------------------------------
   // Private domain functions
   //---------------------------------------------------------------------------------------------

   /**
    * Will ensure the string provided is in 'title' case.
    *
    * This means that every word of the string will start with a capital
    * letter. Compound words will also be set to upper case.
    *
    * Examples:
    *
    *  foo bar                -> Foo Bar
    *  some compound-word     -> Some Compound-Word
    *
    * @see capitalizeWord
    *
    * @param {String} str to apply a title case to.
    *
    * @return {String} a string with every word being capitalized.
    */
   function titleCase(str) {
      let ss = [];
      if (!str) return;
      let parts = str.match(/\b(\w+\W+)/g);
      parts.forEach((w, i) => {
         w = w.trim();
         ss.push(w[0].toUpperCase() + w.substring(1));
      });
      return ss.join(' ');
   }

   /**
    * Will capitalize a word.
    *
    * Note that this is different that 'titleCase(..)' where every word in a
    * string will get capitalized. This is for a single word.
    *
    * @see titleCase
    *
    * @param {String} word to capitalize.
    *
    * @returns {String} a capitalized word
    */
   function capitalizeWord(word) {
      log.debug('Capitalizing a word');
      log.debug(" >> Word  : '" + word + "'");
      let capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      log.debug(" >> Final : '" + capitalized + "'");
      return capitalized;
   }

   /**
    * Will substitute a character at a given position (index) with one
    * provided.
    *
    * Example:
    *
    *    'Mendy', 1, 'a'      =>  'Mandy'
    *    'Foo Bar', 2, 'x'    =>  'Fox Bar'
    *
    * @param {String} str is the source string.
    * @param {Number} index position in 'src' to substitute.
    * @param {String} chr is the character to substitute with.
    *
    * @returns a new string with substitution made.
    */
   function setCharAt(str, index, chr) {
      log.info("Replacing charcter '" + chr + "' at index " + index + " of '" + str + "'");
      if (index < 0 || index > str.length - 1) return str;
      return str.substring(0, index) + chr + str.substring(index + 1);
   }

   /**
    * Will scan a string, searching for a character and return the index
    * positions where that character (letter) was found.
    *
    * Example:
    *
    *   'Foo Bar'       'o'  =>  [ 1, 2 ]
    *   'Bar Foo'       'o'  =>  [ 5, 6 ]
    *   'Hello World'   'l'  =>  [ 2, 3, 9 ]
    *
    * @param {String} str to scan for index positions.
    * @param {String} letter a character to scan for.
    *
    * @returns an array of index positions.
    */
   function indicesOf(value, letter) {
      let indices = [];
      // log.debug(' ## Value: ' + value + ', letter: ' + letter);
      if (!value || !letter) return null;
      for (var i = 0; i < value.length; i++) {
         // log.debug(' >> Letter ' + i + ': ' + value[i]);
         if (value[i] == letter) indices.push(i);
      }
      return indices.length > 0 ? indices : null;
   }

   /**
    * Left pad the string with the proposed character ('chr') so that it
    * fits a total of 'length' characters long.
    *
    * If the padding character ('chr') is not provided, it will default
    * to a whitespace (' ') character.
    *
    * Example:
    *
    *  '1.4', 3, '0'    =>  "1.400
    *  '1.42', 3, '0'   =>  "1.420
    *
    * @param {String} str to pad.
    * @param {Number} length of overal textual output.
    * @param {String} chr to pad with.
    *
    * @returns a newly padded string.
    */
   function lpad(str, length, chr) {
      log.info('Left padding string');
      chr = chr || ' ';
      return String(str).padStart(length, chr);
   }

   /**
    * Right pad the string with the proposed character ('chr') so that it
    * fits a total of 'length' characters long.
    *
    * If the padding character ('chr') is not provided, it will default
    * to a whitespace (' ') character.
    *
    * Example:
    *
    *  '1.4', 3, '0'    =>  "1.400
    *  '1.42', 3, '0'   =>  "1.420
    *
    * @param {String} str to pad.
    * @param {Number} length of overal textual output.
    * @param {String} chr to pad with.
    *
    * @returns a newly padded string.
    */
   function rpad(str, length, chr) {
      log.info('Right padding string');
      chr = chr || ' ';
      let t = typeof str;
      if (t == 'number') str = '' + str;
      let len = length - str.length;
      if (len > 0) str = str + lpad('', len, chr);
      return str;
   }

   /**
    * Center pad a string, based on a unique 'delimiter' character.
    *
    * This is useful for example, to align a curency value where the
    * left portion is space padded, and the right portion is zero padded.
    *
    * Example:
    *
    *  '.2', '.', 3, ' ', 3, '0'      =>  "    .200"
    *  '1.4', '.', 3, ' ', 3, '0'      =>  "  1.400"
    *  '11.42', '.', 3, ' ', 3, '0'    =>  " 11.420"
    *  '111.423', '.', 3, ' ', 3, '0'  =>  "111.423"
    *
    * @param {String} str to pad.
    * @param {Delimiter} delim character.
    * @param {Number} lLen is the left length.
    * @param {String} lChr is the left character to pad with.
    * @param {Number} rLen is the right length.
    * @param {String} rChr is the right character to pad with.
    *
    * @returns a newly padded string.
    */
   function cpad(str, delim, lLen, lChr, rLen, rChr) {
      log.info('Center padding string');
      let parts = str.split(delim);
      return lpad(parts[0], lLen, lChr) + delim + rpad(parts[1], rLen, rChr);
   }

   /**
    *
    * @param {Array<Object>} array of key/value objects.
    *
    * @return Nothing
    */
   function inline(array, printer, prefix = '') {
      let labels = [];
      let values = [];
      let len = 0;
      array.forEach((item) => {
         let parts = item.split(':');
         let key = parts[0];
         parts.shift();
         let val = parts.join();
         if (key.length > len) len = key.length;
         labels.push(key);
         values.push(val);
      });

      labels.forEach((label, idx) => {
         printer(prefix + label + '                           '.substring(0, len - label.length) + ' : ' + values[idx]);
      });
   }

   /**
    * Get a formated byte size expression using the 'International Electrotechnical
    * Commission' (IEC).
    *
    * The international standard IEC 80000-13 uses the term 'byte' to mean eight
    * bits (1 B = 8 bit). Therefore, 1 kB = 8000 bit. One thousand kilobytes
    * (1000 kB) is equal to one megabyte (1 MB), where 1 MB is one million bytes.
    * A kibibyte is 1024 bytes.
    *
    * The International System of Units (SI) defines its prefixes as multiplication
    * factor of 1000. The term 'kilobyte' has traditionally been used to refer to
    * 1024 bytes (210 B). The usage of the metric prefix kilo for binary multiples
    * arose as a convenience, because 1024 is approximately 1000.
    *
    *    ------------------------------------------------------
    *    Binary                        Decimal
    *    ------------------------------------------------------
    *    Value    IEC Definition       Value    SI / Metric
    *    ------------------------------------------------------
    *    1024	   KiB or kibibyte      1024	   KB or kilobyte
    *    1024^2	MiB or mebibyte      1024^2   MB or megabyte
    *    1024^3	GiB or gibibyte      1024^3   GB or gigabyte
    *    1024^4	TiB or tebibyte      1024^4   TB or terabyte
    *    1024^5	PiB or pebibyte      1024^5   PB or petabyte
    *    1024^6	EiB or exbibyte      1024^6   EB or exabyte
    *    1024^7	ZiB or zebibyte      1024^7   ZB or zettabyte
    *    1024^8   YiB or yobibyte      1024^8   YB or yottabyte
    *      -       -        -          1024^9   RB or ronnabyte
    *      -       -        -          1024^10  QB or quettabyte
    *
    * @see JxIO.formatBytes
    *
    * @param {Number} bytes to calculate for visual output.
    * @param {Number} decimals is optional decimal rounding (default is 2 digits)
    *
    * @returns a string representation of the byte value.
    */
   function formatBytes(bytes, decimals = 2) {
      const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

      if (bytes <= 0) return '0 bytes';
      if (bytes == 1) return '0 byte';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${units[i]}`;
   }

   /**
    * Format a percentage value into a string.
    *
    * Example:
    *
    *    formatPct(value, decimals, suffix);
    *    formatPct(value, total, decimals, suffix);
    *
    * @param {Number} value to get percentage for.
    * @param {Number} total is the devisor.
    * @param {Number} decimals to show (default: 1).
    * @param {String} suffix to show (default: "%").
    *
    * @return {String} formated as a percentage.
    */
   function formatPct(value, total, decimals = 1, suffix = '%') {
      let percent = ((value / total) * 100).toFixed(decimals);
      return percent + suffix;
   }

   /**
    * Will format a date as ISO 8601.
    *
    * ISO 8601 represents date and time by starting with the year, followed
    * by the month, the day, the hour, the minutes, seconds and milliseconds.
    *
    * Example:
    *
    *    2020-07-10 15:00:00.000Z
    *
    * Parameters:
    *
    *    If 'date' is 'null', the current date will be used.
    *    If 'date' is a 'string', it will be converted to a date from string.
    *    If 'date' is a 'number', it will be converted to a date from epoch.
    *
    * @see ISO_8601 https://en.wikipedia.org/wiki/ISO_8601
    *
    * @author  Christian Jean
    * @since   v1.1.0
    *
    * @param {Date|String|Number} date value to format.
    * @param {Boolean} utc convert to UTC date (default: true).
    *
    * @returns an ISO 8601 formated date/time string.
    */
   function formatDate(date, utc = true) {
      log.info('Formatting date');
      log.debug(' >> Date : ' + date + ' (type: ' + typeof date + ')');
      log.debug(' >> UTC  : ' + utc);

      let dt = null;

      if (date == null) {
         dt = new Date();
      } else if (JxValidate.isString(date)) {
         dt = new Date(date);
      } else if (JxValidate.isNumber(date)) {
         dt = new Date(date * 1000);
         utc = true; // epoch is UTC!
      } else {
         dt = new Date();
      }

      let str = '';

      if (!utc) {
         str =
            dt.getFullYear().toString().padStart(4, '0') +
            '-' +
            (dt.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            dt.getDate().toString().padStart(2, '0') +
            'T' +
            dt.getHours().toString().padStart(2, '0') +
            ':' +
            dt.getMinutes().toString().padStart(2, '0') +
            ':' +
            dt.getSeconds().toString().padStart(2, '0') +
            '.' +
            String((dt.getMilliseconds() / 1000).toFixed(3)).slice(2, 5) +
            'Z';
      } else {
         str =
            dt.getUTCFullYear().toString().padStart(4, '0') +
            '-' +
            (dt.getUTCMonth() + 1).toString().padStart(2, '0') +
            '-' +
            dt.getUTCDate().toString().padStart(2, '0') +
            'T' +
            dt.getUTCHours().toString().padStart(2, '0') +
            ':' +
            dt.getUTCMinutes().toString().padStart(2, '0') +
            ':' +
            dt.getUTCSeconds().toString().padStart(2, '0') +
            '.' +
            String((dt.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) +
            'Z';
      }

      return str;
   }

   //-------------------------------------------------------------------
   // Exported functions and constants
   //-------------------------------------------------------------------

   return {
      setCharAt: setCharAt,
      indicesOf: indicesOf,

      lpad: lpad,
      rpad: rpad,
      cpad: cpad,

      inline: inline,

      formatBytes: formatBytes,
      formatPct: formatPct,
      formatDate: formatDate,

      titleCase: titleCase,
      capitalizeWord: capitalizeWord,

      getName: getName,
      getVersion: getVersion,
      getHashcode: getHashcode,
      getObject: getObject,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

module.exports = JxString;

console.log(JxString.toString());

function test() {
   console.log(JxString.toString());

   console.log('Pad left');
   for (var i = 1; i <= 100; i++) {
      console.log('$ ' + JxString.cpad(i + '.' + i, '.', 4, ' ', 3, '0') + ' <');
   }

   console.log('$ ' + JxString.cpad('.3', '.', 4, ' ', 3, '0') + ' <');
}
