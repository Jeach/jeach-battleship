/*
 * Copyright (C) 2021 Christian Jean
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

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const JxLogger = require('../utils/JxLogger');
const JxString = require('../lang/JxString');
const JxValidate = require('../lang/JxValidate');

/**
 * The 'JxIO' is a single module which provides an I/O toolbox to
 * read, write and manipulate files and directories.
 *
 * @author Christian Jean
 * @date   2023.03.05
 */
var JxIO = (function () {
   //-------------------------------------------------------------------
   // Module variables
   //-------------------------------------------------------------------

   const MODULE_NAME = 'JxIO';
   const MODULE_VERSION = '1.8.0';

   const MODULE_HASHCODE = generateRandomHashcode();

   const MODE_0666 = parseInt('0666', 8);
   const MODE_0755 = parseInt('0755', 8);

   const DIR_RECURSE_MAX_DEPTH = Number.MAX_VALUE;
   const DIR_RECURSE_DEFAULT_DEPTH = 1; // one level deep

   //-------------------------------------------------------------------
   // Private variables
   //-------------------------------------------------------------------

   const log = JxLogger.getInstance(MODULE_NAME, JxLogger.WARN);

   //-------------------------------------------------------------------
   // Constructor
   //-------------------------------------------------------------------

   init.apply(null, arguments);

   /**
    * Initialize our module.
    *
    * @author Christian Jean
    * @since  2023.03.05
    */
   function init() {
      log.info("Initializing '" + MODULE_NAME + "' module");

      log.debug(' > Version  : ' + getVersion());
      log.debug(' > Hashcode : ' + getHashcode());
      log.debug(' > Args     : ' + arguments.length);
   }

   //-------------------------------------------------------------------
   // Private module functions
   //-------------------------------------------------------------------

   /**
    * Provide a unique ID for this instance.
    *
    * @param {Number} maximum length of ID to return (optional).
    *
    * @returns {String} the ID representation of this instance.
    */
   function getHashcode(max) {
      let id = MODULE_HASHCODE;
      if (max && typeof max === 'number') {
         if (max < 4) max = 4;
         if (max > id.length) max = id.length;
         id = MODULE_HASHCODE.substring(0, max);
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
    * Provides the name of this module.
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {String} The name of this module.
    */
   function getName() {
      return MODULE_NAME;
   }

   /**
    * Provides the module version number represented as a three-digit
    * sequence delimited by decimals (ie: '1.2.3').
    *
    * @author  Christian Jean
    * @since   1.0.0
    *
    * @returns {String} the module version number.
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

      status.push('version: ' + getVersion());

      var text = getName() + '@' + getHashcode(8) + ': [' + status.join(', ') + ']';

      return text;
   }

   //---------------------------------------------------------------------------------------------
   // Private domain functions
   //---------------------------------------------------------------------------------------------

   /**
    * A simple fonvenience function which logs and avoids importing
    * the 'fs' module in other files and locations.
    */
   function join(...paths) {
      log.info('Joining paths');
      log.debug(' >> Path length : ' + (paths ? paths.length : '<null>'));

      paths.forEach((p, idx) => {
         log.debug(' >> Path ' + idx + "  : '" + paths[idx] + '"');
      });

      let finalPath = path.join(...paths);

      log.debug(" >> Final path  : '" + finalPath + "'");

      return finalPath;
   }

   /**
    * Get the current working directory.
    *
    * @returns {String} representing a directory path.
    */
   function currentDir() {
      log.info('Getting current working directory');
      let cwd = process.cwd();
      log.debug(" >> Current working directory: '" + cwd + "'");
      return cwd;
   }

   function changeDir(to) {
      log.info('Changing directory');
      try {
         log.debug(" >> From : '" + process.cwd() + "'");
         log.debug(" >> To   : '" + to + "'");
         process.chdir(to);
         log.debug(" >> Now  : '" + process.cwd() + "'");
      } catch (err) {
         log.error("Could not change to dir '" + to + "'");
         log.error(err);
      }
   }

   /**
    * Will determine if the filename (with optional path) exists and
    * is a file.
    *
    * @param {String} filename is a filename or path and filename.
    *
    * @returns 'true' if the file exists and is a file, 'false' otherwise.
    */
   function fileExists(filename) {
      let b = false;

      if (fs.existsSync(filename) && fs.lstatSync(filename).isFile()) {
         b = true;
      }

      return b;
   }

   /**
    * Delete a file.
    *
    * @param {String} filename
    */
   function deleteFile(filename) {
      let b = false;

      if (fileExists(filename)) {
         try {
            fs.unlinkSync(filename);
            b = true;
         } catch (e) {}
      }

      return b;
   }

   /**
    * Will rename a file to another name.
    * This is exclusive to files.
    *
    * @see renameDir
    */
   function renameFile(from, to) {
      log.info('Rename file');
      log.info(" >> From : '" + from + "'");
      log.info(" >> To   : '" + to + "'");

      let b = false;

      if (fileExists(from) && !fileExists(to)) {
         try {
            fs.renameSync(from, to);
            b = true;
         } catch (err) {
            log.error(err);
         }
      }

      if (b) log.debug(' >> Successfully renamed file');
      else log.error(' >> Could not rename file');

      return b;
   }

   /**
    * Will rename a directory to another name.
    * This is exclusive to directories.
    *
    * @see renameFile
    */
   function renameDir(from, to) {
      log.info('Rename directory');
      log.info(" >> From : '" + from + "'");
      log.info(" >> To   : '" + to + "'");

      let b = false;

      if (dirExists(from) && !dirExists(to)) {
         try {
            fs.renameSync(from, to);
            b = true;
         } catch (err) {
            log.error(err);
         }
      }

      if (b) log.debug(' >> Successfully renamed directory');
      else log.error(' >> Could not rename directory');

      return b;
   }

   /**
    * Will create a new directory (if not already exist).
    *
    * Options are:
    *
    *    recursive   If 'true', will create a recursive/nested directory
    *                structure. Default value is 'false'.
    *
    *    mode        Is the directory mode. Not supported on Windows.
    *                Supports <string> or <integer>.
    *                Default value is '0777'.
    *
    * Example:
    *
    *    createDir('some/path', { recursive: true, mode: '0775' });
    *
    * @param {String} dirName is the directory name to create.
    *
    * @returns
    */
   function createDir(dirName, options = { recursive: false }) {
      log.info('Creating a directory');
      log.debug(" >> Name    : '" + dirName + "'");

      let b = false;
      let opts = { recursive: false, mode: '0777' };

      if (JxValidate.isObject(options)) opts = { ...opts, ...options };
      else if (JxValidate.isBoolean(options)) opts.recursive = options;
      else if (JxValidate.isString(options)) opts.mode = options;

      log.debug(' >> Options : ' + JSON.stringify(options));
      log.debug(' >> Opts    : ' + JSON.stringify(opts));

      if (!fs.existsSync(dirName)) {
         fs.mkdirSync(dirName, opts);
         b = true;
      }

      return b;
   }

   /**
    * Will determine if the directory 'pathname' exists and is a
    * directory (not a file, FIFO, socket, etc.).
    *
    * @param {String} pathname is a valid directory path.
    *
    * @returns 'true' if the path exists and is a directory, 'false' othewise.
    */
   function dirExists(pathname) {
      let b = false;

      if (fs.existsSync(pathname) && fs.lstatSync(pathname).isDirectory()) {
         b = true;
      }

      return b;
   }

   /**
    * Will delete a directory path.
    *
    * Setting the 'recursive' flag to 'true' will act similar to the
    * command line:
    *
    *   $> rm -rf [path]
    *
    * Without it, if any files or directories are inside of 'path', an
    * error of:
    *
    *   ENOTEMPTY: directory not empty
    *
    * @param {String} path is a directory path.
    * @param {Boolean} recursive optionally rm recursively.
    *
    * @returns 'true' if successfully deleted, 'false' otherwise.
    */
   function deleteDir(path, recursive = false) {
      log.info('Delete directory');
      log.debug(" >> Path : '" + path + "'");
      log.debug(' >> Recursive: ' + recursive);
      let b = false;
      if (dirExists(path)) {
         try {
            fs.rmdirSync(path, { recursive: recursive });
            b = true;
         } catch (err) {
            log.error(err);
         }
      }
      return b;
   }

   function FILE_FILTER_EXTENSION(ext) {}

   /**
    * Will get a list of files in the specified directory.
    *
    * If the directory does not exist, a 'null' value will be returned.
    * If the directory has no files, an empty array ([]) will be returned.
    * If the directory has files, an array of files will be provided.
    *
    * NOTE: This function is used internally (not publicly exposed).
    *
    * @param {String} dirname is a directory path name.
    * @param {Function} fnFilter is an optional file filter.
    *
    * @returns 'null' if directory does not exist, otherwise an array.
    */
   function _listFiles(dirname, fnFilter) {
      let list = [];
      let cnt = 0;

      log.info(' >> Listing files');
      log.debug(" >> Directory : '" + dirname + "'");

      if (!dirExists(dirname)) {
         log.warn("Directory '" + dirname + "' does not exist, aborting!");
         return null;
      }

      list = fs
         .readdirSync(dirname, { withFileTypes: true, recursive: true })
         .filter((dirent) => {
            if (!dirent.isFile()) return false;
            cnt++;
            let fnReturn = true;
            if (fnFilter && typeof fnFilter === 'function') {
               fnReturn = fnFilter(dirent.name, dirname);
            }
            return fnReturn;
         })
         .map((dirent) => path.join(dirname, dirent.name));

      log.debug(' >> Found ' + (list ? list.length : '0') + ' of ' + cnt + ' file candiates');

      return list != null ? list : [];
   }

   /**
    * Will get a list of files in the specified directory.
    *
    * If 'path' is not provided or is not a string, a 'null' value will be
    * returned.
    *
    * If the directory does not exist, a 'null' value will be returned.
    *
    * If the directory has no files, an empty array ([]) will be returned.
    *
    * If the directory has files, an array of files will be provided
    * (conditional to the optional filter used).
    *
    * If the 'depth' argument is *NOT* provided (omitted), the 'depth' will
    * be overridden to 'DIR_RECURSE_DEFAULT_DEPTH' (or only 1 level deep).
    *
    * If the 'depth' argument is zero (0), or is a negative number (<0), the
    * 'depth' will be overridden to 'DIR_RECURSE_MAX_DEPTH' (or infinate).
    *
    * This function may be called with the 'depth' and 'filter' arguments
    * in any order.
    *
    * @param {String} dirname is a directory path name.
    *
    * @param {Number} depth is the recursive depth to scan to.
    * @param {Function} filter is the filtering function to use.
    *
    * @returns 'null' if directory does not exist, otherwise an array.
    */
   // function listFiles(dirname, options) {
   function listFiles(dirname, depth = DIR_RECURSE_DEFAULT_DEPTH, filter) {
      let pp = null;
      let dd = null;
      let ff = null;

      log.info('Listing files');
      log.debug(" >> Dirname : '" + dirname + "'");
      log.debug(' >> Depth   : ' + depth);
      log.debug(' >> Filter  : ' + (filter ? 'YES' : 'NONE'));

      if (!JxValidate.isString(dirname)) {
         let type = typeof dirname;
         if (type == 'undefined') type = 'null';
         log.error(" >> Invalid type for 'path', expecting 'string' and received '" + type + "'.");
         return null;
      }

      let dirs = listDirectories(dirname, depth);

      dirs.push(dirname);

      log.debug(' >> Found ' + dirs.length + ' directories');

      let files = [];

      dirs.forEach((dir, idx) => {
         log.debug("   >> Directory: '" + dir + "'");
         let ff = xlistFiles(dir, 1);
         ff.forEach((file, idx) => {
            files.push(file);
         });
      });

      log.debug(' >> Found ' + files.length + ' files');

      files.forEach((file, idx) => {
         log.debug("     >> File: '" + file + "'");
      });

      return files;
   }

   function xlistFiles(dirname, depth) {
      let list = [];

      log.info('Listing files');

      let recurseDepth = depth != null ? depth : DIR_RECURSE_DEFAULT_DEPTH;
      if (recurseDepth < 1) recurseDepth = DIR_RECURSE_MAX_DEPTH;

      log.debug(" >> Directory : '" + dirname + "'");
      log.debug(' >> Depth     : ' + recurseDepth);

      let files = _listFiles(dirname);

      if (!files) {
         log.warn("Directory '" + dirname + "' does not exist, aborting!");
         return null;
      }

      list = files;

      if (recurseDepth > 1) {
         let dirs = listDirectories(dirname, --recurseDepth);

         if (!dirs || dirs.length < 1) {
            return list;
         }

         dirs.forEach((d, idx) => {
            let files = _listFiles(d);
            list = [...list, ...files];
         });
      }

      return list;
   }

   /**
    * Will get a list of directories in the specified directory.
    *
    * If the directory does not exist, a 'null' value will be returned.
    * If the directory has no directory, an empty array ([]) will be returned.
    * If the directory has one or more directories, an array of folders will be
    * provided.
    *
    * If no second parameter ('depth') is provided, it will recurse to a depth
    * of 'DIR_RECURSE_DEFAULT_DEPTH' (or only 1 level deep).
    *
    * Providing a 'depth' of less than one (1) will recurse to a depth of
    * 'DIR_RECURSE_MAX_DEPTH' (or infinate).
    *
    * @param {String} dirname is a directory path name.
    * @param {Number} depth is the recursive depth to scan to.
    *
    * @returns 'null' if directory does not exist, otherwise an array of files.
    */
   function listDirectories(dirname, depth = DIR_RECURSE_DEFAULT_DEPTH) {
      let list = [];

      let recurseDepth = depth != null ? depth : DIR_RECURSE_DEFAULT_DEPTH;
      if (recurseDepth < 1) recurseDepth = DIR_RECURSE_MAX_DEPTH;

      if (!dirExists(dirname)) {
         log.warn("Directory '" + dirname + "' does not exist, aborting!");
         return null;
      }

      log.info('Listing DIRECTORY');
      log.debug(" >> Directory     : '" + dirname + "'");
      log.debug(' >> Recurse depth : ' + recurseDepth);

      list = fs
         .readdirSync(dirname, { withFileTypes: true, recursive: true })
         .filter((dirent) => dirent.isDirectory())
         .map((dirent) => path.join(dirname, dirent.name));

      if (recurseDepth > 1 && list.length > 0) {
         log.debug(' >> Found: ' + list.length + ', hits: ' + JSON.stringify(list));
         let remain = --recurseDepth;
         list.forEach((d) => {
            let ll = listDirectories(d, remain);
            list = [...list, ...ll];
         });
      }

      log.debug(' >> Final list: ' + list.length + ', directories');

      list.forEach((d, i) => {
         log.trace('   >> ' + JxString.lpad(i, (list.length + '').length, '0') + ": '" + d + "'");
      });

      return list;
   }

   function getDirectories(srcpath) {
      const path = require('path');

      return fs
         .readdirSync(srcpath)
         .map((file) => path.join(srcpath, file))
         .filter((path) => fs.statSync(path).isDirectory());
   }

   function flatten(lists) {
      return lists.reduce((a, b) => a.concat(b), []);
   }

   function getDirectoriesRecursive(srcpath) {
      return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
   }

   /**
    * Get the Linux stats object for a given file.
    *
    * Where:
    *
    *    dev         Is the numeric identity of the device in which the file
    *                is situated.
    *
    *    rdev        Is the numeric identify of the device type.
    *
    *    mode        Is a bit-field that describes the file type and mode.
    *
    *    nlink       Is the number of hard-links to the file.
    *
    *    uid         Is the user ID to which the file belongs to.
    *    gid         Is the group ID to which the file belongs to.
    *
    *    ino         Is the 'inode' number of the file. If two files have the
    *                same inode number, they are hard links to the same data,
    *                since inodes are unique identifiers for files in a filesystem.
    *
    *    size        Is the size of the file in bytes.
    *
    *    blocks      Is the number of 512-byte blocks this file uses.
    *
    *    blksize     Is the block size of I/O operations in the file system.
    *                Meaning that any read or write on the disk will transfer
    *                a whole block/sector at a time (ie: typically 512-bytes).
    *
    *    atime       Is the 'access' time, which indicates the last time a
    *                file was accessed. atime can be updated alone.
    *
    *    mtime       Is the 'modified' time, which is the last time a file's
    *                content was modified. mtime will modify both atime and
    *                ctime.
    *
    *    ctime       Is the 'change' time, which refers to the last time some
    *                metadata related to the file (properties) were changed.
    *                ctime will update atime.
    *
    *    birthtime   Is the time when the file was created on the filesystem.
    *                Also known as the file creation time.
    *
    * @param {String} file name and path.
    *
    * @returns a stats object.
    */
   function getFileStats(file) {
      log.info('Getting file stats');
      log.debug(" >> Filename: '" + file + "'");
      let stats = fs.statSync(file);
      log.debug(' >> Stats: ' + JSON.stringify(stats));
      return stats;
   }

   /**
    *
    * @param {String} file name or path.
    *
    * @returns {Number} the file size in bytes.
    */
   function getFileSize(file) {
      log.info('Getting file size');
      log.debug(" >> Filename: '" + file + "'");
      let stats = getFileStats(file);
      log.debug(' >> Size (in bytes): ' + stats.size);
      return stats.size;
   }

   /**
    * Get a formated byte size expression using the 'International Electrotechnical
    * Commission' (IEC).
    *
    * The international standard IEC 80000-13 uses the term 'byte' to mean eight
    * bits (1 B = 8 bit). Therefore, 1 kB = 8000 bit. One thousand kilobytes
    * (1000 kB) is equal to one megabyte (1 MB), where 1 MB is one million bytes.
    * A kibibyte is 1024 bytes.
    *
    * The International System of Units (SI) defines its prefixes as multiplication
    * factor of 1000. The term 'kilobyte' has traditionally been used to refer to
    * 1024 bytes (210 B). The usage of the metric prefix kilo for binary multiples
    * arose as a convenience, because 1024 is approximately 1000.
    *
    *    ------------------------------------------------------
    *    Binary                        Decimal
    *    ------------------------------------------------------
    *    Value    IEC Definition       Value    SI / Metric
    *    ------------------------------------------------------
    *    1024	   KiB or kibibyte      1024	   KB or kilobyte
    *    1024^2	MiB or mebibyte      1024^2   MB or megabyte
    *    1024^3	GiB or gibibyte      1024^3   GB or gigabyte
    *    1024^4	TiB or tebibyte      1024^4   TB or terabyte
    *    1024^5	PiB or pebibyte      1024^5   PB or petabyte
    *    1024^6	EiB or exbibyte      1024^6   EB or exabyte
    *    1024^7	ZiB or zebibyte      1024^7   ZB or zettabyte
    *    1024^8   YiB or yobibyte      1024^8   YB or yottabyte
    *      -       -        -          1024^9   RB or ronnabyte
    *      -       -        -          1024^10  QB or quettabyte
    *
    * @see JxString.formatBytes
    *
    * @param {Number} bytes to calculate for visual output.
    * @param {Number} decimals is optional decimal rounding (default is 2 digits)
    *
    * @returns a string representation of the byte value.
    */
   function formatBytes(bytes, decimals = 2) {
      const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

      if (bytes <= 0) return '0 bytes';
      if (bytes == 1) return '0 byte';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${units[i]}`;
   }

   /**
    * Extract the file extension from the filename.
    *
    * Examples:
    *
    *    file.name.with.dots.txt    // txt
    *    file.txt                   // txt
    *    file                       // null
    *    ""                         // null
    *    null                       // null
    *    undefined                  // null
    *    /some/path/to/file.ext     // ext
    *
    * @author  Christian Jean
    * @since   1.2.2
    *
    * @param {String} filename to extract from.
    *
    * @returns The file extension.
    */
   function getFileExt(filename) {
      log.info('Getting file extension');
      log.debug(" << Filename: '" + filename + "'");
      let re = /(?:\.([^.]+))?$/;
      let ext = re.exec(filename)[1];
      log.debug(' >> Extension: ' + ext + "'");
      return ext !== undefined ? ext : null;
   }

   /**
    * Will construct a hexadecimal path from the given SHA1 or UUID
    * hex value provided.
    *
    * Examples w/ SHA1:
    *
    *    let sha1 = 'd444f18dc350fb334c811d9c4b0dfdf63f67df47';
    *
    *    getHexPath(sha1);                // d4/44
    *    getHexPath(sha1, sha1);          // d4/44/d444f18dc350fb334c811d9c4b0dfdf63f67df47
    *    getHexPath(sha1, sha1, '.ext');  // d4/44/d444f18dc350fb334c811d9c4b0dfdf63f67df47.ext
    *
    *    getHexPath(sha1, { prefix: [ 'foo', 'bar' ], suffix: [ sha1, '.ext' ]);
    *    // foo/bar/d4/44/d444f18dc350fb334c811d9c4b0dfdf63f67df47.ext
    *
    * @param {String} hexValue is a SHA1 or a UUID string.
    * @param  {Array} parts any other paths to be joined.
    *
    * @returns a unique hex path.
    */
   function getHexPath(hexValue = null, ...parts) {
      log.info('Creating a HEX path');

      let finalPath = null;

      log.debug(" >> HEX part   : '" + hexValue + "'");
      log.debug(' >> Parts      : ' + (parts ? parts.length : '<none>'));

      if (!JxValidate.isSHA1(hexValue) || !JxValidate.isUUID(hexValue)) throw "Invalid 'hexValue' parameter (expecting a 'SHA1' or 'UUID' string)";

      let p1 = hexValue.substring(0, 2);
      let p2 = hexValue.substring(2, 4);

      finalPath = fs.join(p1, p2);

      log.debug(" >> HEX path   : '" + finalPath + "'");

      if (JxValidate.isArray(parts)) {
         parts = [finalPath, ...parts];
         finalPath = fs.join(parts);
      }

      log.debug(" >> Final path : '" + finalPath + "'");

      return finalPath;
   }

   /**
    * Get the file permissions.
    *
    * Constants (from 'fs.constants'):
    *
    *    F_OK     Flag indicating that the file is visible to the process.
    *    R_OK     Flag indicating that the file can be read from.
    *    W_OK     Flag indicating that the file can be written to.
    *    X_OK     Flag indicating that the file can be executed by the
    *             calling process. This has no affect in Windows (will
    *             behave like F_OK).
    *
    * @param {String} file to get permissions for.
    *
    * @returns a JSON object with permissions
    */
   function getFilePerms(file) {
      log.info('Getting file permissions');
      log.debug(" >> Filename: '" + file + "'");

      let read = true;
      let write = true;
      let exec = true;

      try {
         fs.accessSync(file, fs.constants.R_OK);
      } catch (e) {
         read = false;
      }

      try {
         fs.accessSync(file, fs.constants.W_OK);
      } catch (e) {
         write = false;
      }

      try {
         fs.accessSync(file, fs.constants.X_OK);
      } catch (e) {
         exec = false;
      }

      return { read: read, write: write, exec: exec };
   }

   /**
    * Synchronously read data from a file.
    *
    * If the 'options' is a string, then it specifies the encoding.
    *
    * Where 'options' are:
    *
    *    'utf8'      Will receive a String (UTF8 text) [default].
    *                This is this library default if no options provided,
    *                overiding the 'fs' default (see below).
    *
    *    'base64'    Will receive a String (text) encoded as Base64.
    *
    *    'binary'    Will receive a 'Uint8Array' buffer.
    *                This is the 'fs' library default option.
    *
    *    'buffer'    This is an alias for 'binary'.
    *
    * Example:
    *
    *    let text   = readFile('filename.ext', 'utf8');
    *    let buffer = readFile('filename.ext', 'binary');
    *    let base64 = readFile('filename.ext', 'base64');
    *
    * @param {String} filename is the full pathname of a file.
    * @param {String} options is an optional options string.
    *
    * @returns a String or Buffer
    */
   function readFile(filename, options = 'utf8') {
      log.info("Reading from file '" + filename + "'");
      log.info(" >> Options: '" + options + "'");
      if (options === 'buffer') options = 'binary';
      let data = fs.readFileSync(filename, options);
      log.debug(' >> Successfully read in ' + data.length + ' bytes');
      return data;
   }

   /**
    * Synchronously read data from a file, line-by-line.
    *
    * This function passes 'utf8' as options in order to force the output
    * as a String rather than a Buffer.
    *
    * @param {String} filename
    *
    * @returns an array of strings representing each line.
    */
   function readFileToArray(filename) {
      let data = [];
      log.info("Reading from file (line by line): '" + filename + "'");
      let lines = readFile(filename, 'utf8');
      log.debug(' >> Completed reading from file');
      lines.split(/\r?\n/).forEach((line) => {
         data.push(line);
      });
      log.debug(' >> Read ' + data.length + ' lines');
      return data;
   }

   /**
    * Synchronously read a file as JSON input.
    *
    * @param {String} filename is the full path and file name.
    *
    * @returns a JSON object.
    */
   function readFileAsJson(filename) {
      log.info("Reading from file (line by line): '" + filename + "'");
      let data = readFile(filename, 'utf8');
      log.debug(' >> Completed reading file (' + data.length + ' bytes)');
      let json = JSON.parse(data);
      log.debug(' >> Successfully parsed to JSON');
      return json;
   }

   /**
    * Synchronously read an image as BASE64 input.
    *
    * @param {String} filename is the full path and image name.
    *
    * @returns a BASE64 string.
    */
   function readImageAsBase64(filename) {
      log.info("Reading image file: '" + filename + "'");
      let base64 = readFile(filename, 'base64');
      log.debug(' >> Type: ' + typeof base64);
      log.debug(' >> Successfully read image (' + base64.length + ' bytes)');
      return base64;
   }

   /**
    * Synchronously write data to a file, creating the file if it does not
    * yet exist. If file exists, it will be truncated before writting any
    * new data.
    *
    * Where 'mode' can also be:
    *
    *    { encoding: 'base64' }  where the stream is base64 encoded.
    *    { encoding: 'hex'    }  where each byte are two hexadecimal characters.
    *
    * @see MODE_0666 constant definition
    * @see MODE_0755 constant definition
    *
    * @see Buffer https://nodejs.org/api/buffer.html#buffer
    * @see TypedArray https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
    * @see DataView https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
    *
    * @param {String} filename is the filename to write data to.
    * @param {String} data <string> | <Buffer> | <TypedArray> | <DataView>
    * @param {Number} mode is an optional filemode (defaults to 0666).
    */
   function writeFile(filename, data, mode = MODE_0666) {
      log.info("Writting to file '" + filename + "'");
      fs.writeFileSync(filename, data, { mode: mode });
      log.debug(' >> Completed writting to file');
   }

   /**
    * Synchronously append data to a file, creating the file if it does not
    * yet exist.
    *
    * @see MODE_0666 constant definition
    * @see MODE_0755 constant definition
    *
    * @see Buffer https://nodejs.org/api/buffer.html#buffer
    * @see TypedArray https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
    * @see DataView https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
    *
    * @param {String} filename is the filename to append data to.
    * @param {String} data <string> | <Buffer> | <TypedArray> | <DataView>
    * @param {Number} mode is an optional filemode (defaults to 0666)
    */
   function appendFile(filename, data, mode = MODE_0666) {
      log.info("Appending to file '" + filename + "'");
      fs.appendFileSync(filename, data, { mode: mode });
      log.debug(' >> Completed appending to file');
   }

   /**
    * Will save base64 data to the specified file, decoding it along
    * the way into its binary form.
    *
    * TODO: Should we strip the header here?
    */
   function saveBase64ToFile(path, data) {
      log.info('Writing base64 image');
      log.debug(" >> Path: '" + path + "'");
      fs.writeFileSync(path, data, { encoding: 'base64' });
      log.debug('Wrote base64 image');
   }

   /**
    * Will save the data to the specified file.
    *
    * If the 'json' argument is an Object, it will be converted to JSON
    * prior to being saved.
    *
    * @param {String} path of the file to save to.
    * @param {JSON|Object} json data (as a String or Object).
    */
   function saveJsonToFile(path, json) {
      log.info('Writing to file');
      log.debug(" >> Path: '" + path + "'");
      if (JxValidate.isObject(json)) {
         log.debug(' >> Converting to JSON string');
         json = JSON.stringify(json, null, 3);
      }
      fs.writeFileSync(path, json, 'utf-8');
      log.debug('Wrote file image');
   }

   /**
    * Will save the data to the specified file.
    */
   function saveToFile(path, data) {
      log.info('Writing to file');
      log.debug(" >> Path: '" + path + "'");
      fs.writeFileSync(path, data);
      log.debug('Wrote file image');
   }

   /**
    * Copy a file asynchronously
    *
    * Will copy the 'source' path to the 'destination' path. If the 'overwite'
    * flag is set to 'false', and file exists, an exception will be thrown.
    *
    * In other words, if you would like to overwite the file when it exists,
    * you must explicityly set the 'overwrite' parameter to 'true'.
    *
    * @param {String} source file and path.
    * @param {String} destination file and path.
    * @param {Boolean} overwrite the file if it already exists.
    */
   function copyFile(source, destination, overwrite = false) {
      log.info('Copying file');
      log.debug(" >> Source      : '" + source + "'");
      log.debug(" >> Destination : '" + destination + "'");
      log.debug(" >> Overwrite   : '" + overwrite + "'");

      if (!JxValidate.isString(source)) throw JxValidate.invalidType(source, 'source', 'String');
      if (!JxValidate.isString(destination)) throw JxValidate.invalidType(destination, 'destination', 'String');
      if (!JxValidate.isBoolean(overwrite)) throw JxValidate.invalidType(overwrite, 'overwrite', 'Boolean');

      if (!JxIO.fileExists(source)) throw "File '" + source + "' does not exist!";

      if (overwrite) fs.copyFileSync(source, destination);
      else fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);

      log.debug(' >> File was copied!');
   }

   /**
    * Calculate an algorithmic hash for the specified file.
    *
    * Some common algorithms supported are:
    *
    *   1. md4
    *   2. md5    -> 128-bits, 16-bytes
    *   3. sha1   -> 160-bits, 20-bytes (default)
    *   4. sha2   -> (maps to sha256)
    *   5. sha224
    *   6. sha256 -> 256-bits, 32-bytes
    *   7. sha384
    *   8. sha512
    *
    * Where:
    *
    *   md5 has 32-digits in hex    -> d131dd02c5e6eec4
    *           24-digits in b64    -> ZDEzMWRkMDJjNWU2ZWVjNA==
    *
    *   sha1 has 40-digits in hex   -> 2fd4e1c67a2d28fced849ee1bb76e7391b93eb12
    *            56-digits in b64   -> MmZkNGUxYzY3YTJkMjhmY2VkODQ5ZWUxYmI3NmU3MzkxYjkzZWIxMg==
    *
    *   sha256 has 64-digits in hex -> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    *              88-digits in b64 -> ZTNiMGM0NDI5OGZjMWMxNDlhZmJmNGM4OTk2ZmI5MjQyN2FlNDFlNDY0OWI5MzRjYTQ5NTk5MWI3ODUyYjg1NQ==
    *
    * Using one of the following digest 'output' method:
    *
    *   1. hex (default)
    *   2. base64
    *
    * To see a full list of possible hash algorithms, see:
    *
    *   crypto.getHashes();
    *
    * If speed is essential, 'sha1' and 'base64' are the two fastest
    * options in most cases.
    *
    * @param {String} filename is the full path and filename.
    * @param {String} algo is the algorithm of the hash to use
    *                 (default to 'sha1').
    * @param {String} output is the digest output method (default to 'hex')
    */
   function getFileHash(filename, algo = 'sha1', output = 'hex') {
      log.info('Computing hash of a file');

      log.debug(" >> Filename  : '" + filename + "'");

      const fileBuffer = fs.readFileSync(filename);

      return getBufferHash(fileBuffer, algo, output);
   }

   /**
    * Calculate an algorithmic hash for the specified buffer.
    *
    * Some common algorithms supported are:
    *
    *   1. md4
    *   2. md5    -> 128-bits, 16-bytes
    *   3. sha1   -> 160-bits, 20-bytes (default)
    *   4. sha2   -> (maps to sha256)
    *   5. sha224
    *   6. sha256 -> 256-bits, 32-bytes
    *   7. sha384
    *   8. sha512
    *
    * Where:
    *
    *   md5 has 32-digits in hex    -> d131dd02c5e6eec4
    *           24-digits in b64    -> ZDEzMWRkMDJjNWU2ZWVjNA==
    *
    *   sha1 has 40-digits in hex   -> 2fd4e1c67a2d28fced849ee1bb76e7391b93eb12
    *            56-digits in b64   -> MmZkNGUxYzY3YTJkMjhmY2VkODQ5ZWUxYmI3NmU3MzkxYjkzZWIxMg==
    *
    *   sha256 has 64-digits in hex -> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    *              88-digits in b64 -> ZTNiMGM0NDI5OGZjMWMxNDlhZmJmNGM4OTk2ZmI5MjQyN2FlNDFlNDY0OWI5MzRjYTQ5NTk5MWI3ODUyYjg1NQ==
    *
    * Using one of the following digest 'output' method:
    *
    *   1. hex (default)
    *   2. base64
    *
    * To see a full list of possible hash algorithms, see:
    *
    *   crypto.getHashes();
    *
    * If speed is essential, 'sha1' and 'base64' are the two fastest
    * options in most cases.
    *
    * @param {Buffer} buffer is the data buffer.
    * @param {String} algo is the algorithm of the hash to use
    *                 (defaults to 'sha1').
    * @param {String} digest is the digest output method (default to 'hex')
    */
   function getBufferHash(buffer, algo = 'sha1', digest = 'hex') {
      log.info('Computing hash of a buffer');

      algo = algo || 'sha1';
      algo = algo.toLowerCase();

      digest = digest || 'hex';
      digest = digest.toLowerCase();

      if (algo == 'sha2') algo = 'sha256';

      log.debug(" >> Algorithm : '" + algo + "'");
      log.debug(" >> Output    : '" + digest + "'");

      const hash = crypto.createHash(algo);

      hash.update(buffer);

      const result = hash.digest(digest);

      log.debug(" >> Output: '" + result + "'");

      return result;
   }

   /**
    * Produce a hash digest of a string.
    *
    * @see getFileHash for details.
    *
    * @param {*} string
    * @param {*} algo
    * @param {*} output
    *
    * @returns a hash digest (string).
    */
   function getStringHash(string, algo, output) {
      log.info('Computing hash of a string');

      algo = algo || 'sha1';
      algo = algo.toLowerCase();

      output = output || 'hex';
      output = output.toLowerCase();

      if (algo == 'sha2') algo = 'sha256';

      log.debug(" >> String    : '" + string + "'");
      log.debug(" >> Algorithm : '" + algo + "'");
      log.debug(" >> Output    : '" + output + "'");

      const hash = crypto.createHash(algo);

      hash.update(string);

      const out = hash.digest(output);

      log.debug(" >> Output: '" + out + "'");

      return out;
   }

   /**
    * Given a URL header, it will extract the mime-type from the header.
    *
    * Example:
    *
    *    data:[mime-type];[protocol],[data|reference]
    *
    * Where 'mime-type' can be:
    *
    *    application/vnd.ms-powerpoint
    *    audio/mp3
    *    video/mp2t
    *    image/jpeg
    *
    * @returns a mime type (ie: 'image/gif' or 'image/png').
    */
   function getUrlMimeType(url) {
      let parts = null;
      log.info('Getting URL mime-type');
      log.debug(" >> URL       : '" + url + "'");
      let mimeType = url.match(/^data:[a-zA-Z]+\/[a-zA-Z0-9\.+-]+;/g);
      if (mimeType) parts = mimeType[0].split(':');
      if (parts && parts.length == 2) mimeType = parts[1].slice(0, -1);
      log.debug(" >> Mime-type : '" + mimeType + "'");
      return mimeType;
   }

   /**
    * Given a URL header, it will extract the mime sub-type.
    *
    * Example:
    *
    *    data:[mime-type];[protocol],[data|reference]
    *
    * Where 'mime-type' can be:
    *
    *    application/vnd.ms-powerpoint
    *    audio/mp3
    *    video/mp2t
    *    image/jpeg
    *    text/csv
    *
    * Where 'sub-type' can be:
    *
    *    audio
    *    video
    *    image
    *    application
    *    text
    *
    *    Or any other self-defined sub-type.
    *
    * @returns a mime sub-type.
    */
   function getUrlMimeSubType(url) {
      let subType = null;
      log.info('Getting URL mime sub-type');
      log.debug(" >> URL       : '" + url + "'");
      let mimeType = getUrlMimeType(url);
      if (mimeType) parts = mimeType.split('/');
      if (parts && parts.length == 2) subType = parts[0];
      log.debug(" >> Sub type : '" + subType + "'");
      return subType;
   }

   /**
    * Given a URL header, it will extract the file-type from
    * the URL's mime type.
    *
    * Example:
    *
    *    data:[mime-type];[protocol],[data|reference]
    *
    * Where 'mime-type' can be:
    *
    *    application/vnd.ms-powerpoint
    *    audio/mp3
    *    video/mp2t
    *    image/jpeg
    *
    * Where 'file-type' can be:
    *
    *    vnd.ms-powerpoint
    *    mp3
    *    mp2t
    *    jpeg
    *
    * Not to get confused between a file-type and a file extension.
    *
    * @returns a file type (ie: 'jpg', 'png', 'gif').
    */
   function getUrlMimeFileType(url) {
      let fileType = null;
      log.info('Getting URL mime file-type');
      log.debug(" >> URL       : '" + url + "'");
      let mimeType = getUrlMimeType(url);
      if (mimeType) parts = mimeType.split('/');
      if (parts && parts.length == 2) fileType = parts[1];
      log.debug(" >> File type : '" + fileType + "'");
      return fileType;
   }

   /**
    * Given a URL header, it will extract the protocol portion.
    *
    * Example:
    *
    *    data:[mime-type];[protocol],[data|reference]
    *
    * Where 'protocol' can be one of:
    *
    *    base64
    *    sha1
    *    uuid
    *
    * @returns a named protocol (ie: 'base64', 'sha1', 'uuid').
    */
   function getUrlProtocol(url) {
      let protocol = null;
      log.info('Getting URL protocol');
      log.debug(" >> URL       : '" + url + "'");
      let raw = url.match(/^data:[a-zA-Z]+\/[a-zA-Z0-9\.+-]+;[a-zA-Z0-9_-]+,/g);
      if (raw) parts = raw[0].split(';');
      if (parts && parts.length == 2) raw = parts[1];
      if (raw) parts = raw.split(',');
      if (parts && parts.length == 2) protocol = parts[0];
      log.debug(" >> Protocol : '" + protocol + "'");
      return protocol;
   }

   /**
    * Given a URL header, this will extract the data/reference portion.
    *
    * Example:
    *
    *    data:[mime-type];[protocol],[data|reference]
    *
    * Where 'data/referece' can be:
    *
    *    For the 'base64' protocol, it is BASE64 data.
    *    For the 'sha1' protocol, it is a valid SHA1 hexadicimal digest reference.
    *    For the 'uuid' protocol, it is a valid UUIDv4 number string reference.
    *
    *    For any other protocol, the data/reference will be specific to it.
    *
    * @returns the data or reference portion.
    */
   function getUrlData(url) {
      let data = null;
      log.info('Getting URL data');
      log.debug(" >> URL       : '" + url + "'");
      let header = url.match(/^data:[a-zA-Z]+\/[a-zA-Z0-9\.+-]+;[a-zA-Z0-9_-]+,/g);
      if (header) {
         log.debug(" >> Header : '" + header + "' (length: " + header[0].length + ')');
         data = url.substring(header[0].length);
      }
      log.debug(" >> Data : '" + data + "'");
      return data;
   }

   //-------------------------------------------------------------------
   // Exported functions and constants
   //-------------------------------------------------------------------

   return {
      DIR_RECURSE_MAX_DEPTH: DIR_RECURSE_MAX_DEPTH,
      DIR_RECURSE_DEFAULT_DEPTH: DIR_RECURSE_DEFAULT_DEPTH,

      getUrlMimeType: getUrlMimeType,
      getUrlMimeSubType: getUrlMimeSubType,
      getUrlMimeFileType: getUrlMimeFileType,
      getUrlProtocol: getUrlProtocol,
      getUrlData: getUrlData,

      join: join,
      currentDir: currentDir,
      changeDir: changeDir,

      fileExists: fileExists,
      deleteFile: deleteFile,
      renameFile: renameFile,

      dirExists: dirExists,
      deleteDir: deleteDir,
      renameDir: renameDir,
      createDir: createDir,

      readFile: readFile,
      readFileToArray: readFileToArray,
      readFileAsJson: readFileAsJson,

      readImageAsBase64: readImageAsBase64,

      writeFile: writeFile,
      appendFile: appendFile,

      saveToFile: saveToFile,
      saveBase64ToFile: saveBase64ToFile,
      saveJsonToFile: saveJsonToFile,

      copyFile: copyFile,

      listFiles: listFiles,
      listDirectories: listDirectories,

      formatBytes: formatBytes,

      getFileStats: getFileStats,
      getFileSize: getFileSize,
      getFilePerms: getFilePerms,

      getFileExt: getFileExt,

      getHexPath: getHexPath,

      getFileHash: getFileHash,
      getBufferHash: getBufferHash,
      getStringHash: getStringHash,

      getName: getName,
      getVersion: getVersion,
      getHashcode: getHashcode,
      getObject: getObject,
      toString: toString,
   };
})(); // Our IIFE function is invoked here

module.exports = JxIO;

console.log(JxIO.toString());

const MIME_TYPES = [
   'data:image/jpeg;base64,0000000000000000000000000000',
   'data:application/x-abiword;uuid,111111111111111111111111111111',
   'data:application/vnd.ms-powerpoint;sha1,22222222222222222222222222222',
   'data:audio/mp3;md5,3333333333333333333333333333333',
   'data:video/x-video;sha2,44444444444444444444444444',
   'data:text/csv;xyz,55555555555555555555555555',
   'data:image/svg+xml;jeach,66666666666666666666666666666666666',
   'data:image/gif;base32,7777777777777777777777777777',
];

// MIME_TYPES.forEach((val, idx) => {
//    console.log('--------------------------------------------------------------------------------');
//    // var mimeType = JxIO.getUrlMimeType(val);
//    var fileType = JxIO.getUrlMimeSubType(val);
//    // var fileType = JxIO.getUrlMimeFileType(val);
//    // var protocol = JxIO.getUrlProtocol(val);
//    // var data = JxIO.getUrlData(val);
// });

// JxIO.getFileStats('JxExtract.js');
// JxIO.getFileSize('JxExtract.js');
