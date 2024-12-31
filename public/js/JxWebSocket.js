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

var JxWebSocket = (function () {
   //-------------------------------------------------------------------
   // Private Variables...
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxWebSocket';
   const MODULE_VERSION = '1.1.0';

   const DEFAULT_WS_TOPIC = 'ws.broadcast'; // For general broadcast?

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.WARN);

   let module_hashcode = null;
   let wsHandler = null;

   const PRIVATE_HANDLERS = {};

   var socket = io();

   //-------------------------------------------------------------------
   // Constructor...
   //-------------------------------------------------------------------

   init();

   //-------------------------------------------------------------------
   // Private Methods...
   //-------------------------------------------------------------------

   /**
    * Initialize the web-socket client.
    */
   function init() {
      log.info("Initializing '" + MODULE_NAME + "'");

      module_hashcode = generateRandomHashcode();

      socket.on('connect', function () {
         log.debug('Client connected to web-socket server');

         if (wsHandler) {
            log.debug("Invoking 'connect' web-socket handler");
            wsHandler.apply(this, ['connect']);
         }
      });

      socket.on('disconnect', function () {
         log.debug('Client disconnected from web-socket server');

         if (wsHandler) {
            log.debug("Invoking 'disconnect' web-socket handler");
            wsHandler.apply(this, ['disconnect']);
         }
      });

      /**
       * The following will allow to listen to ALL message events.
       * Excluding the 'connect' and 'disconnect' events.
       *
       * This can be used to call event handlers that were previously
       * registered client side.
       */

      var onevent = socket.onevent;

      socket.onevent = function (packet) {
         var args = packet.data || [];
         onevent.call(this, packet); // original call
         packet.data = ['*'].concat(args);
         onevent.call(this, packet); // additional call to catch-all
      };

      socket.on('*', function (event, data) {
         log.info('Received event:');
         log.debug(' >> Topic : "' + event + '"');
         log.debug(' >> Data  : ' + JSON.stringify(data));

         processEventHandlers(event, data);
      });
   }

   function processEventHandlers(topic, data) {
      let count = 0;
      let start = 0;
      let end = 0;

      log.info('Processing event handlers');

      if (!topic) return;

      log.debug(" >> Topic : '" + topic + "'");
      log.debug(' >> Data  : ' + data);

      let handlers = PRIVATE_HANDLERS[topic];

      if (handlers) {
         start = Date.now();
         for (let i = 0; i < handlers.length; i++) {
            log.debug(' >> Found handler, invoking it');
            handlers[i].apply(this, [data]);
            count++;
         }
         end = Date.now();
      }

      let elapsed = end - start;

      log.debug(' >> Invoked ' + count + ' handler' + (count > 1 ? 's' : ''));
      log.debug(' >> In ' + elapsed + ' ms (' + (count > 2 ? elapsed / count : elapsed).toFixed(3) + ' ms average)');

      return count;
   }

   /**
    * Get a count of registered topic handlers.
    *
    * This is not a count of registered handlers for a topic.
    *
    * @returns a count
    */
   function getRegisteredTopicHandlers() {
      let count = 0;
      log.info('Get register topic handlers');
      Object.keys(PRIVATE_HANDLERS).forEach((k, i) => {
         count++;
      });
      log.info(' >> Found " + count + " topics handlers.');
      return count;
   }

   /**
    * Get a count of registered handlers for a given topic.
    *
    * @returns a count
    */
   function getRegisteredHandlers(topic) {
      log.info('Get register handlers for topic');
      if (!topic || !handler) return;
      log.debug(" >> Topic   : '" + topic + "'");
      let handlers = PRIVATE_HANDLERS[topic];
      return handlers ? handlers.length : 0;
   }

   function registerHandler(topic, handler) {
      log.info('Register WS topic handler');

      if (!topic || !handler) return;

      log.debug(" >> Topic   : '" + topic + "'");
      log.debug(' >> Handler : ' + typeof handler);

      let handlers = PRIVATE_HANDLERS[topic];

      if (!handlers) {
         log.debug(' >> No previous handlers exist');
         PRIVATE_HANDLERS[topic] = handlers = [];
      }

      handlers.push(handler);

      log.debug(' >> Now have ' + handlers.length + ' handlers registerd');
   }

   function unregisterHandler(topic, handler) {
      log.info('Unregister WS topic handler');

      if (!topic || !handler) return;

      log.debug(" >> Topic   : '" + topic + "'");
      log.debug(' >> Handler : ' + typeof handler);

      let handlers = PRIVATE_HANDLERS[topic];

      if (!handlers) {
         log.debug(' >> No previous handlers exist');
         return;
      }

      for (let i = 0; i < handlers.length; i++) {
         if (handlers[i] === handler) {
            log.debug(' >> Found handler, removing it');
            handlers.splice(i, 1);
         }
      }

      log.debug(' >> Now have ' + handlers.length + ' handlers registerd');
   }

   function unregisterAllTopicHandlers(topic) {
      log.info('Unregister all WS topic handler');

      if (!topic || !handler) return;

      log.debug(" >> Topic   : '" + topic + "'");

      let handlers = PRIVATE_HANDLERS[topic];

      if (!handlers) {
         log.debug(' >> No previous handlers exist');
         return;
      }

      delete PRIVATE_HANDLERS[topic];

      log.debug(' >> Now have ' + handlers.length + ' handlers registerd');
   }

   /**
    * Will create a new web-socket private channel with the server.
    *
    * @param {String} id is the channel name as ID to create.
    */
   // function addPrivateChannel(id, handler) {
   //    if (!socket || !id) return;

   //    log.info("Creating a new web-socket channel as: '" + id + "'");

   //    socket.on(id, handler);

   //    sendMessage(id, { text: 'Private channel subscription', id: id });

   //    log.info(" >> Successfully created a new web-socket channel (id: '" + id + "')");
   // }

   /**
    * Allow to register a Web Socket connection handler, which will be
    * invoked each time a connection is established with the server.
    *
    * When a Web Socket  'connect' or 'disconnect' ocurs, the handler
    * will be invoked, passing the event type as a string, such as:
    *
    *  'connect'     Which will indicate a WS connection event.
    *  'disconnect'  Which will indicate a WS disconnect event.
    *
    * @param {Function} handler function handler.
    */
   // function registerWebSocketHandler(handler) {
   //    log.info('Registering a Web Socket handler');
   //    wsHandler = handler;
   // }

   /**
    * Will send data to the server using the specified topic. If no topic
    * is provided, a default topic will be used.
    *
    * @author  Christian Jean
    * @since   0.1.0
    */
   function sendMessage(topic, message) {
      var tt = null;
      var mm = null;

      log.info('Sending web-socket message (from JS module):');

      if (!socket) return;

      switch (arguments.length) {
         case 0:
            log.error(' >> No message provided!');
            return;
            break;
         case 1:
            tt = DEFAULT_WS_TOPIC;
            mm = arguments[0];
            break;
         case 2:
            tt = arguments[0] || DEFAULT_WS_TOPIC;
            mm = arguments[1] || '<null>';
            break;
         default:
            log.warn(' >> Too many arguments (ignoring all others)!');
            tt = arguments[0] || DEFAULT_WS_TOPIC;
            mm = arguments[1] || '<null>';
            break;
      }

      log.debug(" >> Topic   : '" + tt + "'");
      log.debug(" >> Message : '" + JSON.stringify(mm) + "'");

      socket.emit(tt, mm);
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
    * Provide the version number of this module.
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

      var text = getName() + '@' + hashCode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //-------------------------------------------------------------------
   // Exported Methods...
   //-------------------------------------------------------------------

   return {
      init: init,

      sendMessage: sendMessage,

      getRegisteredTopicHandlers: getRegisteredTopicHandlers,
      getRegisteredHandlers: getRegisteredHandlers,

      registerHandler: registerHandler,
      unregisterHandler: unregisterHandler,
      unregisterAllTopicHandlers: unregisterAllTopicHandlers,

      getVersion: getVersion,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

console.log('Loading: ' + JxWebSocket.toString());
