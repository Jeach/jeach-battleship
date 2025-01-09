/*
 * Copyright (C) 2024 Christian Jean
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

//----------------------------------------------------------------------------
// Load third-party dependencies...
//----------------------------------------------------------------------------
const dotenv = require('dotenv').config();
// const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const http = require('http');
const cors = require('cors');

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

//----------------------------------------------------------------------------
// Load our dependencies...
//----------------------------------------------------------------------------
const JxHttpTool = require('./modules/http/JxHttpTool');
const JxLogger = require('./modules/utils/JxLogger');

const package = require('./package.json');

//----------------------------------------------------------------------------
// Enable logging...
//----------------------------------------------------------------------------
const log = JxLogger.getInstance(package.name, JxLogger.WARN);

//----------------------------------------------------------------------------
// Define our name and port...
//----------------------------------------------------------------------------
const SERVICE_NAME = process.env.SERVICE_NAME || package.name;
const SERVICE_PORT = process.env.SERVICE_PORT || 80;

log.info(`Staring service '${SERVICE_NAME}'`);

//----------------------------------------------------------------------------
// Load our configurations...
//----------------------------------------------------------------------------
const HTTP_REQUEST_LOGGER = process.env.HTTP_REQUEST_LOGGER === 'true' ? true : false;
const HTTP_REQUEST_LOGGER_PATH = process.env.HTTP_REQUEST_LOGGER_PATH || '/';

//----------------------------------------------------------------------------
// Configure express and public routes...
//----------------------------------------------------------------------------
// app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(express.json()); // Parse request body as JSON (since Express v4.16)
app.use('/', express.static('public'));
app.use(cors());
app.options('*', cors());

//----------------------------------------------------------------------------
// Initialize our web socket...
//----------------------------------------------------------------------------
const JxWebSocket = require('./modules/http/JxWebSocket');
JxWebSocket.init(io);

//----------------------------------------------------------------------------
// Http request logger (optional)...
//----------------------------------------------------------------------------
if (HTTP_REQUEST_LOGGER) {
   const morgan = require('morgan');
   log.info('Enabling HTTP request logger');
   log.debug(` >> Using path: '${HTTP_REQUEST_LOGGER_PATH}'`);
   app.use(HTTP_REQUEST_LOGGER_PATH, morgan('[:date[iso]] addr: :remote-addr :method :url, status: HTTP :status, length: :res[content-length], response: :response-time[3] ms'));
}

//----------------------------------------------------------------------------
// Load all of our routes...
//----------------------------------------------------------------------------
const serviceRoutes = require('./routes/service-routes');
app.use('/api/v1', serviceRoutes);

const gameRoutes = require('./routes/game-routes');
app.use('/api/v1', gameRoutes);

//----------------------------------------------------------------------------
// Default HTTP 404 (for everything else)...
//----------------------------------------------------------------------------
app.use((req, res) => {
   log.info('Sending default HTTP 404');
   var url = req.protocol + '://' + req.get('host') + req.originalUrl;
   var json = JxHttpTool.getResponse(404, ['API path was not found!', "Full URL rqeuested: '" + url + "'"]);
   log.debug(' > Response: ' + JSON.stringify(json));
   res.header('Content-Type', 'application/json');
   return res.status(404).json(json);
});

//----------------------------------------------------------------------------
// Start our server...
//----------------------------------------------------------------------------
server.listen(SERVICE_PORT, () => {
   log.print();
   log.print(`Started service: ${SERVICE_NAME}`);
   log.print(`Started on port: ${SERVICE_PORT}`);

   log.print();
   log.print('You may now use the following links:');
   log.print(' >> API Version : http://localhost/api/v1/service/version');
   log.print(' >> Web App     : http://localhost/');
   log.print(' >> Web App     : http://localhost/api/v1/battleship/games');
   log.print();
});
