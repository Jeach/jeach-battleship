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

const path = require('path');

const JxLogger = require('../modules/utils/JxLogger');
const JxHttpTool = require('../modules/http/JxHttpTool');
const JxIO = require('../modules/utils/JxIO');

const CONTROLLER_NAME = 'game-controller';

const log = JxLogger.getInstance(CONTROLLER_NAME, JxLogger.DEBUG);

//---------------------------------------------------------------------------
// Controller Domain
//---------------------------------------------------------------------------

log.info(`Initializing '${CONTROLLER_NAME}'...`);

const SAVED_GAME_FILE = path.resolve(__dirname, '../saved/saved-games.json');

/**
 * Will provide a list of all active games.
 *
 * @since   v1.0, 2021.06.12
 * @author  Christian Jean
 */
exports.listGames = function (req, res) {
   log.info('Requested game list');

   let games = null;

   let exists = JxIO.fileExists(SAVED_GAME_FILE);

   log.debug(' >> File exists: ' + exists);

   if (exists) {
      log.debug(" >> Loading game file: '" + SAVED_GAME_FILE + "'");
      games = JxIO.readFileAsJson(SAVED_GAME_FILE);
      log.debug(' >> Loaded: ', games);
   } else {
      log.debug(" >> Saving game file: '" + SAVED_GAME_FILE + "'");

      games = {
         created: Date.now(),
         games: [],
      };

      JxIO.saveJsonToFile(SAVED_GAME_FILE, games);
   }

   var response = JxHttpTool.getResponse(200, { games: games });

   log.debug(' >> Sending response: ' + response);

   return response;
};
