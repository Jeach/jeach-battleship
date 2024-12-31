/*
 * Copyright (C) 2022 Nuvoola AI, Inc.
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
const JxObject = require('../lang/JxObject');

var JxHttpTool = (function () {
   //-------------------------------------------------------------------
   // Private Variables
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxHttpTool';
   const MODULE_VERSION = '1.4.0';

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.WARN);

   //-------------------------------------------------------------------
   // Constructor...
   //-------------------------------------------------------------------

   init.apply(null, arguments);

   //-------------------------------------------------------------------
   // Private Methods...
   //-------------------------------------------------------------------

   /**
    * Initialize our object.
    */
   function init() {
      log.info('Initializing "' + MODULE_NAME + '" instance');
      log.debug(' >> Args: ' + arguments.length);
   }

   //---------------------------------------------------------------------------------------------
   // Support Functions
   //---------------------------------------------------------------------------------------------

   function getSuccessfulResponse(data) {
      return {
         success: true,
         http: {
            status: 200,
            text: 'Ok',
            description: 'The request has been accepted and succeeded successfully.',
         },
         payload: {
            success: data,
         },
      };
   }

   function getBadRequestResponse(message) {
      return {
         success: false,
         http: {
            status: 400,
            text: 'Bad Request',
            description: 'The request cannot be fullfilled due to something that is perceived to be a client error (ie: malformed, invalid or missing syntax, etc.).',
         },
         payload: {
            error: message,
         },
      };
   }

   function getUnauthorizedResponse(message) {
      return {
         success: false,
         http: {
            status: 401,
            text: 'Unauthorized',
            description: 'The client must authenticate itself to get the requested response (requestor identity is unknown to the service).',
         },
         payload: {
            error: message,
         },
      };
   }

   function getNotFoundResponse(message) {
      return {
         success: false,
         http: {
            status: 404,
            text: 'Not Found',
            description: 'Resource could not be found (non existant). This status code may be received instead of an HTTP 403 to hide the existence of a resource from an unauthorized client.',
         },
         payload: {
            error: message,
         },
      };
   }

   function getServerErrorResponse(message) {
      return {
         success: false,
         http: {
            status: 500,
            text: 'Internal Server Error',
            description: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
         },
         payload: {
            error: message,
         },
      };
   }

   function getVersion() {
      return MODULE_VERSION;
   }

   /**
    * String representation of this instance.
    */
   function toString() {
      var status = [];

      status.push('version: ' + getVersion());

      var text = MODULE_NAME + ': [' + status.join(', ') + ']';

      return text;
   }

   //---------------------------------------------------------------------------------------------
   // Domain Functions
   //---------------------------------------------------------------------------------------------

   /**
    * Create a default response, based on the HTTP code being returned.
    *
    * @param {Number} code is the HTTP response code.
    * @param {Object|String} data is any response data or message.
    * @returns
    */
   function getResponse(code, data) {
      var handler = null;

      switch (code) {
         case 200:
            handler = getSuccessfulResponse;
            break;
         case 400:
            handler = getBadRequestResponse;
            break;
         case 401:
            handler = getUnauthorizedResponse;
            break;
         case 404:
            handler = getNotFoundResponse;
            break;
         case 500:
            handler = getServerErrorResponse;
            break;
         default:
            handler = getServerErrorResponse;
            break;
      }

      return handler(data);
   }

   /**
    * Get the entire request body.
    *
    * @param req is the request object.
    *
    * @author  Christian Jean
    * @since   2023.04.27
    *
    * @returns The entire body as JSON object.
    */
   function getBody(req) {
      log.info('Getting request BODY');
      if (!req) throw 'No request object provided!';
      let body = req.body;
      log.debug(' >> Body: ' + JSON.stringify(body));
      return body;
   }

   /**
    * Get a path parameter.
    *
    * Example: /api/v1/context/{param}/endpoint
    *
    * @param req is the request object.
    * @param name is the parameter name.
    *
    * @author  Christian Jean
    * @since   1.0, 2020.xx.xx
    *
    * @returns The value of the parameter.
    */
   function getPathParam(req, name) {
      log.info("Getting PATH param for '" + name + "'");
      if (!req) throw 'No request object provided!';
      if (!name) throw 'No parameter name provided!';
      var param = req.params[name];
      log.debug(' >> Param: ' + JSON.stringify(param));
      return param;
   }

   /**
    * Get the entire query (as JSON).
    *
    * @param req is the request object.
    *
    * @author  Christian Jean
    * @since   2020.05.02
    *
    * @returns a JSON object.
    */
   function getQuery(req) {
      log.info('Getting QUERY (as JSON)');
      if (!req) throw 'No request object provided!';
      let query = req.query;
      if (JxObject.getSize(query) == 0) query = null;
      log.debug(" >> Returning query: '" + JSON.stringify(query) + "'");
      return query;
   }

   /**
    * Get an array of all query key/value pairs.
    *
    * Example:
    *
    *    ?key1=value1&key2=value2
    *
    * Will produce:
    *
    *    [
    *       { key: "key1", value: "value1" },
    *       { key: "key2", value: "value2" },
    *    ]
    *
    * @param req is the request object.
    * @param name is the parameter name.
    *
    * @author  Christian Jean
    * @since   2024.02.11
    *
    * @returns an array of key/value objects.
    */
   function getQueryAsKeyValuePairs(req) {
      log.info('Getting QUERY as array of key/value pairs');
      let list = null;
      let qry = getQuery(req);
      let keys = Object.keys(qry);
      keys.forEach((key, idx) => {
         list.push({ key: key, value: keys[key] });
      });
      log.debug(' >> Extracted ' + list.length + ' key/value pairs');
      return list;
   }

   /**
    * Get a query parameter.
    *
    * Example  : ?key1=value1&key2=value2
    * Inovking : getQueryParam(req, 'key2');
    * Produces : "value2"
    *
    * @param req is the request object.
    * @param name is the parameter name.
    *
    * @author  Christian Jean
    * @since   1.0, 2020.03.12
    *
    * @returns the value of the named query parameter.
    */
   function getQueryParam(req, name) {
      log.info("Getting QUERY param for '" + name + "'");
      if (!req) throw 'No request object provided!';
      if (!name) throw 'No parameter name provided!';
      var param = req.query[name];
      log.debug(' >> Param: ' + JSON.stringify(param));
      return param;
   }

   /**
    * Get a body parameter.
    *
    * Example: { myParam1: myValue1, myParam2: myValue2 }
    *
    * @param req is the request object.
    * @param name is the parameter name.
    *
    * @author  Christian Jean
    * @since   1.0, 2020.03.12
    *
    * @returns the value of the parameter.
    */
   function getBodyParam(req, name) {
      log.info("Getting BODY param for '" + name + "'");
      log.print('BODY: ' + JSON.stringify(req.body));
      if (!req) throw 'No request object provided!';
      if (!name) throw 'No parameter name provided!';
      var param = req.body[name];
      log.debug(' >> Param: ' + JSON.stringify(param));
      return param;
   }

   /**
    * Get a parameter by resolving in the following lookup order:
    *
    *  1. In path
    *  2. In query parameters
    *  3. In body
    *
    * Whichever is found first, it will be returned.
    *
    * As of v1.4, we can now ensure we receive an expected type (via 'cast'
    * parameter)!
    *
    * If a param is a JSON structure (ie: string in QUERY), it can be cast
    * to an 'object' literal.
    *
    * If a param is an object (ie: from BODY), it can also be cast to a
    * JSON 'string'.
    *
    * @param req is the request object.
    * @param name is the parameter name.
    * @param cast optionally cast data to JSON 'string' or literal 'object'.
    *
    * @author  Christian Jean
    * @since   1.0, 2020.03.12
    *
    * @returns the value of the parameter.
    */
   function getParam(req, name, cast = null) {
      log.info("Getting param for '" + name + "'");

      if (!req) throw 'No request object provided!';
      if (!name) throw 'No parameter name provided!';

      var param = getPathParam(req, name);

      if (param == null) param = getQueryParam(req, name);
      if (param == null) param = getBodyParam(req, name);

      log.debug(" >> Param: '" + param + "'");

      // Optionally cast to type!
      if (cast) {
         log.debug(" >> Casting to '" + cast + "'");

         if (cast == 'string' && typeof param == 'object') {
            param = JSON.stringify(param);
         }
         if (cast == 'object' && typeof param == 'string') {
            param = JSON.parse(param);
         }
      }

      return param;
   }

   /**
    * Get a header parameter.
    *
    * @author  Christian Jean
    * @since   2023.05.02
    *
    * @param req is the request object.
    * @param name is the parameter name.
    *
    * @returns the parameter value.
    */
   function getHeaderParam(req, name) {
      log.info("Getting HEADER param for '" + name + "'");
      if (!req) throw 'No request object provided!';
      if (!name) throw 'No parameter name provided!';
      let param = req.headers ? req.headers[name] : null;
      log.debug(" >> Param: '" + param + "'");
      return param;
   }

   /**
    * All parameters are essentially strings. This will attempt to get a
    * parameter and cast it to an Integer.
    *
    * Locations are:
    *
    *   'b' will look in body.
    *   'p' will look in path.
    *   'q' will look in query.
    *   'h' will look in header.
    *
    * You can combine locations (ie: 'bp', 'bpq', 'bpqh') for which they
    * will be searched for in that specific order.
    *
    * @param {Request} req is the request object.
    * @param {String} name is the parameter name.
    * @param {String} loc is the location to search.
    *
    * @returns the parameter value.
    */
   function getIntParam(req, name, loc) {
      log.info("Getting INTEGER param for '" + name + "'");

      if (!req) throw 'No request object provided!';
      if (!name) throw 'No parameter name provided!';

      loc = loc || 'pqbh';

      log.debug(" >> Location: '" + loc + "'");

      let array = loc.split('');

      let param = null;
      let value = null;

      for (var i = 0; i < array.length; i++) {
         switch (array[i]) {
            case 'p':
               param = getPathParam(req, name);
               break;
            case 'b':
               param = getBodyParam(req, name);
               break;
            case 'q':
               param = getQueryParam(req, name);
               break;
            case 'h':
               param = getHeaderParam(req, name);
               break;
         }

         log.debug(' ## Param : ' + param);
         log.debug(' ## Type  : ' + typeof param);

         if (param) {
            value = parseInt(param);
            log.debug(' ## Param : ' + param);
            log.debug(' ## Type  : ' + typeof param);
            log.debug(' ## NaN   : ' + isNaN(param));

            if (isNaN(value)) {
               log.debug(' ## Reverting');
               value = param;
               log.debug(' ## Param : ' + param);
               log.debug(' ## Type  : ' + typeof param);
            }
            break;
         }
      }

      log.debug(" >> Returning param: '" + value + "' type: " + typeof value);

      return value;
   }

   /**
    * Wraps a controller in order to trap all errors/exceptions and
    * automatically redirect them to a client as a response.
    *
    * If an Error or object literal is thrown, it will assume an error
    * and send it to client as such.
    *
    * TODO: Providing a StackTrace should be optional and conditional
    * (ie: as not to be returned to end-user).
    *
    * @since 1.0.0, 2021.04.30
    * @author Christian jean
    *
    * @return a controller wrapper to manage errors and exceptions.
    */
   function wrapController(controller) {
      return (req, res) => {
         log.info('Controller wrapper');

         var rtx = null;
         var code = 500;

         try {
            rtx = controller.apply(this, [req, res]);
            log.debug(' >> Type: ' + typeof rtx);
            if (typeof rtx === 'string') {
               code = 500;
               rtx = JxHttpTool.getResponse(code, rtx);
            } else if (rtx instanceof Object) {
               if (rtx.hasOwnProperty('success') && rtx.hasOwnProperty('http') && rtx.hasOwnProperty('payload')) {
                  log.debug(" >> Using custom 'Object' class");
                  code = rtx.http.status;
               } else {
                  log.debug(" >> Using 'Object' class");
                  code = 200;
               }
            }
         } catch (ex) {
            log.debug(' >> Type: ' + typeof ex);
            if (ex instanceof Error) {
               log.debug(" >> Using 'Error' class");
               code = 500;
               rtx = JxHttpTool.getResponse(code, { stack: formatStackTrace(ex.stack) });
            } else if (typeof ex === 'string') {
               code = 500;
               rtx = JxHttpTool.getResponse(code, ex);
            } else if (ex instanceof Object) {
               log.debug(' >> Type: ' + typeof ex);
               if (ex.hasOwnProperty('success') && ex.hasOwnProperty('http') && ex.hasOwnProperty('payload')) {
                  log.debug(" >> Using custom 'Object' class");
                  code = ex.http.status;
                  rtx = ex;
               } else {
                  log.debug(" >> Using 'Object' class");
                  code = 200;
                  rtx = ex;
               }
            }
         }

         if (!rtx) {
            code = 500;
            rtx = JxHttpTool.getResponse(code, 'Miscellaneous error occurred!');
         }

         if (code > 202) log.error('HTTP ' + code + ': response: ' + JSON.stringify(rtx, null, 3));

         log.debug(' >> Sending response');
         res.header('Content-Type', 'application/json');
         res.status(code).json(rtx);
         log.trace(' >> Response sent!');
      };
   }

   function formatStackTrace(stack) {
      if (!stack) return null;
      var parts = stack.replace(/\n/g, '!@#$').split('!@#$');
      return parts;
   }

   //-------------------------------------------------------------------
   // Exported Methods...
   //-------------------------------------------------------------------

   return {
      getPathParam: getPathParam,
      getQueryParam: getQueryParam,
      getBodyParam: getBodyParam,
      getParam: getParam,

      getQueryAsKeyValuePairs: getQueryAsKeyValuePairs,

      getIntParam: getIntParam,

      getQuery: getQuery,
      getBody: getBody,

      wrapController: wrapController,

      getResponse: getResponse,
      getSuccessfulResponse: getSuccessfulResponse,
      getBadRequestResponse: getBadRequestResponse,
      getUnauthorizedResponse: getUnauthorizedResponse,
      getNotFoundResponse: getNotFoundResponse,
      getServerErrorResponse: getServerErrorResponse,

      getVersion: getVersion,

      toString: toString,
   };
})(); // Our IIFE function is invoked here

module.exports = JxHttpTool;

console.log(JxHttpTool.toString());
