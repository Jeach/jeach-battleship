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

/**
 * This module is dependant on the third-party 'jquery-layout' library.
 *
 * See: https://layout.jquery-dev.net/downloads.html
 *
 * The primary purpose of this module is to provide tools which wrap the
 * layout library, providing useful functionalities.
 *
 * As of this version, only a single layout is supported.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * In user interface (UI) design, panes and panels are both container-like
 * elements that organize and present content. While they are sometimes used
 * interchangeably, there are subtle distinctions in their typical usage and
 * implications:
 *
 * PANE
 *
 *    Definition:
 *
 *    A pane is often used to refer to a subdivision or section of a window or
 *    interface.
 *
 *    Characteristics:
 *
 *    It usually represents one part of a split or multi-section layout (ie: a
 *    two- or three-pane view).
 *
 *    It is often resizable or adjustable relative to other panes in the same
 *    view. Commonly used in applications to display related but distinct areas
 *    of content, such as a file explorer with a navigation pane and a content
 *    pane.
 *
 * PANEL
 *
 *    Definition:
 *
 *    A panel is a container or area that typically encapsulates  related UI
 *    elements or content.
 *
 *    Characteristics:
 *
 *    Often used for grouping controls, tools, or content in a logical or
 *    functional way.
 *
 *    Panels are less likely to be resizable relative to their surroundings
 *    (though this depends on implementation).
 *
 *    Panels can sometimes "float" or be docked, depending on the application's
 *    UI.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * There are essentially five (5) main pains:
 *
 *    +-------------------------------------------------------------------+
 *    |  North                                                            |
 *    +------------+-----------------------------------------+------------+
 *    |            |                                         |            |
 *    |            |                                         |            |
 *    |    West    |                 Center                  |    East    |
 *    |            |                                         |            |
 *    |            |                                         |            |
 *    +------------+-----------------------------------------+------------+
 *    |  South                                                            |
 *    +-------------------------------------------------------------------+
 *
 * Of which all pains are optional, except for the 'center' which is required.
 *
 * Within each pain, there can be three inner panels:
 *
 *    +-------------------------------------+
 *    |  Header                             |
 *    +-------------------------------------+
 *    |                                     |
 *    |  Content                            |
 *    |                                     |
 *    +-------------------------------------+
 *    |  Footer                             |
 *    +-------------------------------------+
 *
 * Of which all panels are optional, except for the 'content' panel which is
 * required.
 *
 * There can be multiple header and footer panels within each pain.
 *
 * Generally speaking, and based on typical full layout, the north and south
 * pains only have the 'content' panel. While the west and east pains will
 * have all three panels (header, content and footer).
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * See also: https://www.jeasyui.com/index.php
 * See also: https://www.jqwidgets.com/
 */
var JxLayout = (function () {
   //-------------------------------------------------------------------
   // Module variables
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxLayout';
   const MODULE_VERSION = '1.2.0';

   const module_hashcode = generateRandomHashcode();

   //-------------------------------------------------------------------
   // Private variables
   //-------------------------------------------------------------------

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.WARN);

   // Default pane state
   const PANE_STATE = {
      north_open: false,
      west_open: true,
      east_open: false,
      south_open: true,

      north_hidden: false,
      west_hidden: false,
      east_hidden: false,
      south_hidden: false,

      center_header: false,
      center_footer: true,

      west_header: false,
      west_footer: true,

      east_header: false,
      east_footer: true,
   };

   var layout = null;

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
   //
   // These functions can be invoked ONLY from within this module. They do not need to be exported
   // like the public domain functions need to be. As many functions as required can be added here.
   //---------------------------------------------------------------------------------------------

   /**
    * Sample function header.
    *
    * This example can be safely removed.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {Object} describe this parameter.
    */
   function foobar() {
      log.info('Called foobar (a private domain function)');
      log.debug(' >> This private domain function can only be called within this module!');
   }

   //---------------------------------------------------------------------------------------------
   // Public domain functions...
   //
   // These functions can be invoked both internally within this module and externally from
   // outside the module (ie: WebAppTemplate.foobar()).
   //
   // For each public function added to this section, they must also be 'exported' below
   // (see 'Export public domain functions').
   //
   // You can add and export as many functions as required.
   //---------------------------------------------------------------------------------------------

   /**
    * Show the west and east panes.
    */
   function showAllPanes() {
      log.info('Showing all panes');
      setPaneVisibility('west', 'show');
      setPaneVisibility('east', 'show');
   }

   /**
    * Hide the west and east panes.
    */
   function hideAllPanes() {
      log.info('Hiding all panes');
      setPaneVisibility('west', 'hide');
      setPaneVisibility('east', 'hide');
   }

   /**
    * Toggle the west and east panes.
    */
   function toggleAllPanes() {
      log.info('Toggling all pane visibility');
      setPaneVisibility('west', 'toggle');
      setPaneVisibility('west', 'toggle');
   }

   /**
    * Will show all the header and footer panels.
    */
   function showAllHeadersAndFooters() {
      showAllHeaders();
      showAllFooters();
   }

   /**
    * Will hide all the header and footer panels.
    */
   function hideAllHeadersAndFooters() {
      hideAllHeaders();
      hideAllFooters();
   }

   /**
    * Will show all header panels (west, center, east).
    */
   function showAllHeaders() {
      setPanelVisibility('west', 'header', 'show');
      setPanelVisibility('center', 'header', 'show');
      setPanelVisibility('east', 'header', 'show');
   }

   /**
    * Will show all footer panels (west, center, east).
    */
   function showAllFooters() {
      setPanelVisibility('west', 'footer', 'show');
      setPanelVisibility('center', 'footer', 'show');
      setPanelVisibility('east', 'footer', 'show');
   }

   /**
    * Will hide all header panels (west, center, east).
    */
   function hideAllHeaders() {
      setPanelVisibility('west', 'header', 'hide');
      setPanelVisibility('center', 'header', 'hide');
      setPanelVisibility('east', 'header', 'hide');
   }

   /**
    * Will hide all footer panels (west, center, east).
    */
   function hideAllFooters() {
      setPanelVisibility('west', 'footer', 'hide');
      setPanelVisibility('center', 'footer', 'hide');
      setPanelVisibility('east', 'footer', 'hide');
   }

   //-------------------------------------------------------------------------

   /**
    * Will show the header panel of the center pane.
    */
   function showCenterHeader() {
      setPanelVisibility('center', 'header', 'show');
   }

   /**
    * Will hide the header panel of the center pane.
    */
   function hideCenterHeader() {
      setPanelVisibility('center', 'header', 'hide');
   }

   /**
    * Will toggle the header panel of the center pane.
    */
   function toggleCenterHeader() {
      setPanelVisibility('center', 'header', 'toggle');
   }

   /**
    * Will show the header panel of the center pane.
    */
   function showCenterFooter() {
      setPanelVisibility('center', 'footer', 'show');
   }

   /**
    * Will hide the header panel of the center pane.
    */
   function hideCenterFooter() {
      setPanelVisibility('center', 'footer', 'hide');
   }

   /**
    * Will toggle the header panel of the center pane.
    */
   function toggleCenterFooter() {
      setPanelVisibility('center', 'footer', 'toggle');
   }

   /**
    * Will show both the header and footer panels of the center pane.
    */
   function showCenterPanels() {
      setPanelVisibility('center', 'header', 'show');
      setPanelVisibility('center', 'footer', 'show');
   }

   /**
    * Will hide both the header and footer panels of the center pane.
    */
   function hideCenterPanels() {
      setPanelVisibility('center', 'header', 'hide');
      setPanelVisibility('center', 'footer', 'hide');
   }

   /**
    * Will toggle both the header and footer panels of the center pane.
    */
   function toggleCenterPanels() {
      setPanelVisibility('center', 'header', 'toggle');
      setPanelVisibility('center', 'footer', 'toggle');
   }

   //-------------------------------------------------------------------------

   /**
    * Will show the header panel of the center pane.
    */
   function showWestHeader() {
      setPanelVisibility('west', 'header', 'show');
   }

   /**
    * Will hide the header panel of the center pane.
    */
   function hideWestHeader() {
      setPanelVisibility('west', 'header', 'hide');
   }

   /**
    * Will toggle the header panel of the center pane.
    */
   function toggleWestHeader() {
      setPanelVisibility('west', 'header', 'toggle');
   }

   /**
    * Will show the header panel of the center pane.
    */
   function showWestFooter() {
      setPanelVisibility('west', 'footer', 'show');
   }

   /**
    * Will hide the header panel of the center pane.
    */
   function hideWestFooter() {
      setPanelVisibility('west', 'footer', 'hide');
   }

   /**
    * Will toggle the header panel of the center pane.
    */
   function toggleWestFooter() {
      setPanelVisibility('west', 'footer', 'toggle');
   }

   /**
    * Will show both the header and footer panels of the center pane.
    */
   function showWestPanels() {
      setPanelVisibility('west', 'header', 'show');
      setPanelVisibility('west', 'footer', 'show');
   }

   /**
    * Will hide both the header and footer panels of the center pane.
    */
   function hideWestPanels() {
      setPanelVisibility('west', 'header', 'hide');
      setPanelVisibility('west', 'footer', 'hide');
   }

   /**
    * Will toggle both the header and footer panels of the center pane.
    */
   function toggleWestPanels() {
      setPanelVisibility('west', 'header', 'toggle');
      setPanelVisibility('west', 'footer', 'toggle');
   }

   //-------------------------------------------------------------------------

   /**
    * Will show the header panel of the center pane.
    */
   function showEastHeader() {
      setPanelVisibility('east', 'header', 'show');
   }

   /**
    * Will hide the header panel of the center pane.
    */
   function hideEastHeader() {
      setPanelVisibility('east', 'header', 'hide');
   }

   /**
    * Will toggle the header panel of the center pane.
    */
   function toggleEastHeader() {
      setPanelVisibility('east', 'header', 'toggle');
   }

   /**
    * Will show the header panel of the center pane.
    */
   function showEastFooter() {
      setPanelVisibility('east', 'footer', 'show');
   }

   /**
    * Will hide the header panel of the center pane.
    */
   function hideEastFooter() {
      setPanelVisibility('east', 'footer', 'hide');
   }

   /**
    * Will toggle the header panel of the center pane.
    */
   function toggleEastFooter() {
      setPanelVisibility('east', 'footer', 'toggle');
   }

   /**
    * Will show both the header and footer panels of the center pane.
    */
   function showEastPanels() {
      setPanelVisibility('east', 'header', 'show');
      setPanelVisibility('east', 'footer', 'show');
   }

   /**
    * Will hide both the header and footer panels of the center pane.
    */
   function hideEastPanels() {
      setPanelVisibility('east', 'header', 'hide');
      setPanelVisibility('east', 'footer', 'hide');
   }

   /**
    * Will toggle both the header and footer panels of the center pane.
    */
   function toggleEastPanels() {
      setPanelVisibility('east', 'header', 'toggle');
      setPanelVisibility('east', 'footer', 'toggle');
   }

   //-------------------------------------------------------------------------

   /**
    * Will set the the visibility of a panel within a pane.
    *
    * Where 'pane' may be one of:
    *
    *    north, south, center, east, west
    *
    * Where 'panel' may be one of:
    *
    *    header, footer
    *
    * Where 'visibility' may be one of:
    *
    *    show, hide, toggle
    *
    * @todo Validate the pane value.
    * @todo Validate the visibility value.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {String} pane to set for.
    * @param {Object} panel to set for
    * @param {Object} visibility to set to.
    */
   function setPanelVisibility(pane, panel, visibility) {
      log.info('Setting panel visibility');
      log.debug(" >> Pane       : '" + pane + "'");
      log.debug(" >> Panel      : '" + panel + "'");
      log.debug(" >> Visibility : '" + visibility + "'");

      switch (visibility) {
         case 'hide':
            $('.ui-layout-' + pane + ' > .ui-layout-' + panel).hide();
            break;
         case 'show':
            $('.ui-layout-' + pane + ' > .ui-layout-' + panel).show();
            break;
         case 'toggle':
            $('.ui-layout-' + pane + ' > .ui-layout-' + panel).toggle();
            break;
      }

      resizeAll();
   }

   /**
    * Will set the the visibility for a given pane.
    *
    * Where 'pane' may be one of:
    *
    *    north, south, center, east, west
    *
    * Where 'visibility' may be one of:
    *
    *    show, hide, toggle
    *
    * @todo Validate the pane value.
    * @todo Validate the visibility value.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {String} pane to set for.
    * @param {Object} visibility to set to.
    */
   function setPaneVisibility(pane, visibility) {
      log.info('Setting pane visibility');
      log.debug(" >> Pane       : '" + pane + "'");
      log.debug(" >> Visibility : '" + visibility + "'");

      switch (visibility) {
         case 'hide':
            layout.hide(pane);
            break;
         case 'show':
            layout.show(pane);
            break;
         case 'toggle':
            layout.toggle(pane);
            break;
      }

      resizeAll();
   }

   //------------------------------------------------------------------------
   // North Pane
   //------------------------------------------------------------------------

   /**
    * Show the north pane.
    */
   function showNorthPane() {
      setPaneVisibility('north', 'show');
   }

   /**
    * Hide the north pane.
    */
   function hideNorthPane() {
      setPaneVisibility('north', 'hide');
   }

   /**
    * Toggle the north pane.
    *
    * @todo This does not currently work!
    */
   function toggleNorthPane() {
      setPaneVisibility('north', 'toggle');
   }

   //------------------------------------------------------------------------
   // South Pane
   //------------------------------------------------------------------------

   /**
    * Show the south pane.
    */
   function showSouthPane() {
      setPaneVisibility('south', 'show');
   }

   /**
    * Hide the south pane.
    */
   function hideSouthPane() {
      setPaneVisibility('south', 'hide');
   }

   /**
    * Toggle the south pane.
    *
    * @todo This does not currently work!
    */
   function toggleSouthPane() {
      setPaneVisibility('south', 'toggle');
   }

   //------------------------------------------------------------------------
   // West Pane
   //------------------------------------------------------------------------

   /**
    * Show the west pane.
    */
   function showWestPane() {
      setPaneVisibility('west', 'show');
   }

   /**
    * Hide the west pane.
    */
   function hideWestPane() {
      setPaneVisibility('west', 'hide');
   }

   /**
    * Toggle the west pane.
    */
   function toggleWestPane() {
      setPaneVisibility('west', 'toggle');
   }

   //------------------------------------------------------------------------
   // East Pane
   //------------------------------------------------------------------------

   /**
    * Show the east pane.
    */
   function showEastPane() {
      setPaneVisibility('east', 'show');
   }

   /**
    * Show the east pane.
    */
   function hideEastPane() {
      setPaneVisibility('east', 'hide');
   }

   /**
    * Toggle the east pane.
    */
   function toggleEastPane() {
      setPaneVisibility('east', 'toggle');
   }

   /**
    * Will set the content for a given pane.
    *
    * Where 'pane' may be one of:
    *
    *    north, south, center, east, west
    *
    * @todo Validate the pane value.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {String} pane to set for.
    * @param {Object} content to set with.
    */
   function setContent(pane, content) {
      log.info('Setting content for pain');
      log.info(" >> Pain: '" + pane + "'");
      $('#ui-view-' + pane).html(content);
   }

   /**
    * Will append content to a given pane.
    *
    * Where 'pane' may be one of:
    *
    *    north, south, center, east, west
    *
    * @todo Validate the pane value.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {String} pane to set for.
    * @param {Object} content to set with.
    */
   function appendContent(pane, content) {
      log.info('Appending content to pain');
      log.info(" >> Pain: '" + pane + "'");
      $('#ui-view-' + pane).append(content);
   }

   // TODO
   // function centerContent(panel) {
   //    $('#ui-view' + panel).addClass('ui-center-content');
   // }

   /**
    * Will get the visibility state for a panel.
    *
    * Where 'pane' may be one of:
    *
    *    north, south, center, east, west
    *
    * Where 'panel' may be one of:
    *
    *    header, footer
    *
    * Considering that 'center' is a required pane, it will always visible.
    *
    * @todo Validate the pane value.
    * @todo Validate the panel value.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {String} pane to check visibility for.
    * @param {String} panel to check visibility for.
    */
   function getPaneVisibility(pane, panel) {
      log.info('Getting pane and panel visibility');
      log.debug(" >> Pane    : '" + pane + "'");
      log.debug(" >> Panel   : '" + panel + "'");
      var s = $('.ui-layout-' + pane + ' > .ui-layout-' + panel).is(':visible');
      log.debug(' >> Visible : ' + s);
      return s;
   }

   function isCenterHeaderVisible() {
      return getPaneVisibility('center', 'header');
   }

   function isCenterFooterVisible() {
      return getPaneVisibility('center', 'footer');
   }

   function isWestHeaderVisible() {
      return getPaneVisibility('west', 'header');
   }

   function isWestFooterVisible() {
      return getPaneVisibility('west', 'footer');
   }

   function isEastHeaderVisible() {
      return getPaneVisibility('east', 'header');
   }

   function isEastFooterVisible() {
      return getPaneVisibility('east', 'footer');
   }

   /**
    * Will save the curernt layout state.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {Object} state to be restored.
    *
    * @returns the state object.
    */
   function saveLayout(state) {
      log.info('Saving layout state');

      var s = state || PANE_STATE;

      s = {
         north_open: !layout.state.north.isClosed,
         west_open: !layout.state.west.isClosed,
         east_open: !layout.state.east.isClosed,
         south_open: !layout.state.south.isClosed,

         north_hidden: layout.state.north.isHidden,
         west_hidden: layout.state.west.isHidden,
         east_hidden: layout.state.east.isHidden,
         south_hidden: layout.state.south.isHidden,

         center_header: getPaneVisibility('center', 'header'),
         center_footer: getPaneVisibility('center', 'footer'),
         west_header: getPaneVisibility('west', 'header'),
         west_footer: getPaneVisibility('west', 'footer'),
         east_header: getPaneVisibility('east', 'header'),
         east_footer: getPaneVisibility('east', 'footer'),
      };

      log.debug(' >> Saved latyout: ' + JSON.stringify(3, null, s));

      return s;
   }

   /**
    * Will apply a previously saved layout state.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {Object} state to be restored.
    */
   function applyLayout(state) {
      log.info('Restoring layout state: ' + JSON.stringify(s));
      var s = state || PANE_STATE;
   }

   /**
    * Will apply a custom layout based on a preset theme name.
    *
    * Where 'name' can be:
    *
    *
    *    site     Which enables ...
    *
    *    app      Which enables ...
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @param {String} name is the theme to apply a layout for.
    */
   function setLayoutTheme(name) {
      if (name) {
         switch (name) {
            case 'site':
               // hideVerticalPanels();
               // hideCenterPanes();
               $('.ui-layout-north').addClass('ui-site-header');
               break;
            case 'app':
               // showVerticalPanels();
               // showCenterPanes();
               $('.ui-layout-north').removeClass('ui-site-header');
               break;
         }

         resizeAll();
      }
   }

   /**
    * Will resize all panes.
    *
    * @author  Christian Jean
    * @since   1.0.0
    */
   function resizeAll() {
      log.info('Resizing all panes');
      layout.resizeAll();
   }

   function validateOption(op, def) {
      log.info('Validating options');
      log.debug(' >> Op      : ' + op);
      log.debug(' >> Default : ' + def);

      let b = def;

      if (op !== null) {
         if (JxValidate.isBoolean(op)) {
            b = !op;
         } else if (JxValidate.isString(op)) {
            if (op == 'open' || op == 'opened') b = false;
            if (op == 'close' || op == 'closed') b = true;
         }
      }

      log.debug(' >> Returning : ' + b);

      return b;
   }

   /**
    * Will initialize a new layout using default configurations.
    *
    * Parameter options:
    *
    *    {
    *       'north': true, // Show north pane
    *       'south': false, // Close south pane
    *       'west': false, // Close west pane
    *       'east': false, // Close east pane
    *    }
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {layout} the layout reference object.
    */
   function initLayout(options = {}) {
      log.info('Initializing new layout...');

      log.debug(' >> Options: ' + JSON.stringify(options));

      if (options == null) options = {};

      options && options['south'] ? log.debug(' >> South t: ' + !options.south) : false;

      var ops = {
         initClosed: true, // Set default, 'xxxx__initClosed: false' to override

         north__size: 'auto',
         north__resizable: false,
         north__slidable: false,
         north__closable: false,
         north__spacing_open: 0,
         north__spacing_closed: 0,
         north__initClosed: validateOption(options.north, false),

         west__size: 300,
         west__resizable: true,
         west__slidable: true,
         west__closable: true,
         west__spacing_open: 4,
         west__spacing_closed: 4,
         west__togglerLength_open: 200, // 0 = Hide toggler, -1 = full width of pane
         west__togglerLength_closed: 200, // 0 = Hide toggler, -1 = full width of pane
         west__initClosed: validateOption(options.west, false),
         west__togglerTip_open: 'Close This Pane',
         west__togglerTip_closed: 'Open This Pane',
         west__resizerTip: 'Resize This Pane',

         east__size: 300,
         east__resizable: false,
         east__slidable: true,
         east__closable: true,
         east__spacing_open: 4,
         east__spacing_closed: 4,
         east__togglerLength_open: 200, // 0 = Hide toggler, -1 = full width of pane
         east__togglerLength_closed: 200, // 0 = Hide toggler, -1 = full width of pane
         east__initClosed: validateOption(options.east, true),
         east__togglerTip_open: 'Close This Pane',
         east__togglerTip_closed: 'Open This Pane',
         east__resizerTip: 'Resize This Pane',

         south__size: 'auto',
         south__resizable: false,
         south__slidable: false,
         south__closable: false,
         south__spacing_open: 0,
         south__spacing_closed: 0,
         south__initClosed: validateOption(options.south, false),

         center__minSize: 1000,
      };

      //  north__showOverflowOnHover : true  // drop-down menu?

      layout = $('body').layout(ops);

      if (validateOption(options.panels, true) === true) {
         log.debug(' >> Hiding all panels (north/south)!');
         hideAllHeadersAndFooters();
      }

      return layout;
   }

   function getLayout() {
      return layout;
   }

   //-------------------------------------------------------------------
   // Exported functions and constants
   //-------------------------------------------------------------------

   return {
      // Export public domain functions
      initLayout: initLayout,

      getLayout: getLayout,

      applyLayout: applyLayout,
      saveLayout: saveLayout,

      setContent: setContent,
      appendContent: appendContent,

      resizeAll: resizeAll,

      setPanelVisibility: setPanelVisibility,

      setPaneVisibility: setPaneVisibility,
      getPaneVisibility: getPaneVisibility,

      showAllPanes: showAllPanes,
      hideAllPanes: hideAllPanes,
      toggleAllPanes: toggleAllPanes,

      showNorthPane: showNorthPane,
      hideNorthPane: hideNorthPane,
      toggleNorthPane: toggleNorthPane,

      showSouthPane: showSouthPane,
      hideSouthPane: hideSouthPane,
      toggleSouthPane: toggleSouthPane,

      showEastPane: showEastPane,
      hideEastPane: hideEastPane,
      toggleEastPane: toggleEastPane,

      showWestPane: showWestPane,
      hideWestPane: hideWestPane,
      toggleWestPane: toggleWestPane,

      isCenterHeaderVisible: isCenterHeaderVisible,
      isCenterFooterVisible: isCenterFooterVisible,
      isWestHeaderVisible: isWestHeaderVisible,
      isWestFooterVisible: isWestFooterVisible,
      isEastHeaderVisible: isEastHeaderVisible,
      isEastFooterVisible: isEastFooterVisible,

      showAllHeadersAndFooters: showAllHeadersAndFooters,
      hideAllHeadersAndFooters: hideAllHeadersAndFooters,

      showAllHeaders: showAllHeaders,
      showAllFooters: showAllFooters,
      hideAllHeaders: hideAllHeaders,
      hideAllFooters: hideAllFooters,

      showCenterHeader: showCenterHeader,
      hideCenterHeader: hideCenterHeader,
      toggleCenterHeader: toggleCenterHeader,

      showCenterFooter: showCenterFooter,
      hideCenterFooter: hideCenterFooter,
      toggleCenterFooter: toggleCenterFooter,

      showCenterPanels: showCenterPanels,
      hideCenterPanels: hideCenterPanels,
      toggleCenterPanels: toggleCenterPanels,

      showWestHeader: showWestHeader,
      hideWestHeader: hideWestHeader,
      toggleWestHeader: toggleWestHeader,

      showWestFooter: showWestFooter,
      hideWestFooter: hideWestFooter,
      toggleWestFooter: toggleWestFooter,

      showWestPanels: showWestPanels,
      hideWestPanels: hideWestPanels,
      toggleWestPanels: toggleWestPanels,

      showEastHeader: showEastHeader,
      hideEastHeader: hideEastHeader,
      toggleEastHeader: toggleEastHeader,

      showEastFooter: showEastFooter,
      hideEastFooter: hideEastFooter,
      toggleEastFooter: toggleEastFooter,

      showEastPanels: showEastPanels,
      hideEastPanels: hideEastPanels,
      toggleEastPanels: toggleEastPanels,

      // Export public module functions
      getName: getName,
      getVersion: getVersion,
      hashCode: hashCode,
      getObject: getObject,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

console.log('Loading: ' + JxLayout.toString());
