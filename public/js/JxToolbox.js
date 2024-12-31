/*
 * Copyright (C) 2020 by Christian Jean.
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

var JxToolbox = (function () {
   const log = JxLogger.getInstance('JxToolbox', JxLogger.WARN);

   //-------------------------------------------------------------------
   // Private Variables...
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxToolbox';
   const MODULE_VERSION = '1.0.1';

   let module_hashcode = null;

   var DEBUG_TO_SCREEN = false;

   //-------------------------------------------------------------------
   // Constructor...
   //-------------------------------------------------------------------

   init();

   //-------------------------------------------------------------------
   // Private Methods...
   //-------------------------------------------------------------------

   /**
    * Initialize our questionnaire.
    */
   function init() {
      log.info('Initializing ' + MODULE_NAME);
      module_hashcode = generateRandomHashcode();
   }

   /**
    * Note that EDGE is essentially Chrome now, so EDGE should return Chrome.
    *
    * Have not tested on older IE browsers.
    */
   function getBrowser() {
      var browser = 'Unknown';

      c = navigator.userAgent.search('Chrome');
      f = navigator.userAgent.search('Firefox');
      m8 = navigator.userAgent.search('MSIE 8.0');
      m9 = navigator.userAgent.search('MSIE 9.0');

      if (c > -1) {
         browser = 'Chrome';
      } else if (f > -1) {
         browser = 'Firefox';
      } else if (m9 > -1) {
         browser = 'MSIE 9.0';
      } else if (m8 > -1) {
         browser = 'MSIE 8.0';
      }

      return browser;
   }

   /**
    * An alternate solution which also provides version number.
    */
   function getBrowser2() {
      var ua = navigator.userAgent,
         tem,
         M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

      if (/trident/i.test(M[1])) {
         tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
         return 'IE ' + (tem[1] || '');
      }

      if (M[1] === 'Chrome') {
         tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
         if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }

      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);

      return M.join(' ');
   }

   function getDetails() {
      return navigator.userAgent;
   }

   function isChrome() {
      return getBrowser() === 'Chrome';
   }

   function isFirefox() {
      return getBrowser() === 'Firefox';
   }

   function isEDGE() {
      return getBrowser() === 'Chrome';
   }

   function isIE() {
      return getBrowser().startsWith('MSIE') >= 0;
   }

   function isUnknownBrowser() {
      return getBrowser() === 'Unknown';
   }

   /**
    * Browser version this time and not traditional module version.
    */
   function getBrowserVersion() {
      var ua = navigator.userAgent,
         tem,
         M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

      if (/trident/i.test(M[1])) {
         tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
         return 'IE ' + (tem[1] || '');
      }

      if (M[1] === 'Chrome') {
         tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
         if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }

      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);

      return M[1];
   }

   /**
    * Generate a random UUIDv4 string
    */
   function getUUIDv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
         return v.toString(16);
      });
   }

   /**
    * Get a random number between two specified values.
    *
    * Minimum is inclusive and maximum is exclusive.
    */
   function getRand(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
   }

   /**
    * List the browser's media devices.
    */
   function listMediaDevices(type) {
      log.error('Listing devices:');

      navigator.mediaDevices
         .enumerateDevices()
         .then((devices) => {
            devices.forEach((device) => {
               var idx = device.kind.indexOf(type || '');
               if (!type || (type && idx >= 0)) console.log(' >> Type: ' + device.kind + ', Label: ' + device.label + ' [ID: ' + device.deviceId + ', Group ID: ' + device.groupId + ']');
            });
         })
         .catch((err) => {
            log.error('ERROR: ' + err.message);
         });
   }

   /**
    * Will get a UTC date formated in ISO-8601.
    *
    *  UTC         2020-05-05T18:23:12Z
    *  ISO-8601    2020-05-05T18:23:12+0000
    *
    * It is not 'true' ISO since we've also included the milliseconds.
    */
   function getDate(date) {
      var d = date || new Date();
      return (
         d.getUTCFullYear().toString().padStart(4, '0') +
         '-' +
         (d.getUTCMonth() + 1).toString().padStart(2, '0') +
         '-' +
         d.getUTCDate().toString().padStart(2, '0') +
         'T' +
         d.getUTCHours().toString().padStart(2, '0') +
         ':' +
         d.getUTCMinutes().toString().padStart(2, '0') +
         ':' +
         d.getUTCSeconds().toString().padStart(2, '0') +
         '.' +
         String((d.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) +
         'Z'
      );
   }

   /**
    * Provide a unique ID for this instance.
    *
    * @param {Number} maximum length of ID to return (optional).
    *
    * @returns {String} the ID representation of this instance.
    */
   function hashCode(max) {
      let id = module_hashcode;
      if (max && typeof max === 'number') {
         if (max < 4) max = 4;
         if (max > id.length) max = id.length;
         id = module_hashcode.substring(0, max);
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

   function getName() {
      return MODULE_NAME;
   }

   /**
    * Provide the version of this component.
    */
   function getVersion() {
      return MODULE_VERSION;
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

      status.push('browser: ' + getBrowser());
      status.push('broser version: ' + getBrowserVersion());
      status.push('user-agent: ' + getDetails());

      var text = getName() + '@' + hashCode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //-------------------------------------------------------------------
   // Exported Methods...
   //-------------------------------------------------------------------

   return {
      getBrowser: getBrowser,
      getBrowser2: getBrowser2,

      isEDGE: isEDGE,
      isChrome: isChrome,
      isFirefox: isFirefox,
      isIE: isIE,

      isUnknownBrowser: isUnknownBrowser,
      getBrowserVersion: getBrowserVersion,

      listMediaDevices: listMediaDevices,

      getRand: getRand,
      getUUIDv4: getUUIDv4,
      getDate: getDate,

      getVersion: getVersion,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

console.log('Loading: ' + JxToolbox.toString());
