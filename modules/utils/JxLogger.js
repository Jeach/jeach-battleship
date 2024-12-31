/*
 * Copyright (C) 2020 Christian Jean
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

const fs = require('fs');
const path = require('path');

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

//-------------------------------------------------------------------
// Set a default config file location and file name
//-------------------------------------------------------------------
const DEFAULT_LOGGER_CONFIG_NAME = 'jeach-logger.json';
const DEFAULT_LOGGER_CONFIG_WATCH_DELAY = 10000;

// The following will affect ALL logger instances (global)
let LOGGER_FILENAME = null; // Stream to a chosen log file.
let LOGGER_SUPPRESS_STDOUT = false; // Stream to STDOUT (or not).
let LOGGER_REDIRECTED_STDOUT = null; // Redirect all 'console.xxx()' to logger

const LOGGER_OPTIONS = {
   suppress: false, // Redirect all 'stdout' output (default: false)
   remove: false, // Delete the log file, if it exists (default: false)
   suffix: null, // Provide a filename suffix (default: 'null')
   extention: '.log', // Change the log file extention (default: '.log')
};

var JxLoggerInstance = function (name, level = JxLogger.WARN) {
   //-------------------------------------------------------------------
   // Private Variables...
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxLoggerInstance';
   const MODULE_VERSION = '1.12.0';

   const MODULE_HASHCODE = generateRandomHashcode();

   const CALLBACK_HANDLERS = [];
   let CALLBACK_LOGGING = true;

   const MODE_0666 = parseInt('0666', 8);

   const LOG = false;

   var instanceName = name;
   var instanceLevel = level || WARN;

   /**
    * Save original logging functions as we may
    * want to redirect 'console.xxxx()' output.
    */
   const REDIRECTED = {
      fatal: console.error,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
      trace: console.debug,
      print: console.log,
      log: console.log,
   };

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
      if (LOG) REDIRECTED.log("Initializing '" + MODULE_NAME + "'");

      setLevel(level);

      if (LOG) REDIRECTED.log(" >> Name  : '" + getName() + "'");
      if (LOG) REDIRECTED.log(' >> Level : ' + getLevel());
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
         case PRINT:
            name = 'Print';
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

      if (level >= FATAL && level <= PRINT) {
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

   function setToPrint() {
      setLevel(PRINT);
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

   function isPrint() {
      return instanceLevel === PRINT;
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

   function fatal(...text) {
      if (instanceLevel >= FATAL || OVERRIDE_ALL_TO_LEVEL >= FATAL) _log('F', ...text);
   }

   function error(...text) {
      if (instanceLevel >= ERROR || OVERRIDE_ALL_TO_LEVEL >= ERROR) _log('E', ...text);
   }

   function warn(...text) {
      if (instanceLevel >= WARN || OVERRIDE_ALL_TO_LEVEL >= WARN) _log('W', ...text);
   }

   function info(...text) {
      if (instanceLevel >= INFO || OVERRIDE_ALL_TO_LEVEL >= INFO) _log('I', ...text);
   }

   function debug(...text) {
      if (instanceLevel >= DEBUG || OVERRIDE_ALL_TO_LEVEL >= DEBUG) _log('D', ...text);
   }

   function trace(...text) {
      if (instanceLevel >= TRACE || OVERRIDE_ALL_TO_LEVEL >= TRACE) _log('T', ...text);
   }

   /**
    * Unconditional logging (no 'level' checks). Can be used for things like 'toString()'
    * and to dump lists of information, etc.
    */
   function print(...text) {
      _log('P', ...text);
   }

   /**
    * Will print a full stack frame when request, using the PRINT level.
    *
    * @since   v1.6.0
    * @since   2023.11.05
    */
   function printStackTrace() {
      let e = new Error();
      let stack = e.stack.replace(/^Error/, '');

      let parts = stack.split('\n');

      parts.shift(); // remove this level
      parts.shift(); // remove this level

      _log('P', 'Printing stack trace (' + parts.length + ' frames):\n' + parts.join('\n'));
   }

   /**
    * Will print a line-break.
    *
    * By default, it will print the '-' character 80 times across.
    * You could optionally overide the character, and the length to print.
    *
    * @param {String} char value to print in repetition.
    * @param {Number} length of string to repeat (defaults to 100).
    */
   function printLineBreak(char = '-', length = 100) {
      _log('P', (char || '-').repeat(length));
   }

   /**
    * Log the text provided.
    *
    * @param {Char} symbol is the letter of the log level.
    * @param  {Array<String>} text to log.
    */
   function _log(symbol, ...text) {
      var trace = getStackTrace(this);
      var data = [];

      data.push('[' + getDate() + ']');
      data.push('[' + symbol + ']');
      data.push('[' + getName() + ']');

      if (trace) {
         data.push('[' + trace.name);
         data.push('(' + trace.line);
         data.push(')]');
      }

      data.push('>');

      // If no text, override with newline/space
      let args = text.length == 0 ? [''] : [data.join(''), ...text];

      // Use appropriate Chrome DevTool functionality
      if (!LOGGER_SUPPRESS_STDOUT) {
         switch (symbol) {
            case 'F':
            case 'E':
               REDIRECTED.error(...args); // DevTools - error level
               break;
            case 'W':
               REDIRECTED.warn(...args); // DevTools - warning level
               break;
            case 'I':
               REDIRECTED.info(...args); // Devtools - info level
               break;
            case 'D':
            case 'T':
               REDIRECTED.debug(...args); // DevTools - verbose level
               break;
            case 'P':
               REDIRECTED.log(...args); // DevTools - verbose level
               break;
         }
      }

      let fields = args.shift();

      if (LOGGER_FILENAME) writeToFileLogger(symbol, fields, ...args);

      if (CALLBACK_LOGGING && CALLBACK_HANDLERS) {
         CALLBACK_HANDLERS.forEach((handler, idx) => {
            handler(symbol, fields, ...args);
         });
      }
   }

   /**
    * A convenient way to turn on or off handler logging.
    *
    * @since   1.7.0
    * @author  Christian Jean
    *
    * @param {Boolean} bool
    */
   function setLoggingHandlerState(bool = true) {
      if (bool === null) return;
      if (typeof bool === 'object' && bool instanceof Boolean) bool = bool.valueOf();
      if (typeof bool === 'boolean') CALLBACK_LOGGING = bool;
   }

   /**
    * Determine how many logging handlers are registered.
    *
    * @since   1.7.0
    * @author  Christian Jean
    *
    * @returns a count (Number)
    */
   function getLoggingHandlerCount() {
      return CALLBACK_HANDLERS.length;
   }

   /**
    * Register a function handler which will be called when a log is requested.
    *
    * Two parameters are passed to the handler, such as:
    *
    *    fnHandler(symbol, fields, text);
    *
    * Where 'symbol' is the upper-case letter of the log level:
    *
    *    F     Is the JxLogger.FATAL log level.
    *    E     Is the JxLogger.ERROR log level.
    *    W     Is the JxLogger.WARNING log level.
    *    I     Is the JxLogger.INFO log level.
    *    D     Is the JxLogger.DEBUG log level.
    *    T     Is the JxLogger.TRACE log level.
    *    P     Is the JxLogger.PRINT log level.
    *
    *    Passing this information along will allow for conditional actions
    *    to be taken by the handler.
    *
    * Where 'fields' are the log meta-data, such as date, time, logging
    * level, script name, function name and line number.
    *
    * Where 'text' represents the fully resolved and expanded text. We say
    * resolved meaning that the line number, function name, date and time
    * will be resolved, and if the log was called using the 'spread syntax'
    * (three dots [...]), the text will represent the final version of it.
    *
    * Example, if this was called:
    *
    *    log.debug("This is my arg: ", true == true, typeof "text");
    *
    * The text would be resolved as:
    *
    *    This is my arg: true and string
    *
    * Example:
    *
    *    registerLoggingHandler((level, fields, ...text) => {
    *       // logging logic for handler
    *    })
    *
    * Note that the handlers will ONLY be called if the logging level is
    * properly set. Meaning that if a 'log.debug(...)' statement is called
    * but the logger level is set to JxLogger.WARN, then no handler will be
    * called. The handler is only called when the text is actually logged.
    *
    * @since   1.7.0
    * @author  Christian Jean
    *
    * @param {Function} handler to be called for logging.
    */
   function registerLoggingHandler(handler) {
      CALLBACK_HANDLERS.push(handler);
      return CALLBACK_HANDLERS.length;
   }

   /**
    * Will ungregister a previously registered logging handler.
    *
    * @since   1.7.0
    * @author  Christian Jean
    *
    * @param {Function} handler to be removed.
    */
   function unregisterLoggingHandler(handler) {
      let idx = CALLBACK_HANDLERS.indexOf(handler);

      if (idx >= 0) {
         CALLBACK_HANDLERS.splice(idx, 1);
      }

      return CALLBACK_HANDLERS.length;
   }

   /**
    * Will ungregister ALL previously registered logging handlers.
    *
    * @since   1.7.0
    * @author  Christian Jean
    */
   function unregisterLoggingHandlers() {
      CALLBACK_HANDLERS.splice(0, CALLBACK_HANDLERS.length);
   }

   /**
    * Will add a remote logger by sending log messages to the specified 'url'
    * address.
    *
    * This will make use of the jQuery 'ajax' function to send a JSON message
    * as a JSON (contentType: 'application/json', dataType: 'json').
    *
    * The JSON message that is sent, is structured as follows:
    *
    *    {
    *       level: 'D',
    *       fields: '[2024-03-19T18:47:58.786Z][D][MyScript][myFunction(263)]>'
    *       text: 'Some log message which is sent to a remote host!'
    *    }
    *
    * Should the AJAX call fail, an error messsage contain the status and
    * exception text will be logged to the console.
    *
    * @since   v1.8.0
    * @author  Christian Jean
    *
    * @see registerLoggingHandler will be used for this purpose.
    * @see jQuery https://www.w3schools.com/jquery/jquery_intro.asp
    * @see AJAX https://www.w3schools.com/whatis/whatis_ajax.asp
    *
    * @param {URL} url of host to send to.
    */
   function addRemoteLogger(url) {
      if (!url) return;

      registerLoggingHandler((level, fields, ...text) => {
         $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: url,
            dataType: 'json',
            data: JSON.stringify({ level: level, fields: fields, text: text.join('') }),
            success: function (result) {
               /* Ignore! */
            },
            error: function (xhr, ops, exception) {
               REDIRECTED.error(`ERROR: status=${xhr.status}, exception='${xhr.responseText}'`);
            },
         });
      });
   }

   /**
    * Determins if this is an object.
    *
    * @param {Object} value to validate
    * @param {*} ofType optional type of object to validate.
    *
    * @returns 'true' if an object, 'false' otherwise.
    */
   function _isObject(value, ofType) {
      let b = false;
      b = (typeof value === 'object' || _isFunction(value)) && value != null;
      if (arguments.length > 1) b = _isInstanceOf(value, ofType);
      return b;
   }

   /**
    * Determins if this is a function.
    *
    * @param {Object} value to validate
    *
    * @returns 'true' if a function, 'false' otherwise.
    */
   function _isFunction(value) {
      return (typeof value === 'object' && value instanceof Function) || typeof value === 'function';
   }

   /**
    * Determins if this is a string.
    *
    * @param {Object} value to validate
    *
    * @returns 'true' if a string, 'false' otherwise.
    */
   function _isString(value) {
      return (typeof value === 'object' && value instanceof String) || typeof value === 'string';
   }

   /**
    * Will get the object instance type (by name).
    *
    * @param {Object} obj to get instance type for.
    */
   function _getInstanceName(obj) {
      return obj ? obj.constructor.name : 'null';
   }

   function _isInstanceOf(obj, type) {
      let b = false;
      if (_isString(type)) {
         let name = _getInstanceName(obj);
         b = type == name;
      } else if (_isObject(type)) {
         b = obj instanceof type;
      }
      return b;
   }

   /**
    * Synchronously append data to a file, creating the file if it does not
    * yet exist.
    *
    * @see MODE_0666 constant definition
    *
    * @see Buffer https://nodejs.org/api/buffer.html#buffer
    * @see TypedArray https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
    * @see DataView https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
    *
    * @param {String} filename is the filename to append data to.
    * @param {String} data <string> | <Buffer> | <TypedArray> | <DataView>
    * @param {Number} mode is an optional filemode (defaults to 0666)
    */
   function _appendFile(filename, data, mode = MODE_0666) {
      fs.appendFileSync(filename, data, { mode: mode });
   }

   function writeToFileLogger(level, fields, ...text) {
      _appendFile(LOGGER_FILENAME, fields);
      text.forEach((line) => {
         if (_isObject(line)) _appendFile(LOGGER_FILENAME, JSON.stringify(line, null, 3) + '\n');
         else _appendFile(LOGGER_FILENAME, line + '\n');
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

   //---------------------------------------------------------------------------------------------
   // Support functions
   //---------------------------------------------------------------------------------------------

   function getVersion() {
      return MODULE_VERSION;
   }

   /**
    * String representation of this instance.
    */
   function toString() {
      var status = [];

      status.push('version: ' + getVersion());
      status.push('log name: ' + getName());
      status.push('level name: ' + getLevelName());
      status.push('level: ' + getLevel());
      status.push('global level: ' + OVERRIDE_ALL_TO_LEVEL);
      status.push('global level name: ' + getLevelName(OVERRIDE_ALL_TO_LEVEL));

      var text = MODULE_NAME + ': [' + status.join(', ') + ']';

      // _log('P', text);

      return text;
   }

   /**
    * String representation of this instance.
    */
   function toJSON() {
      var status = [];

      status.push('version:' + getVersion());
      status.push('log name:' + getName());
      status.push('level name:' + getLevelName());
      status.push('level:' + getLevel());
      status.push('global level:' + OVERRIDE_ALL_TO_LEVEL);
      status.push('global level name:' + getLevelName(OVERRIDE_ALL_TO_LEVEL));

      var text = '{ "' + status.join('", "') + '" }';

      text = text.replace(new RegExp(':', 'g'), '": "');

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
      PRINT: PRINT,

      _log: _log,

      fatal: fatal,
      error: error,
      warn: warn,
      info: info,
      trace: trace,
      debug: debug,
      print: print,

      printStackTrace: printStackTrace,
      printLineBreak: printLineBreak,

      getName: getName,
      getLevel: getLevel,
      getLevelSymbol: getLevelSymbol,
      getLevelName: getLevelName,

      setLevel: setLevel,

      setToFatal: setToFatal,
      setToError: setToError,
      setToWarn: setToWarn,
      setToInfo: setToInfo,
      setToDebug: setToDebug,
      setToTrace: setToTrace,
      setToPrint: setToPrint,

      addRemoteLogger: addRemoteLogger,

      getLoggingHandlerCount: getLoggingHandlerCount,
      setLoggingHandlerState: setLoggingHandlerState,

      registerLoggingHandler: registerLoggingHandler,
      unregisterLoggingHandler: unregisterLoggingHandler,
      unregisterLoggingHandlers: unregisterLoggingHandlers,

      getVersion: getVersion,
      toString: toString,
      toJSON: toJSON,
   };
};

/**
 * The 'JxLogger' is a singleton logging factory, allowing to create
 * logging instances.
 *
 * Usage:
 *
 *    const JxLogger = require('../utils/JxLogger');
 *
 *    const log1 = JxLogger.getInstance('BarFoo', JxLogger.WARN);
 *    const log2 = JxLogger.getInstance('FooBar', JxLogger.DEBUG);
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
   const MODULE_VERSION = '1.3.0';

   const MODULE_HASHCODE = generateRandomHashcode();

   const log = new JxLoggerInstance(MODULE_NAME, WARN);

   const INSTANCES = {};

   var configFile = null;
   var configFileTimer = null;
   var configFileChanges = 0;

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

      configFile = process.env.JEACH_LOGGER_CONFIG || DEFAULT_LOGGER_CONFIG_NAME;

      monitorConfigFile(configFile);
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
    * Will check for a config file. If one is found, will start to monitor
    * it for changes. If none is found, we will periodically check for
    * one to become available.
    */
   function monitorConfigFile(configFile) {
      log.info("Applying '" + MODULE_NAME + "' config file change watch.");
      log.print(" >> Config file: '" + path.resolve(configFile) + "'");

      if (fs.existsSync(configFile)) {
         log.debug(' >> Config file was found, monitoring for changes.');
         fs.watch(configFile, (event, filename) => {
            configFileChanges++;
            if (filename && configFileChanges % 2 == 0) {
               log.debug(MODULE_NAME + " config file changed ('" + filename + "')");
               log.debug(" >> Event : '" + event + "'");
               applyConfig(filename);
            }
         });
         applyConfig(configFile);
      } else {
         log.debug(' >> Config file was NOT found, setting a watch on it.');
         configFileTimer = setInterval(periodicFileWatch, DEFAULT_LOGGER_CONFIG_WATCH_DELAY);
      }
   }

   /**
    * If a config file was not found, will periodically check for one.
    * If in the event one is found, we will start monitoring it for changes.
    */
   function periodicFileWatch() {
      log.info('Checking for existance of logging config file.');
      log.debug(" >> Config file: '" + path.resolve(configFile) + "'");

      if (fs.existsSync(configFile)) {
         log.debug(' >> Config file was found, will now use it!');
         log.debug(' >> Clearing file watch timer');
         clearInterval(configFileTimer);
         monitorConfigFile(configFile);
      } else {
         log.debug(' >> Config file was NOT found, will check in ' + DEFAULT_LOGGER_CONFIG_WATCH_DELAY + ' ms');
      }
   }

   function applyConfig(configFile) {
      var fullPath = path.resolve(configFile);

      log.info('Applying new config file');
      log.debug(" >> Config file name: '" + fullPath + "'");

      const data = fs.readFileSync(fullPath);
      var config = null;

      try {
         config = JSON.parse(data);
         log.debug(' >> Loaded config: ' + JSON.stringify(config, null, 3));
      } catch (e) {
         log.error('Could not read configuration file: ' + e);
         return;
      }

      if (config && config.loggers) {
         log.debug(' >> Have config for ' + config.loggers.length + ' loggers');
         var changed = [];
         var change = null;
         for (var i = 0; i < config.loggers.length; i++) {
            log.debug(' >> Have config ' + i + ': ' + JSON.stringify(config.loggers[i]));
            var level = getLevelByName(config.loggers[i].level);
            //log.debug(' >> Resolved level to ' + level + ' (numberic)');
            change = setLevel(config.loggers[i].name, level);
            if (change) changed.push(change);
         }
         log.info('Applied changes to ' + changed.length + ' loggers:');
         log.debug(' >> ' + JSON.stringify(changed, null, 4));
         log.debug(' >> Have ' + getInstanceCount() + ' logger instances.');
      }
   }

   function setLevel(name, level) {
      if (!name || !level) return null;
      var instance = INSTANCES[name];
      if (instance) {
         var chg = {};
         chg.logger = instance.getName();
         chg.old = {};
         chg.old.value = instance.getLevel();
         chg.old.name = instance.getLevelName();
         instance.setLevel(level);
         chg.new = {};
         chg.new.value = instance.getLevel();
         chg.new.name = instance.getLevelName();
         return chg;
      } else {
         return null;
      }
   }

   /**
    * Will set the 'OVERRIDE_ALL_TO_LEVEL' to the specified level.
    *
    * This allows to set ALL logger instances to this global override,
    * regardless what they are set individually.
    */
   function setOverrideLevel(level) {
      if (level >= FATAL && level <= PRINT) {
         OVERRIDE_ALL_TO_LEVEL = level;
         log.warn("WARNING: Setting 'OVERRIDE_ALL_TO_LEVEL' level to '" + getLevelName(level) + "'");
      }
   }

   /**
    * Will send ALL logging activity to the specified filename.
    *
    * Note that as of this version (v1.9.0), this is an all-or-none option,
    * where all logs (every logger instances) will send their output to the
    * specified filename.
    *
    * If the file does not exist it will be created. If no filename is provided,
    * it will default to 'Date.now()' as filename, and '.log' as file extention.
    *
    * The file will be appended to on each write. If it previously existed,
    * it's content will not be deleted, it will be preserved.
    *
    *
    * @author  Christian Jean
    * @since   1.9.0
    * @since   2024.05.13
    *
    * @param {String} filename to log to (without extention, default: "logger")
    * @param {Object} options Provide configuration options.
    */
   function setFileLogger(filename = 'logger', options = LOGGER_OPTIONS) {
      let opts = { ...LOGGER_OPTIONS, ...options };

      if (LOGGER_FILENAME) throw 'A file logger has already been set, ignoring request!';

      LOGGER_FILENAME = filename || 'filename';

      if (opts.suffix) {
         let suffix = opts.suffix + '';
         if (suffix.charAt(0) == '_') suffix = suffix.substring(1);
         LOGGER_FILENAME += '_' + suffix;
      }

      if (opts.extention) {
         let ext = opts.extention;
         if (ext.charAt(0) == '.') ext = ext.substring(1);
         LOGGER_FILENAME += '.' + ext;
      }

      if (opts['remove'] && opts.remove == true && fs.existsSync(LOGGER_FILENAME)) {
         console.log(' ## Removing');
         fs.unlinkSync(LOGGER_FILENAME);
      }

      if (opts['suppress'] && opts.suppress_stdout == true) {
         suppressStdout(true);
      }
   }

   function hasFileLogger() {
      return LOGGER_FILENAME != null;
   }

   /**
    * Will prevent writting output to the STDOUT stream. When a file logger is
    * setup, the logging will continue to be sent to STDOUT as well. In some
    * cases, we may want to suppress this, to ONLY log to the file.
    *
    * If called with 'true', no more logging will be sent to the STDOUT stream.
    * If called with 'false', logging will also be sent to the STDOUT stream.
    *
    * At any time, this state can be reversed by calling again with 'true' or
    * 'false'.
    *
    * @param {Boolean} suppress 'true' to prevent logging to STDOUT.
    */
   function suppressStdout(suppress = true) {
      LOGGER_SUPPRESS_STDOUT = suppress;
   }

   function isStdoutSuppressed() {
      return LOGGER_SUPPRESS_STDOUT;
   }

   function isRedirectedOutput() {
      return LOGGER_REDIRECTED_STDOUT != null;
   }

   /**
    * This will redirect all 'console.xxx(...)' output to an internal logger
    * instance.
    *
    * For example:
    *
    * ```
    *    console.log(..)      // Will be redirected to log.debug(..)
    *    console.info(..)     // Will be redirected to log.info(..)
    *    console.warn(..)     // Will be redirected to log.warn(..)
    *    console.error(..)    // Will be redirected to log.error(..)
    * ```
    *
    * You can optionally set the logging level for this new logger
    * (default: DEBUG).
    *
    * @since   2.11.0
    * @since   2024.05.25
    *
    * @author  Christian Jean
    *
    * @param {Number} level to redirect output at (default: DEBUG).
    *
    * @returns the logger instance (where you can change levels at runtime).
    */
   function redirectOutput(level = JxLogger.DEBUG) {
      LOGGER_REDIRECTED_STDOUT = JxLogger.getInstance('<output>', level);

      console.log = (...text) => LOGGER_REDIRECTED_STDOUT._log('D', ...text);
      console.debug = (...text) => LOGGER_REDIRECTED_STDOUT._log('D', ...text);
      console.info = (...text) => LOGGER_REDIRECTED_STDOUT._log('I', ...text);
      console.warn = (...text) => LOGGER_REDIRECTED_STDOUT._log('W', ...text);
      console.error = (...text) => LOGGER_REDIRECTED_STDOUT._log('E', ...text);

      return LOGGER_REDIRECTED_STDOUT;
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
   function setToDebug(name) {
      setLevel(name, DEBUG);
   }
   function setToTrace(name) {
      setLevel(name, TRACE);
   }
   function setToPrint(name) {
      setLevel(name, PRINT);
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

      return instances.length > 0 ? instances.join(' ') : '<none>';
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
         case DEBUG:
            name = 'Debug';
            break;
         case TRACE:
            name = 'Trace';
            break;
         case PRINT:
            name = 'Print';
            break;
      }

      return name;
   }

   /**
    * Will get the numeric log level for the given level name.
    *
    * For convenience we also support the string value of a level.
    */
   function getLevelByName(name) {
      var val = null;

      if (!name) return val;

      var nn = name.toLowerCase();

      switch (nn) {
         case '0':
         case 'fatal':
            val = FATAL;
            break;
         case '1':
         case 'err':
         case 'error':
            val = ERROR;
            break;
         case '2':
         case 'warn':
         case 'warning':
            val = WARN;
            break;
         case '3':
         case 'inf':
         case 'info':
            val = INFO;
            break;
         case '4':
         case 'dbg':
         case 'dbug':
         case 'debug':
            val = DEBUG;
            break;
         case '5':
         case 'trc':
         case 'trace':
            val = TRACE;
            break;
         case '9':
         case 'prt':
         case 'print':
            val = PRINT;
            break;
      }

      return val;
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

   function getVersion() {
      return MODULE_VERSION;
   }

   /**
    * String representation of this instance.
    */
   function toString() {
      let status = [];

      status.push('Version: ' + getVersion());
      status.push('Instances: ' + getInstanceCount());

      var text = getModuleName() + '@' + getHashcode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   /**
    * Factory function to obtain a new logger instance.
    *
    * @param {String} name of the new logger instance.
    * @param {Number} level of the new logger instance (default: WARN).
    *
    * @returns a new logger instance.
    */
   function getInstance(name, level = JxLogger.WARN) {
      var instance = null;

      log.info("Getting a logger instance for '" + name + "'");

      if (!name) return instance;

      if (INSTANCES[name]) instance = INSTANCES[name];
      else INSTANCES[name] = instance = new JxLoggerInstance(name, level);

      return instance;
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
      PRINT: PRINT,

      getHashcode: getHashcode,
      getModuleName: getModuleName,
      getVersion: getVersion,
      toString: toString,

      getInstance: getInstance,

      setLevel: setLevel,
      setOverrideLevel: setOverrideLevel,

      hasFileLogger: hasFileLogger,
      setFileLogger: setFileLogger,

      isRedirectedOutput: isRedirectedOutput,
      redirectOutput: redirectOutput,

      isStdoutSuppressed: isStdoutSuppressed,
      suppressStdout: suppressStdout,

      setToFatal: setToFatal,
      setToError: setToError,
      setToWarn: setToWarn,
      setToInfo: setToInfo,
      setToDebug: setToDebug,
      setToTrace: setToTrace,
      setToPrint: setToPrint,
   };
})(); // Our IIFE function is invoked here

function runLoggingTest(logger) {
   console.log('---------------------------------------------');
   console.log("Logging with '" + logger.getLevelName().toUpperCase() + "'");
   console.log('---------------------------------------------');
   console.log(' >> Logger Name  : ' + logger.getName());
   console.log(' >> Level Number : ' + logger.getLevel());
   console.log(' >> Level Symbol : ' + logger.getLevelSymbol());
   console.log(' >> To String    : ' + logger.toString());
   console.log('');
   logger.fatal(' >> This is a FATAL statement!');
   logger.error(' >> This is a ERROR statement!');
   logger.warn(' >> This is a WARN statement!');
   logger.info(' >> This is a INFO statement.');
   logger.debug(' >> This is a DEBUG statement!');
   logger.trace(' >> This is a TRACE statement!');
   logger.print(' >> This is a PRINT statement!');
   console.log('');
}

/**
 * Run this function for a minimal sanity check.
 */
function testLogger() {
   console.log('');
   console.log('Starting logger tests...');
   console.log('');
   console.log('JxLogger : ' + JxLogger.toString());

   const log0 = JxLogger.getInstance('logger-fatal', JxLogger.FATAL);
   const log1 = JxLogger.getInstance('logger-error', JxLogger.ERROR);
   const log2 = JxLogger.getInstance('logger-warn', JxLogger.WARN);
   const log3 = JxLogger.getInstance('logger-info', JxLogger.INFO);
   const log4 = JxLogger.getInstance('logger-debug', JxLogger.DEBUG);
   const log5 = JxLogger.getInstance('logger-trace', JxLogger.TRACE);
   const log6 = JxLogger.getInstance('logger-print', JxLogger.PRINT);

   console.log('JxLogger : ' + JxLogger.toString());
   console.log('');

   runLoggingTest(log0);
   runLoggingTest(log1);
   runLoggingTest(log2);
   runLoggingTest(log3);
   runLoggingTest(log4);
   runLoggingTest(log5);
   runLoggingTest(log6);

   console.log('Completed logging tests!');
}

function testLoggingHandlers() {
   const log = JxLogger.getInstance('logger', JxLogger.WARN);

   let oneFn = (sym, fields, ...text) => {
      console.log(" 1 #### symbol: '" + sym + "', fields: '" + fields + ", text: '" + text.join(' ') + "'");
   };

   let twoFn = (sym, fields, ...text) => {
      console.log(" 2 #### symbol: '" + sym + "', fields: '" + fields + ", text: '" + text.join(' ') + "'");
   };

   log.registerLoggingHandler(oneFn);
   log.registerLoggingHandler(twoFn);

   console.log('-------------------------------------------------------------------------------------');
   console.log("Should ONLY see 'W' logging level messages for handler #1 and #2");
   console.log('-------------------------------------------------------------------------------------');
   for (var i = 0; i < 10; i++) {
      log.warn('Some warn date', Date.now());
      log.debug('Some debug date', Date.now());
   }

   log.unregisterLoggingHandler(twoFn);

   console.log('-------------------------------------------------------------------------------------');
   console.log('Should now only see handler #1');
   console.log('-------------------------------------------------------------------------------------');
   for (var i = 0; i < 10; i++) {
      log.warn('Some warn date', Date.now());
      log.debug('Some debug date', Date.now());
   }

   log.unregisterLoggingHandlers();

   console.log('-------------------------------------------------------------------------------------');
   console.log('Should not see any handler calls (all removed)');
   console.log('-------------------------------------------------------------------------------------');
   for (var i = 0; i < 10; i++) {
      log.warn('Some warn date', Date.now());
      log.debug('Some debug date', Date.now());
   }
}

module.exports = JxLogger;

console.log(JxLogger.toString());

// testLogger();
// testLoggingHandlers();
