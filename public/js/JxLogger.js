/*
 * Copyright (C) 2020-2023 Christian Jean
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

/*
   ------------------------------------------------------------------------------
   TODO - Provide support for DevTools's features:
   ------------------------------------------------------------------------------
    --  The 'time(label)' and 'timeEnd(label)' - to provide benchmarks
    --  The 'console.trace()' - to dump a stack trace
    --  The 'console.table(..)' - to dump in table format.
    --  The 'group(lable)' and 'groupEnd(label)' - to regroup (debug/trace) under 
    --  info (when optionally enabled).
    --  Possibly look at remote logging with JSON and converting into a 'true'
        syslogd log.
*/

//-------------------------------------------------------------------
// Define our log level constants
//-------------------------------------------------------------------
const FATAL = 0; // Unrecoverable situations
const ERROR = 1; // Major errors (but recoverable)
const WARN = 2; // Warning (undesired)
const INFO = 3; // Low verbosity (ie: function entry)
const DEBUG = 4; // Medium verbosity (ie: function exit)
const TRACE = 5; // High verbosity (ie: everything in between)

const PRINT = 9; // Non-validated level, it just always prints

//-------------------------------------------------------------------
// This should work for most browsers. Adjust if not.
//-------------------------------------------------------------------
const MAGIC_OFFSET = 3;

//-------------------------------------------------------------------
// Force (override) all loggers to use this level.
//-------------------------------------------------------------------
var OVERRIDE_ALL_TO_LEVEL = FATAL;

var JeachLoggerInstance = function (name, level) {
   //-------------------------------------------------------------------
   // Private Variables...
   //-------------------------------------------------------------------

   const NAME = 'JeachLoggerInstance';
   const VERSION = '1.3.0';

   const REMOTE_LOGGING = false;
   const REMOTE_LOGGING_URL = '/api/v1/log';

   const LOG = false;

   let module_hashcode = null;

   var instanceName = name;
   var instanceLevel = level || WARN;

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
      if (LOG) console.log('Initializing ' + NAME);

      module_hashcode = generateRandomHashcode();

      setLevel(level);

      if (LOG) console.log(" >> Name  : '" + getName() + "'");
      if (LOG) console.log(' >> Level : ' + getLevel());
   }

   function getName() {
      return instanceName;
   }

   function getLevel() {
      return instanceLevel;
   }

   /**
    * We should probably reuse the one from the singleton.
    */
   function getLevelName(level) {
      var ll = level || instanceLevel;
      var name = 'Unknown';

      switch (ll) {
         case FATAL:
            name = 'Fatal';
            break;
         case ERROR:
            name = 'Error';
            break;
         case WARN:
            name = 'Warn';
            break;
         case INFO:
            name = 'Info';
            break;
         case DEBUG:
            name = 'Debug';
            break;
         case TRACE:
            name = 'Trace';
            break;
      }

      return name;
   }

   function getLevelSymbol() {
      return getLevelName().substring(0, 1);
   }

   function setLevel(level) {
      var before = getLevelName();
      var after = null;

      if (level >= FATAL && level <= TRACE) {
         instanceLevel = level;
      } else {
         instanceLevel = WARN;
      }

      after = getLevelName();

      if (before !== after) _log('X', "Set level from '" + before + "' to '" + after + "'");
   }

   function setToFatal() {
      setLevel(FATAL);
   }
   function setToError() {
      setLevel(ERROR);
   }
   function setToWarn() {
      setLevel(WARN);
   }
   function setToInfo() {
      setLevel(INFO);
   }
   function setToDebug() {
      setLevel(DEBUG);
   }
   function setToTrace() {
      setLevel(TRACE);
   }

   function isFatal() {
      return instanceLevel === FATAL;
   }

   function isError() {
      return instanceLevel === ERROR;
   }

   function isWarn() {
      return instanceLevel === WARN;
   }

   function isInfo() {
      return instanceLevel === INFO;
   }

   function isDebug() {
      return instanceLevel === DEBUG;
   }

   function isTrace() {
      return instanceLevel === TRACE;
   }

   /**
    * Will get a UTC date formated in ISO-8601.
    *
    *  UTC         2020-05-05T18:23:12Z
    *  ISO-8601    2020-05-05T18:23:12+0000
    *
    * Although, it is not 'true' ISO since we've also included the milliseconds.
    */
   function getDate() {
      var d = new Date();
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

   //---------------------------------------------------------------------------------------------
   // Logging functions
   //---------------------------------------------------------------------------------------------

   function fatal(text) {
      if (instanceLevel >= FATAL || OVERRIDE_ALL_TO_LEVEL >= FATAL) _log('F', text);
   }

   function error(text) {
      if (instanceLevel >= ERROR || OVERRIDE_ALL_TO_LEVEL >= ERROR) _log('E', text);
   }

   function warn(text) {
      if (instanceLevel >= WARN || OVERRIDE_ALL_TO_LEVEL >= WARN) _log('W', text);
   }

   function info(text) {
      if (instanceLevel >= INFO || OVERRIDE_ALL_TO_LEVEL >= INFO) _log('I', text);
   }

   function debug(text) {
      if (instanceLevel >= DEBUG || OVERRIDE_ALL_TO_LEVEL >= DEBUG) _log('D', text);
   }

   function trace(text) {
      if (instanceLevel >= TRACE || OVERRIDE_ALL_TO_LEVEL >= TRACE) _log('T', text);
   }

   /**
    * Unconditional logging (no 'level' checks). Can be used for things like 'toString()'
    * and dump lists of information, etc.
    */
   function print(text) {
      _log('P', text);
   }

   function _log(symbol, text) {
      var trace = getStackTrace(this);
      var data = [];

      data.push('[' + getDate() + ']');
      data.push('[' + symbol + ']');
      data.push('[' + getName() + ']');

      if (trace) {
         data.push('[' + trace.name);
         data.push('(' + trace.line);
         // data.push(":" + trace.column);
         data.push(')]');
      }

      data.push('> ' + text);

      // Use appropriate DevTool function
      switch (symbol) {
         case 'F':
         case 'E':
            console.error(data.join('')); // DevTools - error level
            break;
         case 'W':
            console.warn(data.join('')); // DevTools - warning level
            break;
         case 'I':
            console.info(data.join('')); // Devtools - info level
            break;
         case 'D':
            console.debug(data.join('')); // DevTools - verbose level
            break;
         case 'T':
            console.log(data.join('')); // DevTools - verbose level
            break;
         case 'P':
            console.log(data.join('')); // DevTools - verbose level
            break;
      }

      if (REMOTE_LOGGING) _remoteLog(data.join(''));
   }

   /**
    * Will send the logs to the Node.js server.
    *
    * DO NOT USE THE LOGGER IN THIS FUNCTION!!!
    *
    * Otherwise, it will create a recursive call chain.
    */
   function _remoteLog(message) {
      $.ajax({
         type: 'POST',
         contentType: 'application/json',
         url: REMOTE_LOGGING_URL,
         dataType: 'json',
         data: JSON.stringify({ message: message }),
         success: function (result) {},
         error: function (xhr, ops, exception) {
            console.error(`ERROR: status=${xhr.status}, exception='${xhr.responseText}'`);
         },
      });
   }

   function getStackTrace(caller) {
      // Firefox bug - will be fixed in commit f108134
      if (!Error.captureStackTrace) return null;

      var original = Error.prepareStackTrace;
      var error = {};
      Error.prepareStackTrace = prepareStackTrace;
      Error.captureStackTrace(error, caller || getStackTrace);
      var stack = error.stack;
      Error.prepareStackTrace = original;
      return stack;
   }

   function prepareStackTrace(error, structuredStackTrace) {
      var trace = structuredStackTrace[MAGIC_OFFSET];

      var name = trace.getMethodName() || trace.getFunctionName() || '<anonymous>';
      var idx = name.lastIndexOf('.');

      if (idx >= 0) name = name.substring(idx + 1);

      return {
         name: name,
         file: trace.getFileName(),
         line: trace.getLineNumber(),
         column: trace.getColumnNumber(),
      };
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

   //---------------------------------------------------------------------------------------------
   // Support functions
   //---------------------------------------------------------------------------------------------

   function getVersion() {
      return VERSION;
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
      status.push('level: ' + getLevel());
      status.push('level name: ' + getLevelName());
      status.push('global level: ' + OVERRIDE_ALL_TO_LEVEL);
      status.push('global level name: ' + getLevelName(OVERRIDE_ALL_TO_LEVEL));

      var text = getName() + '@' + hashCode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //-------------------------------------------------------------------
   // Exported Methods...
   //-------------------------------------------------------------------

   return {
      // Export our Constants
      FATAL: FATAL,
      ERROR: ERROR,
      WARN: WARN,
      INFO: INFO,
      DEBUG: DEBUG,
      TRACE: TRACE,

      fatal: fatal,
      error: error,
      warn: warn,
      info: info,
      trace: trace,
      debug: debug,

      print: print,

      getName: getName,
      getLevel: getLevel,
      setLevel: setLevel,

      setToFatal: setToFatal,
      setToError: setToError,
      setToWarn: setToWarn,
      setToInfo: setToInfo,
      setToTrace: setToTrace,
      setToDebug: setToDebug,

      getVersion: getVersion,
      toString: toString,
   };
};

/**
 * The 'JeachLogger' is a singleton logging factory, allowing to create
 * logging instances.
 *
 * Usage:
 *
 *    const JeachLogger = require('../utils/JeachLogger');
 *
 *    const log1 = JeachLogger.getInstance('BarFoo', JeachLogger.WARN);
 *    const log2 = JeachLogger.getInstance('FooBar', JeachLogger.DEBUG);
 *
 *    log1.debug("This is a 'debug' statement for the 'BarFoo' module.");
 *    log1.warn("This is a 'warning' statement for the 'BarFoo' module.");
 *
 *    log2.info("This is an 'info' statement for the 'FooBar' module.");
 *    log2.error("This is an 'error' statement ofr the 'FooBar' module.");
 */
var JxLogger = (function () {
   //-------------------------------------------------------------------
   // Private Variables...
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxLogger';
   const MODULE_VERSION = '1.2.0';

   const log = new JeachLoggerInstance(MODULE_NAME, WARN);

   let module_hascode = null;

   const INSTANCES = {};

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
      log.info('Initializing ' + MODULE_NAME + ' (factory)');
      module_hashcode = generateRandomHashcode();
   }

   function setLevel(name, level) {
      if (!name || !level) return;
      if (INSTANCES[name]) INSTANCES[name].setLevel(level);
   }

   /**
    * Will set the 'OVERRIDE_ALL_TO_LEVEL' to the specified level.
    */
   function setOverrideLevel(level) {
      if (level >= FATAL && level <= DEBUG) {
         OVERRIDE_ALL_TO_LEVEL = level;
         log.warn("WARNING: Setting 'OVERRIDE_ALL_TO_LEVEL' level to '" + getLevelName(level) + "'");
      }
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

   function setToFatal(name) {
      setLevel(name, FATAL);
   }
   function setToError(name) {
      setLevel(name, ERROR);
   }
   function setToWarn(name) {
      setLevel(name, WARN);
   }
   function setToInfo(name) {
      setLevel(name, INFO);
   }
   function setToTrace(name) {
      setLevel(name, TRACE);
   }
   function setToDebug(name) {
      setLevel(name, DEBUG);
   }

   function getInstanceCount() {
      var count = 0;

      for (var instance in INSTANCES) {
         if (INSTANCES[instance]) count++;
      }

      return count;
   }

   function getInstances() {
      var instances = [];

      for (var instance in INSTANCES) {
         if (INSTANCES[instance]) instances.push(INSTANCES[instance].toString());
      }

      return instances; //.join(' ');
   }

   function getLevelName(level) {
      var ll = level || instanceLevel;
      var name = 'Unknown';

      switch (ll) {
         case FATAL:
            name = 'Fatal';
            break;
         case ERROR:
            name = 'Error';
            break;
         case WARN:
            name = 'Warn';
            break;
         case INFO:
            name = 'Info';
            break;
         case TRACE:
            name = 'Trace';
            break;
         case DEBUG:
            name = 'Debug';
            break;
      }

      return name;
   }

   function getName() {
      return MODULE_NAME;
   }

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
      status.push('instance count: ' + getInstanceCount());
      status.push('instances: ' + JSON.stringify(getInstances()));

      var text = getName() + '@' + hashCode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //-------------------------------------------------------------------
   // Exported Methods...
   //-------------------------------------------------------------------

   return {
      // Export our Constants
      FATAL: FATAL,
      ERROR: ERROR,
      WARN: WARN,
      INFO: INFO,
      DEBUG: DEBUG,
      TRACE: TRACE,

      getName: getName,
      getVersion: getVersion,
      toString: toString,

      getInstanceCount: getInstanceCount,
      getInstances: getInstances,

      getInstance: function (name, level) {
         var instance = null;

         log.info("Getting an instance for '" + name + "'");

         if (!name) return instance;

         if (INSTANCES[name]) instance = INSTANCES[name];
         else INSTANCES[name] = instance = new JeachLoggerInstance(name, level);

         return instance;
      },

      setLevel: setLevel,
      setOverrideLevel: setOverrideLevel,

      setToFatal: setToFatal,
      setToError: setToError,
      setToWarn: setToWarn,
      setToInfo: setToInfo,
      setToDebug: setToDebug,
      setToTrace: setToTrace,
   };
})(); // Our IIFE function is invoked here

console.log('Loading: ' + JxLogger.toString());
