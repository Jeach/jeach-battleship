/*
 * Copyright (C) 2023 Nuvoola, Inc.
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

const JxValidate = require('../lang/JxValidate');
const JxLogger = require('../utils/JxLogger');

var JxWebSocket = (function (ws) {
   //-------------------------------------------------------------------
   // Private Variables...
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxWebSocket';
   const MODULE_VERSION = '1.1.0';

   const DEFAULT_WS_TOPIC = 'ws.broadcast'; // For general broadcast?
   const IS_WS_PAUSED = false;

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.WARN);

   const connections = {};

   let io = null;

   //-------------------------------------------------------------------
   // Constructor...
   //-------------------------------------------------------------------

   //init();

   //-------------------------------------------------------------------
   // Private Methods...
   //-------------------------------------------------------------------

   /**
    * Initialize our questionnaire.
    */
   function init(ws) {
      log.info('Initializing "' + MODULE_NAME + '" module');

      io = ws;

      io.on('connection', function (socket) {
         log.debug('Client connected to server (socket.id: ' + socket.id + ')');

         connections[socket.id] = { ts: Date.now(), socket_id: socket.id, socket: socket };

         socket.on('disconnect', function () {
            log.debug('Client disconnected from server (socket.id: ' + socket.id + ')');
            delete connections[socket.id];
            printConnectionList();
         });

         socket.on(DEFAULT_WS_TOPIC, function (message) {
            log.debug('Received broadcast web-socket message from client: ' + message);
         });

         printConnectionList();
      });
   }

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

      log.info('Sending web-socket message (from Node module)');

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

      if (typeof mm === 'object') mm = JSON.parse(JSON.stringify(mm));

      log.debug(' >> Message : ' + JSON.stringify(mm));

      if (!IS_WS_PAUSED) {
         io.emit(tt, mm);
         log.debug(' >> Message sent!');
      } else {
         log.info(' >> Message NOT sent (paused)!');
      }
   }

   function setPaused(b) {
      if (JxValidate.isBoolean(b)) IS_WS_PAUSED = b;
   }

   function isPaused() {
      return IS_WS_PAUSED;
   }

   function getConnections() {
      return connections;
   }

   /**
    * Get a count of connected client web-sockets.
    *
    * @returns the number of client sockets.
    */
   function getConnectionCount() {
      log.info('Getting socket count');
      let list = Object.keys(connections);
      log.debug(' >> We have ' + list.length + ' client sockets');
      return list.length;
   }

   /**
    * Get a list (array) of client socket ID's.
    *
    * @returns an array of client sockets.
    */
   function getConnectionList() {
      let list = [];
      Object.keys(connections).forEach((connection, i) => {
         list.push(connections[connection]);
      });
      return list;
   }

   /**
    * Print the client sockets
    */
   function printConnectionList() {
      let list = getConnectionList();
      log.info('Listing client sockets: ');
      list.forEach((connection, idx) => {
         let conn = { ...connection };
         delete conn.socket;
         log.debug(' >> Connection: ' + JSON.stringify(conn));
      });
   }

   /**
    * Provide version of this module.
    */
   function getVersion() {
      return MODULE_VERSION;
   }

   /**
    * String representation of this instance.
    */
   function toString() {
      var status = [];

      status.push('version: ' + getVersion());
      status.push('paused: ' + isPaused());
      status.push('connections: ' + getConnectionCount());

      return MODULE_NAME + ': [' + status.join(', ') + ']';
   }

   //-------------------------------------------------------------------
   // Exported Methods...
   //-------------------------------------------------------------------

   return {
      init: init,

      getSockets: getConnections,
      getSocketCount: getConnectionCount,
      getSocketList: getConnectionList,

      isPaused: isPaused,
      setPaused: setPaused,

      sendMessage: sendMessage,

      getVersion: getVersion,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

module.exports = JxWebSocket;

console.log(JxWebSocket.toString());
