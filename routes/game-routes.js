/*
 * Copyright (C) 2024 Nuvoola AI, Inc.
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

const express = require('express');
const router = express.Router();

const logController = require('../controllers/logging-controller');
const gameController = require('../controllers/game-controller');

const JxHttpTool = require('../modules/http/JxHttpTool');
const JxLogger = require('../modules/utils/JxLogger');

const ROUTE_NAME = 'game-routes';
const ROUTE_PATH = '/battleship';

const log = JxLogger.getInstance(ROUTE_NAME, JxLogger.WARN);

log.info(`Initializing '${ROUTE_NAME}'...`);
log.debug(" >> Route path: '" + ROUTE_PATH + "'");

//---------------------------------------------------------------------------
// Route mappings...
//---------------------------------------------------------------------------

router.get(ROUTE_PATH + '/games', JxHttpTool.wrapController(gameController.listGames));

module.exports = router;
