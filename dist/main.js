try{require("source-map-support").install();}
catch(err) {}
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * cyborg <https://github.com/jonschlinkert/cyborg>
	 *
	 * Copyright (c) 2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _baseMethods = __webpack_require__(2);
	
	var _baseMethods2 = _interopRequireDefault(_baseMethods);
	
	var _basePlugins = __webpack_require__(3);
	
	var _basePlugins2 = _interopRequireDefault(_basePlugins);
	
	var _baseOptions = __webpack_require__(4);
	
	var _baseOptions2 = _interopRequireDefault(_baseOptions);
	
	var Base = _baseMethods2['default'].namespace('cache');
	
	function Cyborg(options) {
	  if (!(this instanceof Cyborg)) {
	    return new Cyborg(options);
	  }
	  Base.call(this);
	  this.options = options || {};
	  this.use(_baseOptions2['default']);
	  this.use(_basePlugins2['default']);
	}
	
	Base.extend(Cyborg);
	
	exports['default'] = Cyborg;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("base-methods");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("base-plugins");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("base-options");

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map