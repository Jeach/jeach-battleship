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

var WebAppTemplate = (function () {
   //-------------------------------------------------------------------
   // Module variables
   //-------------------------------------------------------------------

   const MODULE_NAME = 'WebAppTemplate';
   const MODULE_VERSION = '1.0.0';

   //-------------------------------------------------------------------
   // Private variables
   //-------------------------------------------------------------------

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.DEBUG);

   const module_hashcode = generateRandomHashcode();

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
      log.debug(' > Hashcode : ' + module_hashcode);
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

   //---------------------------------------------------------------------------------------------
   // Private domain functions...
   //---------------------------------------------------------------------------------------------
   // These functions can only be invoked internally (from this module), as they are not exported
   // (see 'Export public domain functions').
   //
   // As many functions as required can be added here.
   //---------------------------------------------------------------------------------------------
  

   //---------------------------------------------------------------------------------------------
   // Public domain functions...
   //---------------------------------------------------------------------------------------------
   // These functions can be invoked both internally within this module and externally from
   // outside the module (ie: WebAppTemplate.foobar()).
   //
   // For each public function added to this section, they must also be 'exported' below
   // (see 'Export public domain functions').
   //
   // You can add and export as many functions as required.
   //---------------------------------------------------------------------------------------------

   /**
    * Populate the layout with fake 'lorem ipsum' data.
    *
    * @author  Christian Jean
    * @since   1.0.0
    */
   function initContent() {
      log.info('Initializing the web app content');
   }

   //-------------------------------------------------------------------
   // Exported functions and constants
   //-------------------------------------------------------------------

   return {
      // Export public domain functions
      initContent: initContent,

      // Export public module functions
      getName: getName,
      getVersion: getVersion,
      hashCode: hashCode,
      getObject: getObject,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

console.log('Loading: ' + WebAppTemplate.toString());
