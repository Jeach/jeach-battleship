/*
 * Copyright (C) 2019 by Christian Jean.
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

/**
 * Provide a short description of what this module does.
 *
 * @since  2019.12.03
 * @author Christian Jean
 */
const JxTemplate = (function () {
   //-------------------------------------------------------------------
   // Module variables
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxTemplate';
   const MODULE_VERSION = '1.0.0';

   //-------------------------------------------------------------------
   // If this is a Node.js environment, you will need to uncomment the
   // following dependency import. You will need to also add every other
   // dependencies this module requires.
   //
   // If it is for a web application, the dependencies may be deleted.
   // Although, each dependency will need to be loaded with a 'script'
   // element, such as:
   //
   // <script src="/path/to/module/JxTemplate.js"></script>;
   //-------------------------------------------------------------------

   // const JxLogger = require('../utils/JxLogger');

   //-------------------------------------------------------------------
   // Private variables
   //-------------------------------------------------------------------

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.WARN);

   const moduleHashcode = generateRandomHashcode();

   //-------------------------------------------------------------------
   // Constructor...
   //-------------------------------------------------------------------

   init();

   /**
    * Initialize our module.
    *
    * @author Christian Jean
    * @since  2023.03.05
    */
   function init() {
      log.info("Initializing '" + MODULE_NAME + "' module");

      log.debug(' > Version  : ' + getVersion());
      log.debug(' > Hashcode : ' + moduleHashcode);
      log.debug(' > Args     : ' + arguments.length);
   }

   //-------------------------------------------------------------------
   // Private module functions...
   //-------------------------------------------------------------------

   /**
    * Provide a unique ID for this instance.
    *
    * If no 'max' value is provided, it will default to 8 digits.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {Number} maximum length of ID to return (optional).
    *
    * @returns {String} the ID representation of this instance.
    */
   function hashCode(max = 8) {
      let id = moduleHashcode;
      if (max && typeof max === 'number') {
         if (max < 4) max = 4;
         if (max > id.length) max = id.length;
         id = moduleHashcode.substring(0, max);
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
    * Get the module name.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns the name of this module as a string.
    */
   function getName() {
      return MODULE_NAME;
   }

   /**
    * Provide the version of this module.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns the version number of this module as a string.
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

      var text = getName() + '@' + hashCode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //------------------------------------------------------------------------
   // Private domain functions...
   //------------------------------------------------------------------------

   /**
    * Sample private function.
    *
    * These functions can only be invoked internally from this module, as they
    * are not exported (see 'Export public domain functions' below).
    *
    * You can add as many private functions as required to implement your
    * module.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {Object} describe this return object.
    */
   function barfoo() {
      log.info("Ideally, use an unprefixed 'info' log at every function entry.");

      log.debug(" >> Use prefixed 'debug' logs within the function body.");
      log.trace(" >> Use prefixed 'trace' logs for extra verbose information.");
      log.debug(" >> By 'prefixed', we mean using a ' >>' to start each log.");

      log.debug(' >> Setting your logger level to (line 35 above):');
      log.debug(' >> JxLogger.WARN, will allow you to get an application flow.');
      log.debug(' >> JxLogger.DEBUG, will allow you to get more detailed outoput.');
      log.trace(' >> JxLogger.TRACE, will allow you to get extremely verbose logging.');

      log.debug(" >> See the 'JxLogger' module documentation for all log-levels available.");
   }

   //------------------------------------------------------------------------
   // Public domain functions...
   //------------------------------------------------------------------------

   /**
    * Sample publid function.
    *
    * These functions can be invoked both internally within this module and
    * externally from outside the module (ie: JxTemplate.foobar()).
    *
    * For each public function added to this section, they must also be
    * 'exported' below (see 'Export public domain functions' below).
    *
    * You can add and export as many functions as required to implement your
    * module.
    *
    * @param {String} param1 describe what this parameter is for.
    * @param {Number} param2 describe what this parameter is for.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {Object} describe this return object.
    */
   function foobar(param1, param2) {
      log.info("Ideally, use an unprefixed 'info' log at every function entry.");

      log.debug(" >> Use prefixed 'debug' logs within the function body.");
      log.trace(" >> Use prefixed 'trace' logs for extra verbose information.");
      log.debug(" >> By 'prefixed', we mean using a ' >>' to start each log.");

      log.debug(' >> Setting your logger level to (line 35 above):');
      log.debug(' >> JxLogger.WARN, will allow you to get an application flow.');
      log.debug(' >> JxLogger.DEBUG, will allow you to get more detailed outoput.');
      log.trace(' >> JxLogger.TRACE, will allow you to get extremely verbose logging.');

      log.debug(" >> See the 'JxLogger' module documentation for all log-levels available.");
   }

   //-------------------------------------------------------------------
   // Exported functions and constants
   //-------------------------------------------------------------------

   return {
      // Export public domain functions
      foobar: foobar,

      // Export public module functions
      getName: getName,
      getVersion: getVersion,
      hashCode: hashCode,
      getObject: getObject,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

/**
 * If you are using this module within the Node.js environment, you will need
 * to uncomment the following 'module.exports' line.
 *
 * If you are using this module within a web application, leave the export line
 * commented as it is not required.
 */

// module.exports = JxTemplate;

console.log('Loading: ' + JxTemplate.toString());
