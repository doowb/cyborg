'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils; // eslint-disable-line

/**
 * Lazily required module dependencies
 */

require('base-options', 'option');
require('expand-files', 'expand');
require('extend-shallow', 'extend');
require('base-store', 'store');
require('write', 'writeFile');
require('read-data');
require('has-values');
require('async');
require('use');

require('ansi-red', 'red');
require('load-pkg', 'pkg');
require('normalize-pkg', 'normalize');
require('parse-github-url', 'parse');
require('ansi-gray', 'gray');
require('ansi-green', 'green');
require('mixin-deep', 'merge');
require('object.pick', 'pick');
require('object.reduce', 'reduce');
require('object.omit', 'omit');


/**
 * Restore `require`
 */

require = fn; // eslint-disable-line

utils.isEmpty = function(val) {
  return !utils.hasValues(val, true);
};

utils.escapeKeys = function(keys) {
  keys = utils.arrayify(keys);
  var len = keys.length, i = 0;
  var arr = new Array(len);
  while (len--) {
    arr[i] = keys[i++].split('.').join('\\.');
  }
  return arr;
};

utils.arrayify = function(val) {
  if (utils.isEmpty(val)) {
    return [];
  }
  return Array.isArray(val) ? val : [val];
}

/**
 * Expose `utils` modules
 */

module.exports = utils;
