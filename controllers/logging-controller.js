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

const JxLogger = require('../modules/utils/JxLogger');
const JxHttpTool = require('../modules/http/JxHttpTool');

const CONTROLLER_NAME = 'logging-controller';

const log = JxLogger.getInstance(CONTROLLER_NAME, JxLogger.WARN);

//---------------------------------------------------------------------------
// Controller Domain
//---------------------------------------------------------------------------

log.info(`Initializing '${CONTROLLER_NAME}'...`);

/**
 * Sample controller that simply logs each request.
 *
 * @since   v1.0, 2022.08.19
 * @author  Christian Jean
 */
exports.loggingController = function (req, res) {
   log.info('Logging controller called');
   var response = JxHttpTool.getResponse(200, 'Logging was successful');
   log.debug(' >> Sending response: ' + response);
   return response;
};
