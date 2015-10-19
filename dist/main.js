(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.updateContributors = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * cyborg <https://github.com/jonschlinkert/cyborg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _baseMethods = require('base-methods');

var _baseMethods2 = _interopRequireDefault(_baseMethods);

var _basePlugins = require('base-plugins');

var _basePlugins2 = _interopRequireDefault(_basePlugins);

var _baseOptions = require('base-options');

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

},{"base-methods":2,"base-options":44,"base-plugins":53}],2:[function(require,module,exports){
'use strict';

function namespace(name) {
  var utils = require('./utils');

  /**
   * Create an instance of `Base` with `options`.
   *
   * ```js
   * var app = new Base();
   * app.set('foo', 'bar');
   * console.log(app.get('foo'));
   * //=> 'bar'
   * ```
   *
   * @param {Object} `options`
   * @api public
   */

  function Base(options) {
    if (!(this instanceof Base)) {
      return new Base(options);
    }

    this.define('_callbacks', this._callbacks);
    if (name) this[name] = {};
    if (typeof options === 'object') {
      this.visit('set', options);
    }
  }

  Base.prototype = utils.Emitter({
    constructor: Base,

    /**
     * Define a plugin function to be called immediately upon init.
     * Plugins are chainable and the only parameter exposed to the
     * plugin is the application instance.
     *
     * ```js
     * var app = new Base()
     *   .use(foo)
     *   .use(bar)
     *   .use(baz)
     * ```
     * @name .use
     * @param {Function} `fn` plugin function to call
     * @return {Object} Returns the item instance for chaining.
     * @api public
     */

    use: function(fn) {
      fn.call(this, this);
      return this;
    },

    /**
     * Assign `value` to `key`. Also emits `set` with
     * the key and value.
     *
     * ```js
     * app.on('set', function(key, val) {
     *   // do something when `set` is emitted
     * });
     *
     * app.set(key, value);
     *
     * // also takes an object or array
     * app.set({name: 'Halle'});
     * app.set([{foo: 'bar'}, {baz: 'quux'}]);
     * console.log(app);
     * //=> {name: 'Halle', foo: 'bar', baz: 'quux'}
     * ```
     *
     * @name .set
     * @param {String} `key`
     * @param {*} `value`
     * @return {Object} Returns the instance for chaining.
     * @api public
     */

    set: function(key, val) {
      if (typeof key === 'object') {
        this.visit('set', key);
      } else {
        if (name) {
          utils.set(this[name], key, val);
        } else {
          utils.set(this, key, val);
        }
        this.emit('set', key, val);
      }
      return this;
    },

    /**
     * Return the stored value of `key`. Dot notation may be used
     * to get [nested property values][get-value].
     *
     * ```js
     * app.set('foo', 'bar');
     * app.get('foo');
     * // => "bar"
     * ```
     *
     * @name .get
     * @param {*} `key`
     * @param {Boolean} `escape`
     * @return {*}
     * @api public
     */

    get: function(key) {
      if (name) {
        return utils.get(this[name], key);
      }
      return utils.get(this, key);
    },

    /**
     * Delete `key` from the instance. Also emits `del` with
     * the key of the deleted item.
     *
     * ```js
     * app.del(); // delete all
     * // or
     * app.del('foo');
     * // or
     * app.del(['foo', 'bar']);
     * ```
     * @name .del
     * @param {String} `key`
     * @return {Object} Returns the instance for chaining.
     * @api public
     */

    del: function(key) {
      if (Array.isArray(key)) {
        this.visit('del', key);
      } else {
        if (name) {
          utils.del(this[name], key);
        } else {
          utils.del(this, key);
        }
        this.emit('del', key);
      }
      return this;
    },

    /**
     * Convenience method for assigning a `name` on the instance
     * for doing lookups in plugins.
     */

    is: function(name) {
      this.define('is' + name, true);
      return this;
    },

    /**
     * Define a non-enumerable property on the instance.
     *
     * ```js
     * // arbitrary `render` function using lodash `template`
     * define('render', function(str, locals) {
     *   return _.template(str)(locals);
     * });
     * ```
     * @name .define
     * @param {String} `key`
     * @param {any} `value`
     * @return {Object} Returns the instance for chaining.
     * @api public
     */

    define: function(key, value) {
      utils.define(this, key, value);
      return this;
    },

    /**
     * Visit `method` over the items in the given object, or map
     * visit over the objects in an array.
     *
     * @name .visit
     * @param {String} `method`
     * @param {Object|Array} `val`
     * @return {Object} Returns the instance for chaining.
     * @api public
     */

    visit: function(method, val) {
      utils.visit(this, method, val);
      return this;
    },

    /**
     * Mix property `key` onto the Base prototype. If base-methods
     * is inherited using `Base.extend` this method will be overridden
     * by a new `mixin` method that will only add properties to the
     * prototype of the inheriting application.
     *
     * @name .mixin
     * @param {String} `key`
     * @param {Object|Array} `val`
     * @return {Object} Returns the instance for chaining.
     * @api public
     */

    mixin: function(key, val) {
      Base.prototype[key] = val;
      return this;
    }
  });

  /**
   * Static method for inheriting both the prototype and
   * static methods of the `Base` class. See [class-utils][]
   * for more details.
   *
   * @api public
   */

  Base.extend = utils.cu.extend(Base);

  /**
   * Similar to `util.inherit`, but copies all static properties,
   * prototype properties, and descriptors from `Provider` to `Receiver`.
   * [class-utils][] for more details.
   *
   * @api public
   */

  Base.inherit = utils.cu.inherit;
  return Base;
}

/**
 * Expose `base-methods`
 */

module.exports = namespace();

/**
 * Allow users to define a namespace
 */

module.exports.namespace = namespace;

},{"./utils":43}],3:[function(require,module,exports){
'use strict';

var util = require('util');
var utils = require('./utils');

/**
 * Expose class utils
 */

var cu = module.exports;

/**
 * Expose class utils: `cu`
 */

cu.isObject = function isObject(val) {
  return utils.isObj(val) || typeof val === 'function';
};

/**
 * Returns true if an array has any of the given elements, or an
 * object has any of the give keys.
 *
 * ```js
 * cu.has(['a', 'b', 'c'], 'c');
 * //=> true
 *
 * cu.has(['a', 'b', 'c'], ['c', 'z']);
 * //=> true
 *
 * cu.has({a: 'b', c: 'd'}, ['c', 'z']);
 * //=> true
 * ```
 * @param {Object} `obj`
 * @param {String|Array} `val`
 * @return {Boolean}
 * @api public
 */

cu.has = function has(obj, val) {
  val = cu.arrayify(val);
  var len = val.length;

  if (cu.isObject(obj)) {
    for (var key in obj) {
      if (val.indexOf(key) > -1) {
        return true;
      }
    }

    var keys = cu.nativeKeys(obj);
    return cu.has(keys, val);
  }

  if (Array.isArray(obj)) {
    var arr = obj;
    while (len--) {
      if (arr.indexOf(val[len]) > -1) {
        return true;
      }
    }
    return false;
  }

  throw new TypeError('expected an array or object.');
};

/**
 * Returns true if an array or object has all of the given values.
 *
 * ```js
 * cu.hasAll(['a', 'b', 'c'], 'c');
 * //=> true
 *
 * cu.hasAll(['a', 'b', 'c'], ['c', 'z']);
 * //=> false
 *
 * cu.hasAll({a: 'b', c: 'd'}, ['c', 'z']);
 * //=> false
 * ```
 * @param {Object|Array} `val`
 * @param {String|Array} `values`
 * @return {Boolean}
 * @api public
 */

cu.hasAll = function hasAll(val, values) {
  values = cu.arrayify(values);
  var len = values.length;
  while (len--) {
    if (!cu.has(val, values[len])) {
      return false;
    }
  }
  return true;
};

/**
 * Cast the given value to an array.
 *
 * ```js
 * cu.arrayify('foo');
 * //=> ['foo']
 *
 * cu.arrayify(['foo']);
 * //=> ['foo']
 * ```
 *
 * @param {String|Array} `val`
 * @return {Array}
 * @api public
 */

cu.arrayify = function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Noop
 */

cu.noop = function noop() {
  return;
};

/**
 * Returns the first argument passed to the function.
 */

cu.identity = function identity(val) {
  return val;
};

/**
 * Returns true if a value has a `contructor`
 *
 * ```js
 * cu.hasConstructor({});
 * //=> true
 *
 * cu.hasConstructor(Object.create(null));
 * //=> false
 * ```
 * @param  {Object} `value`
 * @return {Boolean}
 * @api public
 */

cu.hasConstructor = function hasConstructor(val) {
  return cu.isObject(val) && typeof val.constructor !== 'undefined';
};

/**
 * Get the native `ownPropertyNames` from the constructor of the
 * given `object`. An empty array is returned if the object does
 * not have a constructor.
 *
 * ```js
 * cu.nativeKeys({a: 'b', b: 'c', c: 'd'})
 * //=> ['a', 'b', 'c']
 *
 * cu.nativeKeys(function(){})
 * //=> ['length', 'caller']
 * ```
 *
 * @param  {Object} `obj` Object that has a `constructor`.
 * @return {Array} Array of keys.
 * @api public
 */

cu.nativeKeys = function nativeKeys(val) {
  if (!cu.hasConstructor(val)) return [];
  return Object.getOwnPropertyNames(val);
};

/**
 * Returns property descriptor `key` if it's an "own" property
 * of the given object.
 *
 * ```js
 * function App() {}
 * Object.defineProperty(App.prototype, 'count', {
 *   get: function() {
 *     return Object.keys(this).length;
 *   }
 * });
 * cu.getDescriptor(App.prototype, 'count');
 * // returns:
 * // {
 * //   get: [Function],
 * //   set: undefined,
 * //   enumerable: false,
 * //   configurable: false
 * // }
 * ```
 *
 * @param {Object} `obj`
 * @param {String} `key`
 * @return {Object} Returns descriptor `key`
 * @api public
 */

cu.getDescriptor = function getDescriptor(obj, key) {
  if (!cu.isObject(obj)) {
    throw new TypeError('expected an object.');
  }
  if (typeof key !== 'string') {
    throw new TypeError('expected key to be a string.');
  }
  return Object.getOwnPropertyDescriptor(obj, key);
};

/**
 * Copy a descriptor from one object to another.
 *
 * ```js
 * function App() {}
 * Object.defineProperty(App.prototype, 'count', {
 *   get: function() {
 *     return Object.keys(this).length;
 *   }
 * });
 * var obj = {};
 * cu.copyDescriptor(obj, App.prototype, 'count');
 * ```
 * @param {Object} `receiver`
 * @param {Object} `provider`
 * @param {String} `name`
 * @return {Object}
 * @api public
 */

cu.copyDescriptor = function copyDescriptor(receiver, provider, name) {
  if (!cu.isObject(receiver)) {
    throw new TypeError('expected receiving object to be an object.');
  }
  if (!cu.isObject(provider)) {
    throw new TypeError('expected providing object to be an object.');
  }
  if (typeof name !== 'string') {
    throw new TypeError('expected name to be a string.');
  }
  var val = cu.getDescriptor(provider, name);
  if (val) utils.define(receiver, name, val);
};

/**
 * Copy static properties, prototype properties, and descriptors
 * from one object to another.
 *
 * @param {Object} `receiver`
 * @param {Object} `provider`
 * @param {String|Array} `omit` One or more properties to omit
 * @return {Object}
 * @api public
 */

cu.copy = function copy(receiver, provider, omit) {
  if (!cu.isObject(receiver)) {
    throw new TypeError('expected receiving object to be an object.');
  }
  if (!cu.isObject(provider)) {
    throw new TypeError('expected providing object to be an object.');
  }
  var props = Object.getOwnPropertyNames(provider);
  var keys = Object.keys(provider);
  var len = props.length,
    key;
  omit = cu.arrayify(omit);

  while (len--) {
    key = props[len];

    if (cu.has(keys, key)) {
      utils.define(receiver, key, provider[key]);
    } else if (!(key in receiver) && !cu.has(omit, key)) {
      cu.copyDescriptor(receiver, provider, key);
    }
  }
};

/**
 * Inherit the static properties, prototype properties, and descriptors
 * from of an object.
 *
 * @param {Object} `receiver`
 * @param {Object} `provider`
 * @param {String|Array} `omit` One or more properties to omit
 * @return {Object}
 * @api public
 */

cu.inherit = function inherit(receiver, provider, omit) {
  if (!cu.isObject(receiver)) {
    throw new TypeError('expected receiving object to be an object.');
  }
  if (!cu.isObject(provider)) {
    throw new TypeError('expected providing object to be an object.');
  }

  var keys = [];
  for (var key in provider) {
    keys.push(key);
    receiver[key] = provider[key];
  }

  keys = keys.concat(cu.arrayify(omit));

  var a = provider.prototype || provider;
  var b = receiver.prototype || receiver;
  cu.copy(b, a, keys);
};

/**
 * Returns a function for extending the static properties,
 * prototype properties, and descriptors from the `Parent`
 * constructor onto `Child` constructors.
 *
 * ```js
 * var extend = cu.extend(Parent);
 * Parent.extend(Child);
 *
 * // optional methods
 * Parent.extend(Child, {
 *   foo: function() {},
 *   bar: function() {}
 * });
 * ```
 * @param {Function} `Parent` Parent ctor
 *   @param {Function} `Child` Child ctor
 *   @param {Object} `proto` Optionally pass additional prototype properties to inherit.
 *   @return {Object}
 * @api public
 */

cu.extend = function extend(Parent) {
  if (typeof Parent !== 'function') {
    throw new TypeError('expected Parent to be a function.');
  }

  return function(Ctor, proto) {
    if (typeof Ctor !== 'function') {
      throw new TypeError('expected Ctor to be a function.');
    }

    util.inherits(Ctor, Parent);

    for (var key in Parent) {
      Ctor[key] = Parent[key];
    }

    if (typeof proto === 'object') {
      var obj = Object.create(proto);

      for (var k in obj) {
        Ctor.prototype[k] = obj[k];
      }
    }

    Ctor.prototype.mixin = function(key, value) {
      Ctor.prototype[key] = value;
    };

    Ctor.extend = cu.extend(Ctor);
  };
};

},{"./utils":6,"util":undefined}],4:[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isArray = require('isarray');

module.exports = function isObject(o) {
  return o != null && typeof o === 'object' && !isArray(o);
};

},{"isarray":5}],5:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],6:[function(require,module,exports){
'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign require to trick browserify into
 * recognizing lazy requires
 */

var fn = require;
require = utils;
require('define-property', 'define');
require('isobject', 'isObj');
require = fn;

/**
 * Expose `utils`
 */

module.exports = utils;

},{"define-property":16,"isobject":4,"lazy-cache":34}],7:[function(require,module,exports){
/*!
 * collection-visit <https://github.com/jonschlinkert/collection-visit>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

function collectionVisit(collection, method, val) {
  var result;

  if (typeof val === 'string' && (method in collection)) {
    result = collection[method](val);
  } else if (Array.isArray(val)) {
    result = utils.mapVisit(collection, method, val);
  } else {
    result = utils.visit(collection, method, val);
  }

  if (typeof result !== 'undefined') {
    return result;
  }
  return collection;
}

/**
 * Expose `collectionVisit`
 */

module.exports = collectionVisit;

},{"./utils":14}],8:[function(require,module,exports){
'use strict';

var utils = require('./utils');

/**
 * Map `visit` over an array of objects.
 *
 * @param  {Object} `collection` The context in which to invoke `method`
 * @param  {String} `method` Name of the method to call on `collection`
 * @param  {Object} `arr` Array of objects.
 */

module.exports = function mapVisit(collection, method, arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected an array');
  }

  arr.forEach(function (val) {
    if (typeof val === 'string') {
      collection[method](val);
    } else {
      utils.visit(collection, method, val);
    }
  });
};

},{"./utils":11}],9:[function(require,module,exports){
/*!
 * object-visit <https://github.com/jonschlinkert/object-visit>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');

module.exports = function visit(thisArg, method, target) {
  if (!isObject(thisArg) && typeof thisArg !== 'function') {
    throw new Error('object-visit expects `thisArg` to be an object.');
  }

  if (typeof method !== 'string') {
    throw new Error('object-visit expects `method` to be a string');
  }

  if (!isObject(target) && typeof thisArg !== 'function') {
    throw new Error('object-visit expects `target` to be an object.');
  }

  for (var key in target) {
    if (target.hasOwnProperty(key)) {
      thisArg[method](key, target[key]);
    }
  }
  return thisArg;
};

},{"isobject":10}],10:[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object'
    && !Array.isArray(val);
};

},{}],11:[function(require,module,exports){
'use strict';

var utils = require('lazy-cache')(require);
require = utils; // fool browserify
require('object-visit', 'visit');

/**
 * Expose utils
 */

module.exports = utils;

},{"lazy-cache":34,"object-visit":9}],12:[function(require,module,exports){
/*!
 * object-visit <https://github.com/jonschlinkert/object-visit>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');

module.exports = function visit(thisArg, method, target) {
  if (!isObject(thisArg) && typeof thisArg !== 'function') {
    throw new Error('object-visit expects `thisArg` to be an object.');
  }

  if (typeof method !== 'string') {
    throw new Error('object-visit expects `method` name to be a string');
  }

  target = target || {};
  for (var key in target) {
    thisArg[method](key, target[key]);
  }
  return thisArg;
};

},{"isobject":13}],13:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],14:[function(require,module,exports){
'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);
require = utils; // trick browserify
require('map-visit');
require('object-visit', 'visit');

/**
 * Expose `utils`
 */

module.exports = utils;

},{"lazy-cache":34,"map-visit":8,"object-visit":12}],15:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],16:[function(require,module,exports){
/*!
 * define-property <https://github.com/jonschlinkert/define-property>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isDescriptor = require('is-descriptor');

module.exports = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

},{"is-descriptor":17}],17:[function(require,module,exports){
/*!
 * is-descriptor <https://github.com/jonschlinkert/is-descriptor>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function isDescriptor(obj) {
  if (utils.typeOf(obj) !== 'object') return false;
  if ('value' in obj) return utils.isData(obj);
  return utils.isAccessor(obj);
};

},{"./utils":30}],18:[function(require,module,exports){
/*!
 * is-accessor-descriptor <https://github.com/jonschlinkert/is-accessor-descriptor>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

// accessor descriptor properties
var accessor = {
  get: 'function',
  set: 'function',
  configurable: 'boolean',
  enumerable: 'boolean'
};

function isAccessorDescriptor(obj) {
  if (utils.typeOf(obj) !== 'object') {
    return false;
  }

  var accessorKeys = Object.keys(accessor);
  var keys = getKeys(obj);

  if (obj.hasOwnProperty('set')) {
    if (utils.typeOf(obj.set) !== 'function') {
      return false;
    }
  }

  if (obj.hasOwnProperty('get')) {
    if (utils.typeOf(obj.get) !== 'function') {
      return false;
    }
  }

  if (utils.diff(keys, accessorKeys).length !== 0) {
    return false;
  }

  for (var key in obj) {
    if (key === 'value') continue;
    if (utils.typeOf(obj[key]) !== accessor[key]) {
      return false;
    }
  }
  return true;
}

/**
 * Get object keys. `Object.keys()` only gets
 * enumerable properties.
 */

function getKeys(obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

/**
 * Expose `isAccessorDescriptor`
 */

module.exports = isAccessorDescriptor;

},{"./utils":22}],19:[function(require,module,exports){
/*!
 * arr-diff <https://github.com/jonschlinkert/arr-diff>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var flatten = require('arr-flatten');
var slice = require('array-slice');

/**
 * Return the difference between the first array and
 * additional arrays.
 *
 * ```js
 * var diff = require('{%= name %}');
 *
 * var a = ['a', 'b', 'c', 'd'];
 * var b = ['b', 'c'];
 *
 * console.log(diff(a, b))
 * //=> ['a', 'd']
 * ```
 *
 * @param  {Array} `a`
 * @param  {Array} `b`
 * @return {Array}
 * @api public
 */

function diff(arr, arrays) {
  var argsLen = arguments.length;
  var len = arr.length, i = -1;
  var res = [], arrays;

  if (argsLen === 1) {
    return arr;
  }

  if (argsLen > 2) {
    arrays = flatten(slice(arguments, 1));
  }

  while (++i < len) {
    if (!~arrays.indexOf(arr[i])) {
      res.push(arr[i]);
    }
  }
  return res;
}

/**
 * Expose `diff`
 */

module.exports = diff;

},{"arr-flatten":20,"array-slice":21}],20:[function(require,module,exports){
/*!
 * arr-flatten <https://github.com/jonschlinkert/arr-flatten>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function flatten(arr) {
  return flat(arr, []);
};

function flat(arr, res) {
  var len = arr.length;
  var i = -1;

  while (len--) {
    var cur = arr[++i];
    if (Array.isArray(cur)) {
      flat(cur, res);
    } else {
      res.push(cur);
    }
  }
  return res;
}
},{}],21:[function(require,module,exports){
/*!
 * array-slice <https://github.com/jonschlinkert/array-slice>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function slice(arr, start, end) {
  var len = arr.length >>> 0;
  var range = [];

  start = idx(arr, start);
  end = idx(arr, end, len);

  while (start < end) {
    range.push(arr[start++]);
  }
  return range;
};


function idx(arr, pos, end) {
  var len = arr.length >>> 0;

  if (pos == null) {
    pos = end || 0;
  } else if (pos < 0) {
    pos = Math.max(len + pos, 0);
  } else {
    pos = Math.min(pos, len);
  }

  return pos;
}
},{}],22:[function(require,module,exports){
'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign require to trick browserify into
 * recognizing lazy requires
 */

var fn = require;
require = utils;
require('arr-diff', 'diff');
require('kind-of', 'typeOf');
require = fn;

/**
 * Expose `utils`
 */

module.exports = utils;

},{"arr-diff":19,"kind-of":28,"lazy-cache":34}],23:[function(require,module,exports){
/*!
 * is-data-descriptor <https://github.com/jonschlinkert/is-data-descriptor>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

// data descriptor properties
var data = {
  configurable: 'boolean',
  enumerable: 'boolean',
  writable: 'boolean'
};

function isDataDescriptor(obj) {
  if (utils.typeOf(obj) !== 'object') {
    return false;
  }

  var dataKeys = Object.keys(data);
  var keys = getKeys(obj);

  if (obj.hasOwnProperty('value')) {
    if (utils.diff(keys, dataKeys).length !== 1) {
      return false;
    }
    for (var key in obj) {
      if (key === 'value') continue;
      if (utils.typeOf(obj[key]) !== data[key]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Get object keys. `Object.keys()` only gets
 * enumerable properties.
 */

function getKeys(obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

/**
 * Expose `isDataDescriptor`
 */

module.exports = isDataDescriptor;

},{"./utils":27}],24:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"arr-flatten":25,"array-slice":26,"dup":19}],25:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],26:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],27:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"arr-diff":24,"dup":22,"kind-of":28,"lazy-cache":34}],28:[function(require,module,exports){
var isBuffer = require('is-buffer');
var toString = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

module.exports = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }

  // buffer
  if (typeof Buffer !== 'undefined' && isBuffer(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // must be a plain object
  return 'object';
};

},{"is-buffer":29}],29:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],30:[function(require,module,exports){
'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign require to trick browserify into
 * recognizing lazy requires
 */

var fn = require;
require = utils;
require('kind-of', 'typeOf');
require('is-accessor-descriptor', 'isAccessor');
require('is-data-descriptor', 'isData');
require = fn;

/**
 * Expose `utils`
 */

module.exports = utils;

},{"is-accessor-descriptor":18,"is-data-descriptor":23,"kind-of":28,"lazy-cache":34}],31:[function(require,module,exports){
/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var noncharacters = require('noncharacters');
var isObject = require('is-extendable');

module.exports = function getValue(obj, str, fn) {
  if (!isObject(obj)) return {};
  if (typeof str !== 'string') return obj;

  var path;

  if (fn && typeof fn === 'function') {
    path = fn(str);
  } else if (fn === true) {
    path = escapePath(str);
  } else {
    path = str.split(/[[.\]]/).filter(Boolean);
  }

  var len = path.length, i = -1;
  var last = null;

  while(++i < len) {
    var key = path[i];
    last = obj[key];
    if (!last) { return last; }

    if (isObject(obj)) {
      obj = last;
    }
  }
  return last;
};


function escape(str) {
  return str.split('\\.').join(noncharacters[0]);
}

function unescape(str) {
  return str.split(noncharacters[0]).join('.');
}

function escapePath(str) {
  return escape(str).split('.').map(function (seg) {
    return unescape(seg);
  });
}

},{"is-extendable":32,"noncharacters":33}],32:[function(require,module,exports){
/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isExtendable(val) {
  return typeof val !== 'undefined' && val !== null
    && (typeof val === 'object' || typeof val === 'function');
};

},{}],33:[function(require,module,exports){
/*!
 * noncharacters <https://github.com/jonschlinkert/noncharacters>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = [
  '\uFFFF',
  '\uFFFE',

  '\uFDD1',
  '\uFDD2',
  '\uFDD3',
  '\uFDD4',
  '\uFDD5',
  '\uFDD6',
  '\uFDD7',
  '\uFDD8',
  '\uFDD9',
  '\uFDDA',
  '\uFDDB',
  '\uFDDC',
  '\uFDDD',
  '\uFDDE',
  '\uFDDF',
  '\uFDE0',
  '\uFDE1',
  '\uFDE2',
  '\uFDE3',
  '\uFDE4',
  '\uFDE5',
  '\uFDE6',
  '\uFDE7',
  '\uFDE8',
  '\uFDE9',
  '\uFDEA',
  '\uFDEB',
  '\uFDEC',
  '\uFDED',
  '\uFDEE',
  '\uFDEF'
];

},{}],34:[function(require,module,exports){
(function (__filename){
'use strict';

/**
 * Cache results of the first function call to ensure only calling once.
 *
 * ```js
 * var lazy = require('lazy-cache')(require);
 * // cache the call to `require('ansi-yellow')`
 * lazy('ansi-yellow', 'yellow');
 * // use `ansi-yellow`
 * console.log(lazy.yellow('this is yellow'));
 * ```
 *
 * @param  {Function} `fn` Function that will be called only once.
 * @return {Function} Function that can be called to get the cached function
 * @api public
 */

function lazyCache(fn) {
  var cache = {};
  var proxy = function (mod, name) {
    name = name || camelcase(mod);
    Object.defineProperty(proxy, name, {
      get: getter
    });

    function getter () {
      if (cache.hasOwnProperty(name)) {
        return cache[name];
      }
      try {
        return (cache[name] = fn(mod));
      } catch (err) {
        err.message = 'lazy-cache ' + err.message + ' ' + __filename;
        throw err;
      }
    };
    return getter;
  };
  return proxy;
}

/**
 * Used to camelcase the name to be stored on the `lazy` object.
 *
 * @param  {String} `str` String containing `_`, `.`, `-` or whitespace that will be camelcased.
 * @return {String} camelcased string.
 */

function camelcase(str) {
  if (str.length === 1) { return str.toLowerCase(); }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase();
  return str.replace(/[\W_]+(\w|$)/g, function (_, ch) {
    return ch.toUpperCase();
  });
}

/**
 * Expose `lazyCache`
 */

module.exports = lazyCache;

}).call(this,"/Users/doowb/work/jonschlinkert/cyborg/node_modules/base-methods/node_modules/lazy-cache/index.js")

},{}],35:[function(require,module,exports){
/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');
var nc = require('noncharacters');

module.exports = function setValue(obj, path, val) {
  if (path == null) {
    return obj;
  }
  path = escape(path);
  var seg = (/^(.+)\.(.+)$/).exec(path);
  if (seg !== null) {
    create(obj, seg[1], seg[2], val);
    return obj;
  }
  obj[unescape(path)] = val;
  return obj;
};

function create(obj, path, child, val) {
  if (!path) return obj;
  var arr = path.split('.');
  var len = arr.length, i = 0;
  while (len--) {
    var key = unescape(arr[i++]);
    if (!obj[key] || !isObject(obj[key])) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  if (typeof child === 'string') {
    child = unescape(child);
  }
  return (obj[child] = val);
}

/**
 * Escape => `\\.`
 */
function escape(str) {
  return str.split('\\.').join(nc[1]);
}

/**
 * Unescaped dots
 */
function unescape(str) {
  return str.split(nc[1]).join('.');
}


},{"isobject":36,"noncharacters":37}],36:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],37:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],38:[function(require,module,exports){
/*!
 * unset-value <https://github.com/jonschlinkert/unset-value>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');
var has = require('has-value');

module.exports = function unset(obj, prop) {
  if (!isObject(obj)) {
    throw new TypeError('expected an object.');
  }
  if (has(obj, prop)) {
    var segs = prop.split('.');
    var last = segs.pop();
    while (prop = segs.shift()) {
      obj = obj[prop];
    }
    return (delete obj[last]);
  }
  return true;
};

},{"has-value":39,"isobject":41}],39:[function(require,module,exports){
/*!
 * has-value <https://github.com/jonschlinkert/has-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var get = require('get-value');
var hasValues = require('has-values');

module.exports = function (o, path, fn) {
  var len = arguments.length;
  if (len === 1 || (len === 2 && typeof path === 'boolean')) {
    return hasValues.apply(hasValues, arguments);
  }
  if (len === 3 && typeof fn === 'boolean') {
    return hasValues(get.apply(get, arguments), fn);
  }
  return hasValues(get.apply(get, arguments));
};

},{"get-value":31,"has-values":40}],40:[function(require,module,exports){
/*!
 * has-values <https://github.com/jonschlinkert/has-values>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function hasValue(o, noZero) {
  if (o === null || o === undefined) {
    return false;
  }

  if (typeof o === 'boolean') {
    return true;
  }

  if (typeof o === 'number') {
    if (o === 0 && noZero === true) {
      return false;
    }
    return true;
  }

  if (o.length !== undefined) {
    return o.length !== 0;
  }

  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      return true;
    }
  }
  return false;
};

},{}],41:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"isarray":42}],42:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],43:[function(require,module,exports){
'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;
require('set-value', 'set');
require('get-value', 'get');
require('unset-value', 'del');
require('collection-visit', 'visit');
require('define-property', 'define');
require('component-emitter', 'Emitter');
require('class-utils', 'cu');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;

},{"class-utils":3,"collection-visit":7,"component-emitter":15,"define-property":16,"get-value":31,"lazy-cache":34,"set-value":35,"unset-value":38}],44:[function(require,module,exports){
/*!
 * base-options <https://github.com/jonschlinkert/base-options>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function option(app) {
  app.mixin('option', function(key, value) {
    this.options = this.options || {};

    if (typeof key === 'string') {
      if (arguments.length === 1) {
        return utils.get(this.options, key);
      }
      utils.set(this.options, key, value);
      this.emit('option', key, value);
      return this;
    }

    if (key == null || typeof key !== 'object') {
      throw new TypeError('expected a string or object.');
    }

    this.visit('option', key);
    return this;
  });
};

},{"./utils":52}],45:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31,"is-extendable":46,"noncharacters":47}],46:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],47:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],48:[function(require,module,exports){
(function (__filename){
'use strict';

/**
 * Cache results of the first function call to ensure only calling once.
 *
 * ```js
 * var lazy = require('lazy-cache')(require);
 * // cache the call to `require('ansi-yellow')`
 * lazy('ansi-yellow', 'yellow');
 * // use `ansi-yellow`
 * console.log(lazy.yellow('this is yellow'));
 * ```
 *
 * @param  {Function} `fn` Function that will be called only once.
 * @return {Function} Function that can be called to get the cached function
 * @api public
 */

function lazyCache(fn) {
  var cache = {};
  var proxy = function (mod, name) {
    name = name || camelcase(mod);
    Object.defineProperty(proxy, name, {
      get: getter
    });

    function getter () {
      if (cache.hasOwnProperty(name)) {
        return cache[name];
      }
      try {
        return (cache[name] = fn(mod));
      } catch (err) {
        err.message = 'lazy-cache ' + err.message + ' ' + __filename;
        throw err;
      }
    };
    return getter;
  };
  return proxy;
}

/**
 * Used to camelcase the name to be stored on the `lazy` object.
 *
 * @param  {String} `str` String containing `_`, `.`, `-` or whitespace that will be camelcased.
 * @return {String} camelcased string.
 */

function camelcase(str) {
  if (str.length === 1) { return str.toLowerCase(); }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase();
  return str.replace(/[\W_]+(\w|$)/g, function (_, ch) {
    return ch.toUpperCase();
  });
}

/**
 * Expose `lazyCache`
 */

module.exports = lazyCache;

}).call(this,"/Users/doowb/work/jonschlinkert/cyborg/node_modules/base-options/node_modules/lazy-cache/index.js")

},{}],49:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35,"isobject":50,"noncharacters":51}],50:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],51:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],52:[function(require,module,exports){
'use strict';

/**
 * Lazily required module dependencies
 */

var lazy = require('lazy-cache')(require);
var fn = require;

require = lazy;
require('set-value', 'set');
require('get-value', 'get');
require = fn;

/**
 * Expose `lazy` modules
 */

module.exports = lazy;

},{"get-value":45,"lazy-cache":48,"set-value":49}],53:[function(require,module,exports){
/*!
 * base-plugins <https://github.com/jonschlinkert/base-plugins>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function(app) {
  if (!this.plugins) {
    this.define('plugins', []);
  }

  /**
   * Define a plugin function to be called immediately upon init.
   * The only parameter exposed to the plugin is the application
   * instance.
   *
   * Also, if a plugin returns a function, the function will be pushed
   * onto the `plugins` array, allowing the plugin to be called at a
   * later point, elsewhere in the application.
   *
   * ```js
   * // define a plugin
   * function foo(app) {
   *   // do stuff
   * }
   *
   * // register plugins
   * var app = new Base()
   *   .use(foo)
   *   .use(bar)
   *   .use(baz)
   * ```
   * @name .use
   * @param {Function} `fn` plugin function to call
   * @return {Object} Returns the item instance for chaining.
   * @api public
   */

  app.mixin('use', function(fn) {
    var plugin = fn.call(this, this);
    if (typeof plugin === 'function') {
      this.plugins.push(plugin);
    }

    this.emit('use');
    return this;
  });

  /**
   * Run all plugins
   *
   * ```js
   * var config = {};
   * app.run(config);
   * ```
   * @name .run
   * @param {Object} `value` Object to be modified by plugins.
   * @return {Object} Returns the item instance for chaining.
   * @api public
   */

  app.mixin('run', function(val) {
    this.plugins.forEach(function (fn) {
      if (typeof val.use === 'function') {
        val.use(fn);
      } else {
        fn.call(val, val);
        app.emit('use');
      }
    });
    return this;
  });
};

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZS1tZXRob2RzL25vZGVfbW9kdWxlcy9jbGFzcy11dGlscy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2NsYXNzLXV0aWxzL25vZGVfbW9kdWxlcy9pc29iamVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2NsYXNzLXV0aWxzL25vZGVfbW9kdWxlcy9pc29iamVjdC9ub2RlX21vZHVsZXMvaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2NsYXNzLXV0aWxzL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvY29sbGVjdGlvbi12aXNpdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2NvbGxlY3Rpb24tdmlzaXQvbm9kZV9tb2R1bGVzL21hcC12aXNpdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2NvbGxlY3Rpb24tdmlzaXQvbm9kZV9tb2R1bGVzL21hcC12aXNpdC9ub2RlX21vZHVsZXMvb2JqZWN0LXZpc2l0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvY29sbGVjdGlvbi12aXNpdC9ub2RlX21vZHVsZXMvbWFwLXZpc2l0L25vZGVfbW9kdWxlcy9vYmplY3QtdmlzaXQvbm9kZV9tb2R1bGVzL2lzb2JqZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvY29sbGVjdGlvbi12aXNpdC9ub2RlX21vZHVsZXMvbWFwLXZpc2l0L3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvY29sbGVjdGlvbi12aXNpdC9ub2RlX21vZHVsZXMvb2JqZWN0LXZpc2l0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvY29sbGVjdGlvbi12aXNpdC91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZGVmaW5lLXByb3BlcnR5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZGVmaW5lLXByb3BlcnR5L25vZGVfbW9kdWxlcy9pcy1kZXNjcmlwdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZGVmaW5lLXByb3BlcnR5L25vZGVfbW9kdWxlcy9pcy1kZXNjcmlwdG9yL25vZGVfbW9kdWxlcy9pcy1hY2Nlc3Nvci1kZXNjcmlwdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZGVmaW5lLXByb3BlcnR5L25vZGVfbW9kdWxlcy9pcy1kZXNjcmlwdG9yL25vZGVfbW9kdWxlcy9pcy1hY2Nlc3Nvci1kZXNjcmlwdG9yL25vZGVfbW9kdWxlcy9hcnItZGlmZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2RlZmluZS1wcm9wZXJ0eS9ub2RlX21vZHVsZXMvaXMtZGVzY3JpcHRvci9ub2RlX21vZHVsZXMvaXMtYWNjZXNzb3ItZGVzY3JpcHRvci9ub2RlX21vZHVsZXMvYXJyLWRpZmYvbm9kZV9tb2R1bGVzL2Fyci1mbGF0dGVuL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZGVmaW5lLXByb3BlcnR5L25vZGVfbW9kdWxlcy9pcy1kZXNjcmlwdG9yL25vZGVfbW9kdWxlcy9pcy1hY2Nlc3Nvci1kZXNjcmlwdG9yL25vZGVfbW9kdWxlcy9hcnItZGlmZi9ub2RlX21vZHVsZXMvYXJyYXktc2xpY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZS1tZXRob2RzL25vZGVfbW9kdWxlcy9kZWZpbmUtcHJvcGVydHkvbm9kZV9tb2R1bGVzL2lzLWRlc2NyaXB0b3Ivbm9kZV9tb2R1bGVzL2lzLWFjY2Vzc29yLWRlc2NyaXB0b3IvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvYmFzZS1tZXRob2RzL25vZGVfbW9kdWxlcy9kZWZpbmUtcHJvcGVydHkvbm9kZV9tb2R1bGVzL2lzLWRlc2NyaXB0b3Ivbm9kZV9tb2R1bGVzL2lzLWRhdGEtZGVzY3JpcHRvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2RlZmluZS1wcm9wZXJ0eS9ub2RlX21vZHVsZXMvaXMtZGVzY3JpcHRvci9ub2RlX21vZHVsZXMva2luZC1vZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2RlZmluZS1wcm9wZXJ0eS9ub2RlX21vZHVsZXMvaXMtZGVzY3JpcHRvci9ub2RlX21vZHVsZXMva2luZC1vZi9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZGVmaW5lLXByb3BlcnR5L25vZGVfbW9kdWxlcy9pcy1kZXNjcmlwdG9yL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZ2V0LXZhbHVlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZ2V0LXZhbHVlL25vZGVfbW9kdWxlcy9pcy1leHRlbmRhYmxlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvZ2V0LXZhbHVlL25vZGVfbW9kdWxlcy9ub25jaGFyYWN0ZXJzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy9ub2RlX21vZHVsZXMvbGF6eS1jYWNoZS9Vc2Vycy9kb293Yi93b3JrL2pvbnNjaGxpbmtlcnQvY3lib3JnL25vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL2xhenktY2FjaGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZS1tZXRob2RzL25vZGVfbW9kdWxlcy9zZXQtdmFsdWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZS1tZXRob2RzL25vZGVfbW9kdWxlcy91bnNldC12YWx1ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW1ldGhvZHMvbm9kZV9tb2R1bGVzL3Vuc2V0LXZhbHVlL25vZGVfbW9kdWxlcy9oYXMtdmFsdWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZS1tZXRob2RzL25vZGVfbW9kdWxlcy91bnNldC12YWx1ZS9ub2RlX21vZHVsZXMvaGFzLXZhbHVlL25vZGVfbW9kdWxlcy9oYXMtdmFsdWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jhc2UtbWV0aG9kcy91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW9wdGlvbnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZS1vcHRpb25zL25vZGVfbW9kdWxlcy9sYXp5LWNhY2hlL1VzZXJzL2Rvb3diL3dvcmsvam9uc2NobGlua2VydC9jeWJvcmcvbm9kZV9tb2R1bGVzL2Jhc2Utb3B0aW9ucy9ub2RlX21vZHVsZXMvbGF6eS1jYWNoZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlLW9wdGlvbnMvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvYmFzZS1wbHVnaW5zL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OzJCQ09pQixjQUFjOzs7OzJCQUNaLGNBQWM7Ozs7MkJBQ2QsY0FBYzs7OztBQUVqQyxJQUFNLElBQUksR0FBRyx5QkFBSyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXJDLFNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUN2QixNQUFJLEVBQUUsSUFBSSxZQUFZLE1BQU0sQ0FBQSxBQUFDLEVBQUU7QUFDN0IsV0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUM1QjtBQUNELE1BQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEIsTUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxHQUFHLDBCQUFRLENBQUM7QUFDakIsTUFBSSxDQUFDLEdBQUcsMEJBQVEsQ0FBQztDQUNsQjs7QUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztxQkFFTCxNQUFNOzs7O0FDekJyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogY3lib3JnIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9jeWJvcmc+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgYmFzZSBmcm9tICdiYXNlLW1ldGhvZHMnO1xuaW1wb3J0IHBsdWdpbiBmcm9tICdiYXNlLXBsdWdpbnMnO1xuaW1wb3J0IG9wdGlvbiBmcm9tICdiYXNlLW9wdGlvbnMnO1xuXG5jb25zdCBCYXNlID0gYmFzZS5uYW1lc3BhY2UoJ2NhY2hlJyk7XG5cbmZ1bmN0aW9uIEN5Ym9yZyhvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBDeWJvcmcpKSB7XG4gICAgcmV0dXJuIG5ldyBDeWJvcmcob3B0aW9ucyk7XG4gIH1cbiAgQmFzZS5jYWxsKHRoaXMpO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB0aGlzLnVzZShvcHRpb24pO1xuICB0aGlzLnVzZShwbHVnaW4pO1xufVxuXG5CYXNlLmV4dGVuZChDeWJvcmcpO1xuXG5leHBvcnQgZGVmYXVsdCBDeWJvcmc7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG5hbWVzcGFjZShuYW1lKSB7XG4gIHZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIGBCYXNlYCB3aXRoIGBvcHRpb25zYC5cbiAgICpcbiAgICogYGBganNcbiAgICogdmFyIGFwcCA9IG5ldyBCYXNlKCk7XG4gICAqIGFwcC5zZXQoJ2ZvbycsICdiYXInKTtcbiAgICogY29uc29sZS5sb2coYXBwLmdldCgnZm9vJykpO1xuICAgKiAvLz0+ICdiYXInXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIEJhc2Uob3B0aW9ucykge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCYXNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBCYXNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuZGVmaW5lKCdfY2FsbGJhY2tzJywgdGhpcy5fY2FsbGJhY2tzKTtcbiAgICBpZiAobmFtZSkgdGhpc1tuYW1lXSA9IHt9O1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMudmlzaXQoJ3NldCcsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIEJhc2UucHJvdG90eXBlID0gdXRpbHMuRW1pdHRlcih7XG4gICAgY29uc3RydWN0b3I6IEJhc2UsXG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgYSBwbHVnaW4gZnVuY3Rpb24gdG8gYmUgY2FsbGVkIGltbWVkaWF0ZWx5IHVwb24gaW5pdC5cbiAgICAgKiBQbHVnaW5zIGFyZSBjaGFpbmFibGUgYW5kIHRoZSBvbmx5IHBhcmFtZXRlciBleHBvc2VkIHRvIHRoZVxuICAgICAqIHBsdWdpbiBpcyB0aGUgYXBwbGljYXRpb24gaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBgYGBqc1xuICAgICAqIHZhciBhcHAgPSBuZXcgQmFzZSgpXG4gICAgICogICAudXNlKGZvbylcbiAgICAgKiAgIC51c2UoYmFyKVxuICAgICAqICAgLnVzZShiYXopXG4gICAgICogYGBgXG4gICAgICogQG5hbWUgLnVzZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGBmbmAgcGx1Z2luIGZ1bmN0aW9uIHRvIGNhbGxcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgdGhlIGl0ZW0gaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICB1c2U6IGZ1bmN0aW9uKGZuKSB7XG4gICAgICBmbi5jYWxsKHRoaXMsIHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFzc2lnbiBgdmFsdWVgIHRvIGBrZXlgLiBBbHNvIGVtaXRzIGBzZXRgIHdpdGhcbiAgICAgKiB0aGUga2V5IGFuZCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIGBgYGpzXG4gICAgICogYXBwLm9uKCdzZXQnLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAqICAgLy8gZG8gc29tZXRoaW5nIHdoZW4gYHNldGAgaXMgZW1pdHRlZFxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogYXBwLnNldChrZXksIHZhbHVlKTtcbiAgICAgKlxuICAgICAqIC8vIGFsc28gdGFrZXMgYW4gb2JqZWN0IG9yIGFycmF5XG4gICAgICogYXBwLnNldCh7bmFtZTogJ0hhbGxlJ30pO1xuICAgICAqIGFwcC5zZXQoW3tmb286ICdiYXInfSwge2JhejogJ3F1dXgnfV0pO1xuICAgICAqIGNvbnNvbGUubG9nKGFwcCk7XG4gICAgICogLy89PiB7bmFtZTogJ0hhbGxlJywgZm9vOiAnYmFyJywgYmF6OiAncXV1eCd9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbmFtZSAuc2V0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGBrZXlgXG4gICAgICogQHBhcmFtIHsqfSBgdmFsdWVgXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLnZpc2l0KCdzZXQnLCBrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICB1dGlscy5zZXQodGhpc1tuYW1lXSwga2V5LCB2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHV0aWxzLnNldCh0aGlzLCBrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0KCdzZXQnLCBrZXksIHZhbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBzdG9yZWQgdmFsdWUgb2YgYGtleWAuIERvdCBub3RhdGlvbiBtYXkgYmUgdXNlZFxuICAgICAqIHRvIGdldCBbbmVzdGVkIHByb3BlcnR5IHZhbHVlc11bZ2V0LXZhbHVlXS5cbiAgICAgKlxuICAgICAqIGBgYGpzXG4gICAgICogYXBwLnNldCgnZm9vJywgJ2JhcicpO1xuICAgICAqIGFwcC5nZXQoJ2ZvbycpO1xuICAgICAqIC8vID0+IFwiYmFyXCJcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBuYW1lIC5nZXRcbiAgICAgKiBAcGFyYW0geyp9IGBrZXlgXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBgZXNjYXBlYFxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICByZXR1cm4gdXRpbHMuZ2V0KHRoaXNbbmFtZV0sIGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXRpbHMuZ2V0KHRoaXMsIGtleSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBga2V5YCBmcm9tIHRoZSBpbnN0YW5jZS4gQWxzbyBlbWl0cyBgZGVsYCB3aXRoXG4gICAgICogdGhlIGtleSBvZiB0aGUgZGVsZXRlZCBpdGVtLlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiBhcHAuZGVsKCk7IC8vIGRlbGV0ZSBhbGxcbiAgICAgKiAvLyBvclxuICAgICAqIGFwcC5kZWwoJ2ZvbycpO1xuICAgICAqIC8vIG9yXG4gICAgICogYXBwLmRlbChbJ2ZvbycsICdiYXInXSk7XG4gICAgICogYGBgXG4gICAgICogQG5hbWUgLmRlbFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBga2V5YFxuICAgICAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyB0aGUgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBkZWw6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICB0aGlzLnZpc2l0KCdkZWwnLCBrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICB1dGlscy5kZWwodGhpc1tuYW1lXSwga2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1dGlscy5kZWwodGhpcywga2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoJ2RlbCcsIGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBhc3NpZ25pbmcgYSBgbmFtZWAgb24gdGhlIGluc3RhbmNlXG4gICAgICogZm9yIGRvaW5nIGxvb2t1cHMgaW4gcGx1Z2lucy5cbiAgICAgKi9cblxuICAgIGlzOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmRlZmluZSgnaXMnICsgbmFtZSwgdHJ1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgb24gdGhlIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiAvLyBhcmJpdHJhcnkgYHJlbmRlcmAgZnVuY3Rpb24gdXNpbmcgbG9kYXNoIGB0ZW1wbGF0ZWBcbiAgICAgKiBkZWZpbmUoJ3JlbmRlcicsIGZ1bmN0aW9uKHN0ciwgbG9jYWxzKSB7XG4gICAgICogICByZXR1cm4gXy50ZW1wbGF0ZShzdHIpKGxvY2Fscyk7XG4gICAgICogfSk7XG4gICAgICogYGBgXG4gICAgICogQG5hbWUgLmRlZmluZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBga2V5YFxuICAgICAqIEBwYXJhbSB7YW55fSBgdmFsdWVgXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIGRlZmluZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdXRpbHMuZGVmaW5lKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGBtZXRob2RgIG92ZXIgdGhlIGl0ZW1zIGluIHRoZSBnaXZlbiBvYmplY3QsIG9yIG1hcFxuICAgICAqIHZpc2l0IG92ZXIgdGhlIG9iamVjdHMgaW4gYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAbmFtZSAudmlzaXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYG1ldGhvZGBcbiAgICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gYHZhbGBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgdGhlIGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgdmlzaXQ6IGZ1bmN0aW9uKG1ldGhvZCwgdmFsKSB7XG4gICAgICB1dGlscy52aXNpdCh0aGlzLCBtZXRob2QsIHZhbCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTWl4IHByb3BlcnR5IGBrZXlgIG9udG8gdGhlIEJhc2UgcHJvdG90eXBlLiBJZiBiYXNlLW1ldGhvZHNcbiAgICAgKiBpcyBpbmhlcml0ZWQgdXNpbmcgYEJhc2UuZXh0ZW5kYCB0aGlzIG1ldGhvZCB3aWxsIGJlIG92ZXJyaWRkZW5cbiAgICAgKiBieSBhIG5ldyBgbWl4aW5gIG1ldGhvZCB0aGF0IHdpbGwgb25seSBhZGQgcHJvcGVydGllcyB0byB0aGVcbiAgICAgKiBwcm90b3R5cGUgb2YgdGhlIGluaGVyaXRpbmcgYXBwbGljYXRpb24uXG4gICAgICpcbiAgICAgKiBAbmFtZSAubWl4aW5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYGtleWBcbiAgICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gYHZhbGBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgdGhlIGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgbWl4aW46IGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICBCYXNlLnByb3RvdHlwZVtrZXldID0gdmFsO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcblxuICAvKipcbiAgICogU3RhdGljIG1ldGhvZCBmb3IgaW5oZXJpdGluZyBib3RoIHRoZSBwcm90b3R5cGUgYW5kXG4gICAqIHN0YXRpYyBtZXRob2RzIG9mIHRoZSBgQmFzZWAgY2xhc3MuIFNlZSBbY2xhc3MtdXRpbHNdW11cbiAgICogZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQmFzZS5leHRlbmQgPSB1dGlscy5jdS5leHRlbmQoQmFzZSk7XG5cbiAgLyoqXG4gICAqIFNpbWlsYXIgdG8gYHV0aWwuaW5oZXJpdGAsIGJ1dCBjb3BpZXMgYWxsIHN0YXRpYyBwcm9wZXJ0aWVzLFxuICAgKiBwcm90b3R5cGUgcHJvcGVydGllcywgYW5kIGRlc2NyaXB0b3JzIGZyb20gYFByb3ZpZGVyYCB0byBgUmVjZWl2ZXJgLlxuICAgKiBbY2xhc3MtdXRpbHNdW10gZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQmFzZS5pbmhlcml0ID0gdXRpbHMuY3UuaW5oZXJpdDtcbiAgcmV0dXJuIEJhc2U7XG59XG5cbi8qKlxuICogRXhwb3NlIGBiYXNlLW1ldGhvZHNgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBuYW1lc3BhY2UoKTtcblxuLyoqXG4gKiBBbGxvdyB1c2VycyB0byBkZWZpbmUgYSBuYW1lc3BhY2VcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIEV4cG9zZSBjbGFzcyB1dGlsc1xuICovXG5cbnZhciBjdSA9IG1vZHVsZS5leHBvcnRzO1xuXG4vKipcbiAqIEV4cG9zZSBjbGFzcyB1dGlsczogYGN1YFxuICovXG5cbmN1LmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB1dGlscy5pc09iaih2YWwpIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbic7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhbiBhcnJheSBoYXMgYW55IG9mIHRoZSBnaXZlbiBlbGVtZW50cywgb3IgYW5cbiAqIG9iamVjdCBoYXMgYW55IG9mIHRoZSBnaXZlIGtleXMuXG4gKlxuICogYGBganNcbiAqIGN1LmhhcyhbJ2EnLCAnYicsICdjJ10sICdjJyk7XG4gKiAvLz0+IHRydWVcbiAqXG4gKiBjdS5oYXMoWydhJywgJ2InLCAnYyddLCBbJ2MnLCAneiddKTtcbiAqIC8vPT4gdHJ1ZVxuICpcbiAqIGN1Lmhhcyh7YTogJ2InLCBjOiAnZCd9LCBbJ2MnLCAneiddKTtcbiAqIC8vPT4gdHJ1ZVxuICogYGBgXG4gKiBAcGFyYW0ge09iamVjdH0gYG9iamBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBgdmFsYFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuY3UuaGFzID0gZnVuY3Rpb24gaGFzKG9iaiwgdmFsKSB7XG4gIHZhbCA9IGN1LmFycmF5aWZ5KHZhbCk7XG4gIHZhciBsZW4gPSB2YWwubGVuZ3RoO1xuXG4gIGlmIChjdS5pc09iamVjdChvYmopKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKHZhbC5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIga2V5cyA9IGN1Lm5hdGl2ZUtleXMob2JqKTtcbiAgICByZXR1cm4gY3UuaGFzKGtleXMsIHZhbCk7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgdmFyIGFyciA9IG9iajtcbiAgICB3aGlsZSAobGVuLS0pIHtcbiAgICAgIGlmIChhcnIuaW5kZXhPZih2YWxbbGVuXSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgYW4gYXJyYXkgb3Igb2JqZWN0LicpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYW4gYXJyYXkgb3Igb2JqZWN0IGhhcyBhbGwgb2YgdGhlIGdpdmVuIHZhbHVlcy5cbiAqXG4gKiBgYGBqc1xuICogY3UuaGFzQWxsKFsnYScsICdiJywgJ2MnXSwgJ2MnKTtcbiAqIC8vPT4gdHJ1ZVxuICpcbiAqIGN1Lmhhc0FsbChbJ2EnLCAnYicsICdjJ10sIFsnYycsICd6J10pO1xuICogLy89PiBmYWxzZVxuICpcbiAqIGN1Lmhhc0FsbCh7YTogJ2InLCBjOiAnZCd9LCBbJ2MnLCAneiddKTtcbiAqIC8vPT4gZmFsc2VcbiAqIGBgYFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGB2YWxgXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYHZhbHVlc2BcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmN1Lmhhc0FsbCA9IGZ1bmN0aW9uIGhhc0FsbCh2YWwsIHZhbHVlcykge1xuICB2YWx1ZXMgPSBjdS5hcnJheWlmeSh2YWx1ZXMpO1xuICB2YXIgbGVuID0gdmFsdWVzLmxlbmd0aDtcbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgaWYgKCFjdS5oYXModmFsLCB2YWx1ZXNbbGVuXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIENhc3QgdGhlIGdpdmVuIHZhbHVlIHRvIGFuIGFycmF5LlxuICpcbiAqIGBgYGpzXG4gKiBjdS5hcnJheWlmeSgnZm9vJyk7XG4gKiAvLz0+IFsnZm9vJ11cbiAqXG4gKiBjdS5hcnJheWlmeShbJ2ZvbyddKTtcbiAqIC8vPT4gWydmb28nXVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGB2YWxgXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuY3UuYXJyYXlpZnkgPSBmdW5jdGlvbiBhcnJheWlmeSh2YWwpIHtcbiAgcmV0dXJuIHZhbCA/IChBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwgOiBbdmFsXSkgOiBbXTtcbn07XG5cbi8qKlxuICogTm9vcFxuICovXG5cbmN1Lm5vb3AgPSBmdW5jdGlvbiBub29wKCkge1xuICByZXR1cm47XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHBhc3NlZCB0byB0aGUgZnVuY3Rpb24uXG4gKi9cblxuY3UuaWRlbnRpdHkgPSBmdW5jdGlvbiBpZGVudGl0eSh2YWwpIHtcbiAgcmV0dXJuIHZhbDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgdmFsdWUgaGFzIGEgYGNvbnRydWN0b3JgXG4gKlxuICogYGBganNcbiAqIGN1Lmhhc0NvbnN0cnVjdG9yKHt9KTtcbiAqIC8vPT4gdHJ1ZVxuICpcbiAqIGN1Lmhhc0NvbnN0cnVjdG9yKE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy89PiBmYWxzZVxuICogYGBgXG4gKiBAcGFyYW0gIHtPYmplY3R9IGB2YWx1ZWBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmN1Lmhhc0NvbnN0cnVjdG9yID0gZnVuY3Rpb24gaGFzQ29uc3RydWN0b3IodmFsKSB7XG4gIHJldHVybiBjdS5pc09iamVjdCh2YWwpICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IgIT09ICd1bmRlZmluZWQnO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIG5hdGl2ZSBgb3duUHJvcGVydHlOYW1lc2AgZnJvbSB0aGUgY29uc3RydWN0b3Igb2YgdGhlXG4gKiBnaXZlbiBgb2JqZWN0YC4gQW4gZW1wdHkgYXJyYXkgaXMgcmV0dXJuZWQgaWYgdGhlIG9iamVjdCBkb2VzXG4gKiBub3QgaGF2ZSBhIGNvbnN0cnVjdG9yLlxuICpcbiAqIGBgYGpzXG4gKiBjdS5uYXRpdmVLZXlzKHthOiAnYicsIGI6ICdjJywgYzogJ2QnfSlcbiAqIC8vPT4gWydhJywgJ2InLCAnYyddXG4gKlxuICogY3UubmF0aXZlS2V5cyhmdW5jdGlvbigpe30pXG4gKiAvLz0+IFsnbGVuZ3RoJywgJ2NhbGxlciddXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBvYmpgIE9iamVjdCB0aGF0IGhhcyBhIGBjb25zdHJ1Y3RvcmAuXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2Yga2V5cy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuY3UubmF0aXZlS2V5cyA9IGZ1bmN0aW9uIG5hdGl2ZUtleXModmFsKSB7XG4gIGlmICghY3UuaGFzQ29uc3RydWN0b3IodmFsKSkgcmV0dXJuIFtdO1xuICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBwcm9wZXJ0eSBkZXNjcmlwdG9yIGBrZXlgIGlmIGl0J3MgYW4gXCJvd25cIiBwcm9wZXJ0eVxuICogb2YgdGhlIGdpdmVuIG9iamVjdC5cbiAqXG4gKiBgYGBqc1xuICogZnVuY3Rpb24gQXBwKCkge31cbiAqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcHAucHJvdG90eXBlLCAnY291bnQnLCB7XG4gKiAgIGdldDogZnVuY3Rpb24oKSB7XG4gKiAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMpLmxlbmd0aDtcbiAqICAgfVxuICogfSk7XG4gKiBjdS5nZXREZXNjcmlwdG9yKEFwcC5wcm90b3R5cGUsICdjb3VudCcpO1xuICogLy8gcmV0dXJuczpcbiAqIC8vIHtcbiAqIC8vICAgZ2V0OiBbRnVuY3Rpb25dLFxuICogLy8gICBzZXQ6IHVuZGVmaW5lZCxcbiAqIC8vICAgZW51bWVyYWJsZTogZmFsc2UsXG4gKiAvLyAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAqIC8vIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb2JqYFxuICogQHBhcmFtIHtTdHJpbmd9IGBrZXlgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgZGVzY3JpcHRvciBga2V5YFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jdS5nZXREZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0RGVzY3JpcHRvcihvYmosIGtleSkge1xuICBpZiAoIWN1LmlzT2JqZWN0KG9iaikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCBhbiBvYmplY3QuJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQga2V5IHRvIGJlIGEgc3RyaW5nLicpO1xuICB9XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KTtcbn07XG5cbi8qKlxuICogQ29weSBhIGRlc2NyaXB0b3IgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXG4gKlxuICogYGBganNcbiAqIGZ1bmN0aW9uIEFwcCgpIHt9XG4gKiBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXBwLnByb3RvdHlwZSwgJ2NvdW50Jywge1xuICogICBnZXQ6IGZ1bmN0aW9uKCkge1xuICogICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzKS5sZW5ndGg7XG4gKiAgIH1cbiAqIH0pO1xuICogdmFyIG9iaiA9IHt9O1xuICogY3UuY29weURlc2NyaXB0b3Iob2JqLCBBcHAucHJvdG90eXBlLCAnY291bnQnKTtcbiAqIGBgYFxuICogQHBhcmFtIHtPYmplY3R9IGByZWNlaXZlcmBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgcHJvdmlkZXJgXG4gKiBAcGFyYW0ge1N0cmluZ30gYG5hbWVgXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmN1LmNvcHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gY29weURlc2NyaXB0b3IocmVjZWl2ZXIsIHByb3ZpZGVyLCBuYW1lKSB7XG4gIGlmICghY3UuaXNPYmplY3QocmVjZWl2ZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgcmVjZWl2aW5nIG9iamVjdCB0byBiZSBhbiBvYmplY3QuJyk7XG4gIH1cbiAgaWYgKCFjdS5pc09iamVjdChwcm92aWRlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCBwcm92aWRpbmcgb2JqZWN0IHRvIGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgbmFtZSB0byBiZSBhIHN0cmluZy4nKTtcbiAgfVxuICB2YXIgdmFsID0gY3UuZ2V0RGVzY3JpcHRvcihwcm92aWRlciwgbmFtZSk7XG4gIGlmICh2YWwpIHV0aWxzLmRlZmluZShyZWNlaXZlciwgbmFtZSwgdmFsKTtcbn07XG5cbi8qKlxuICogQ29weSBzdGF0aWMgcHJvcGVydGllcywgcHJvdG90eXBlIHByb3BlcnRpZXMsIGFuZCBkZXNjcmlwdG9yc1xuICogZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGByZWNlaXZlcmBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgcHJvdmlkZXJgXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYG9taXRgIE9uZSBvciBtb3JlIHByb3BlcnRpZXMgdG8gb21pdFxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jdS5jb3B5ID0gZnVuY3Rpb24gY29weShyZWNlaXZlciwgcHJvdmlkZXIsIG9taXQpIHtcbiAgaWYgKCFjdS5pc09iamVjdChyZWNlaXZlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCByZWNlaXZpbmcgb2JqZWN0IHRvIGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuICBpZiAoIWN1LmlzT2JqZWN0KHByb3ZpZGVyKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkIHByb3ZpZGluZyBvYmplY3QgdG8gYmUgYW4gb2JqZWN0LicpO1xuICB9XG4gIHZhciBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3ZpZGVyKTtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm92aWRlcik7XG4gIHZhciBsZW4gPSBwcm9wcy5sZW5ndGgsXG4gICAga2V5O1xuICBvbWl0ID0gY3UuYXJyYXlpZnkob21pdCk7XG5cbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAga2V5ID0gcHJvcHNbbGVuXTtcblxuICAgIGlmIChjdS5oYXMoa2V5cywga2V5KSkge1xuICAgICAgdXRpbHMuZGVmaW5lKHJlY2VpdmVyLCBrZXksIHByb3ZpZGVyW2tleV0pO1xuICAgIH0gZWxzZSBpZiAoIShrZXkgaW4gcmVjZWl2ZXIpICYmICFjdS5oYXMob21pdCwga2V5KSkge1xuICAgICAgY3UuY29weURlc2NyaXB0b3IocmVjZWl2ZXIsIHByb3ZpZGVyLCBrZXkpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBJbmhlcml0IHRoZSBzdGF0aWMgcHJvcGVydGllcywgcHJvdG90eXBlIHByb3BlcnRpZXMsIGFuZCBkZXNjcmlwdG9yc1xuICogZnJvbSBvZiBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGByZWNlaXZlcmBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgcHJvdmlkZXJgXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYG9taXRgIE9uZSBvciBtb3JlIHByb3BlcnRpZXMgdG8gb21pdFxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jdS5pbmhlcml0ID0gZnVuY3Rpb24gaW5oZXJpdChyZWNlaXZlciwgcHJvdmlkZXIsIG9taXQpIHtcbiAgaWYgKCFjdS5pc09iamVjdChyZWNlaXZlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCByZWNlaXZpbmcgb2JqZWN0IHRvIGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuICBpZiAoIWN1LmlzT2JqZWN0KHByb3ZpZGVyKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkIHByb3ZpZGluZyBvYmplY3QgdG8gYmUgYW4gb2JqZWN0LicpO1xuICB9XG5cbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIHByb3ZpZGVyKSB7XG4gICAga2V5cy5wdXNoKGtleSk7XG4gICAgcmVjZWl2ZXJba2V5XSA9IHByb3ZpZGVyW2tleV07XG4gIH1cblxuICBrZXlzID0ga2V5cy5jb25jYXQoY3UuYXJyYXlpZnkob21pdCkpO1xuXG4gIHZhciBhID0gcHJvdmlkZXIucHJvdG90eXBlIHx8IHByb3ZpZGVyO1xuICB2YXIgYiA9IHJlY2VpdmVyLnByb3RvdHlwZSB8fCByZWNlaXZlcjtcbiAgY3UuY29weShiLCBhLCBrZXlzKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIGZvciBleHRlbmRpbmcgdGhlIHN0YXRpYyBwcm9wZXJ0aWVzLFxuICogcHJvdG90eXBlIHByb3BlcnRpZXMsIGFuZCBkZXNjcmlwdG9ycyBmcm9tIHRoZSBgUGFyZW50YFxuICogY29uc3RydWN0b3Igb250byBgQ2hpbGRgIGNvbnN0cnVjdG9ycy5cbiAqXG4gKiBgYGBqc1xuICogdmFyIGV4dGVuZCA9IGN1LmV4dGVuZChQYXJlbnQpO1xuICogUGFyZW50LmV4dGVuZChDaGlsZCk7XG4gKlxuICogLy8gb3B0aW9uYWwgbWV0aG9kc1xuICogUGFyZW50LmV4dGVuZChDaGlsZCwge1xuICogICBmb286IGZ1bmN0aW9uKCkge30sXG4gKiAgIGJhcjogZnVuY3Rpb24oKSB7fVxuICogfSk7XG4gKiBgYGBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGBQYXJlbnRgIFBhcmVudCBjdG9yXG4gKiAgIEBwYXJhbSB7RnVuY3Rpb259IGBDaGlsZGAgQ2hpbGQgY3RvclxuICogICBAcGFyYW0ge09iamVjdH0gYHByb3RvYCBPcHRpb25hbGx5IHBhc3MgYWRkaXRpb25hbCBwcm90b3R5cGUgcHJvcGVydGllcyB0byBpbmhlcml0LlxuICogICBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmN1LmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZChQYXJlbnQpIHtcbiAgaWYgKHR5cGVvZiBQYXJlbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCBQYXJlbnQgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihDdG9yLCBwcm90bykge1xuICAgIGlmICh0eXBlb2YgQ3RvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgQ3RvciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIHV0aWwuaW5oZXJpdHMoQ3RvciwgUGFyZW50KTtcblxuICAgIGZvciAodmFyIGtleSBpbiBQYXJlbnQpIHtcbiAgICAgIEN0b3Jba2V5XSA9IFBhcmVudFtrZXldO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcHJvdG8gPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgb2JqID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIEN0b3IucHJvdG90eXBlW2tdID0gb2JqW2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIEN0b3IucHJvdG90eXBlLm1peGluID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgQ3Rvci5wcm90b3R5cGVba2V5XSA9IHZhbHVlO1xuICAgIH07XG5cbiAgICBDdG9yLmV4dGVuZCA9IGN1LmV4dGVuZChDdG9yKTtcbiAgfTtcbn07XG4iLCIvKiFcbiAqIGlzb2JqZWN0IDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pc29iamVjdD5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc09iamVjdChvKSB7XG4gIHJldHVybiBvICE9IG51bGwgJiYgdHlwZW9mIG8gPT09ICdvYmplY3QnICYmICFpc0FycmF5KG8pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBMYXppbHkgcmVxdWlyZWQgbW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ2xhenktY2FjaGUnKShyZXF1aXJlKTtcblxuLyoqXG4gKiBUZW1wb3JhcmlseSByZS1hc3NpZ24gcmVxdWlyZSB0byB0cmljayBicm93c2VyaWZ5IGludG9cbiAqIHJlY29nbml6aW5nIGxhenkgcmVxdWlyZXNcbiAqL1xuXG52YXIgZm4gPSByZXF1aXJlO1xucmVxdWlyZSA9IHV0aWxzO1xucmVxdWlyZSgnZGVmaW5lLXByb3BlcnR5JywgJ2RlZmluZScpO1xucmVxdWlyZSgnaXNvYmplY3QnLCAnaXNPYmonKTtcbnJlcXVpcmUgPSBmbjtcblxuLyoqXG4gKiBFeHBvc2UgYHV0aWxzYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7XG4iLCIvKiFcbiAqIGNvbGxlY3Rpb24tdmlzaXQgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2NvbGxlY3Rpb24tdmlzaXQ+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gY29sbGVjdGlvblZpc2l0KGNvbGxlY3Rpb24sIG1ldGhvZCwgdmFsKSB7XG4gIHZhciByZXN1bHQ7XG5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIChtZXRob2QgaW4gY29sbGVjdGlvbikpIHtcbiAgICByZXN1bHQgPSBjb2xsZWN0aW9uW21ldGhvZF0odmFsKTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICByZXN1bHQgPSB1dGlscy5tYXBWaXNpdChjb2xsZWN0aW9uLCBtZXRob2QsIHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gdXRpbHMudmlzaXQoY29sbGVjdGlvbiwgbWV0aG9kLCB2YWwpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZXR1cm4gY29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBFeHBvc2UgYGNvbGxlY3Rpb25WaXNpdGBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbGxlY3Rpb25WaXNpdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIE1hcCBgdmlzaXRgIG92ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBjb2xsZWN0aW9uYCBUaGUgY29udGV4dCBpbiB3aGljaCB0byBpbnZva2UgYG1ldGhvZGBcbiAqIEBwYXJhbSAge1N0cmluZ30gYG1ldGhvZGAgTmFtZSBvZiB0aGUgbWV0aG9kIHRvIGNhbGwgb24gYGNvbGxlY3Rpb25gXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBhcnJgIEFycmF5IG9mIG9iamVjdHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXBWaXNpdChjb2xsZWN0aW9uLCBtZXRob2QsIGFycikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkIGFuIGFycmF5Jyk7XG4gIH1cblxuICBhcnIuZm9yRWFjaChmdW5jdGlvbiAodmFsKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb2xsZWN0aW9uW21ldGhvZF0odmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXRpbHMudmlzaXQoY29sbGVjdGlvbiwgbWV0aG9kLCB2YWwpO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiLyohXG4gKiBvYmplY3QtdmlzaXQgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L29iamVjdC12aXNpdD5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnaXNvYmplY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB2aXNpdCh0aGlzQXJnLCBtZXRob2QsIHRhcmdldCkge1xuICBpZiAoIWlzT2JqZWN0KHRoaXNBcmcpICYmIHR5cGVvZiB0aGlzQXJnICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdvYmplY3QtdmlzaXQgZXhwZWN0cyBgdGhpc0FyZ2AgdG8gYmUgYW4gb2JqZWN0LicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtZXRob2QgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdvYmplY3QtdmlzaXQgZXhwZWN0cyBgbWV0aG9kYCB0byBiZSBhIHN0cmluZycpO1xuICB9XG5cbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpICYmIHR5cGVvZiB0aGlzQXJnICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdvYmplY3QtdmlzaXQgZXhwZWN0cyBgdGFyZ2V0YCB0byBiZSBhbiBvYmplY3QuJyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gdGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0aGlzQXJnW21ldGhvZF0oa2V5LCB0YXJnZXRba2V5XSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzQXJnO1xufTtcbiIsIi8qIVxuICogaXNvYmplY3QgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzb2JqZWN0PlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0J1xuICAgICYmICFBcnJheS5pc0FycmF5KHZhbCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCdsYXp5LWNhY2hlJykocmVxdWlyZSk7XG5yZXF1aXJlID0gdXRpbHM7IC8vIGZvb2wgYnJvd3NlcmlmeVxucmVxdWlyZSgnb2JqZWN0LXZpc2l0JywgJ3Zpc2l0Jyk7XG5cbi8qKlxuICogRXhwb3NlIHV0aWxzXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscztcbiIsIi8qIVxuICogb2JqZWN0LXZpc2l0IDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9vYmplY3QtdmlzaXQ+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2lzb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdmlzaXQodGhpc0FyZywgbWV0aG9kLCB0YXJnZXQpIHtcbiAgaWYgKCFpc09iamVjdCh0aGlzQXJnKSAmJiB0eXBlb2YgdGhpc0FyZyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignb2JqZWN0LXZpc2l0IGV4cGVjdHMgYHRoaXNBcmdgIHRvIGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbWV0aG9kICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignb2JqZWN0LXZpc2l0IGV4cGVjdHMgYG1ldGhvZGAgbmFtZSB0byBiZSBhIHN0cmluZycpO1xuICB9XG5cbiAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gdGFyZ2V0KSB7XG4gICAgdGhpc0FyZ1ttZXRob2RdKGtleSwgdGFyZ2V0W2tleV0pO1xuICB9XG4gIHJldHVybiB0aGlzQXJnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBMYXppbHkgcmVxdWlyZWQgbW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ2xhenktY2FjaGUnKShyZXF1aXJlKTtcbnJlcXVpcmUgPSB1dGlsczsgLy8gdHJpY2sgYnJvd3NlcmlmeVxucmVxdWlyZSgnbWFwLXZpc2l0Jyk7XG5yZXF1aXJlKCdvYmplY3QtdmlzaXQnLCAndmlzaXQnKTtcblxuLyoqXG4gKiBFeHBvc2UgYHV0aWxzYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7XG4iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICBmdW5jdGlvbiBvbigpIHtcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCIvKiFcbiAqIGRlZmluZS1wcm9wZXJ0eSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvZGVmaW5lLXByb3BlcnR5PlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNEZXNjcmlwdG9yID0gcmVxdWlyZSgnaXMtZGVzY3JpcHRvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgdmFsKSB7XG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBwcm9wICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkIGBwcm9wYCB0byBiZSBhIHN0cmluZy4nKTtcbiAgfVxuXG4gIGlmIChpc0Rlc2NyaXB0b3IodmFsKSAmJiAoJ3NldCcgaW4gdmFsIHx8ICdnZXQnIGluIHZhbCkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgdmFsKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiB2YWxcbiAgfSk7XG59O1xuIiwiLyohXG4gKiBpcy1kZXNjcmlwdG9yIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pcy1kZXNjcmlwdG9yPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNEZXNjcmlwdG9yKG9iaikge1xuICBpZiAodXRpbHMudHlwZU9mKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gIGlmICgndmFsdWUnIGluIG9iaikgcmV0dXJuIHV0aWxzLmlzRGF0YShvYmopO1xuICByZXR1cm4gdXRpbHMuaXNBY2Nlc3NvcihvYmopO1xufTtcbiIsIi8qIVxuICogaXMtYWNjZXNzb3ItZGVzY3JpcHRvciA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtYWNjZXNzb3ItZGVzY3JpcHRvcj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vLyBhY2Nlc3NvciBkZXNjcmlwdG9yIHByb3BlcnRpZXNcbnZhciBhY2Nlc3NvciA9IHtcbiAgZ2V0OiAnZnVuY3Rpb24nLFxuICBzZXQ6ICdmdW5jdGlvbicsXG4gIGNvbmZpZ3VyYWJsZTogJ2Jvb2xlYW4nLFxuICBlbnVtZXJhYmxlOiAnYm9vbGVhbidcbn07XG5cbmZ1bmN0aW9uIGlzQWNjZXNzb3JEZXNjcmlwdG9yKG9iaikge1xuICBpZiAodXRpbHMudHlwZU9mKG9iaikgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGFjY2Vzc29yS2V5cyA9IE9iamVjdC5rZXlzKGFjY2Vzc29yKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKG9iaik7XG5cbiAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eSgnc2V0JykpIHtcbiAgICBpZiAodXRpbHMudHlwZU9mKG9iai5zZXQpICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eSgnZ2V0JykpIHtcbiAgICBpZiAodXRpbHMudHlwZU9mKG9iai5nZXQpICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKHV0aWxzLmRpZmYoa2V5cywgYWNjZXNzb3JLZXlzKS5sZW5ndGggIT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGtleSA9PT0gJ3ZhbHVlJykgY29udGludWU7XG4gICAgaWYgKHV0aWxzLnR5cGVPZihvYmpba2V5XSkgIT09IGFjY2Vzc29yW2tleV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2V0IG9iamVjdCBrZXlzLiBgT2JqZWN0LmtleXMoKWAgb25seSBnZXRzXG4gKiBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cblxuZnVuY3Rpb24gZ2V0S2V5cyhvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gIHJldHVybiBrZXlzO1xufVxuXG4vKipcbiAqIEV4cG9zZSBgaXNBY2Nlc3NvckRlc2NyaXB0b3JgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FjY2Vzc29yRGVzY3JpcHRvcjtcbiIsIi8qIVxuICogYXJyLWRpZmYgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2Fyci1kaWZmPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCBKb24gU2NobGlua2VydCwgY29udHJpYnV0b3JzLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZmxhdHRlbiA9IHJlcXVpcmUoJ2Fyci1mbGF0dGVuJyk7XG52YXIgc2xpY2UgPSByZXF1aXJlKCdhcnJheS1zbGljZScpO1xuXG4vKipcbiAqIFJldHVybiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBmaXJzdCBhcnJheSBhbmRcbiAqIGFkZGl0aW9uYWwgYXJyYXlzLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgZGlmZiA9IHJlcXVpcmUoJ3slPSBuYW1lICV9Jyk7XG4gKlxuICogdmFyIGEgPSBbJ2EnLCAnYicsICdjJywgJ2QnXTtcbiAqIHZhciBiID0gWydiJywgJ2MnXTtcbiAqXG4gKiBjb25zb2xlLmxvZyhkaWZmKGEsIGIpKVxuICogLy89PiBbJ2EnLCAnZCddXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gYGFgXG4gKiBAcGFyYW0gIHtBcnJheX0gYGJgXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlmZihhcnIsIGFycmF5cykge1xuICB2YXIgYXJnc0xlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoLCBpID0gLTE7XG4gIHZhciByZXMgPSBbXSwgYXJyYXlzO1xuXG4gIGlmIChhcmdzTGVuID09PSAxKSB7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIGlmIChhcmdzTGVuID4gMikge1xuICAgIGFycmF5cyA9IGZsYXR0ZW4oc2xpY2UoYXJndW1lbnRzLCAxKSk7XG4gIH1cblxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgaWYgKCF+YXJyYXlzLmluZGV4T2YoYXJyW2ldKSkge1xuICAgICAgcmVzLnB1c2goYXJyW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuLyoqXG4gKiBFeHBvc2UgYGRpZmZgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBkaWZmO1xuIiwiLyohXG4gKiBhcnItZmxhdHRlbiA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvYXJyLWZsYXR0ZW4+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmbGF0dGVuKGFycikge1xuICByZXR1cm4gZmxhdChhcnIsIFtdKTtcbn07XG5cbmZ1bmN0aW9uIGZsYXQoYXJyLCByZXMpIHtcbiAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gIHZhciBpID0gLTE7XG5cbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgdmFyIGN1ciA9IGFyclsrK2ldO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGN1cikpIHtcbiAgICAgIGZsYXQoY3VyLCByZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMucHVzaChjdXIpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufSIsIi8qIVxuICogYXJyYXktc2xpY2UgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2FycmF5LXNsaWNlPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2xpY2UoYXJyLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoID4+PiAwO1xuICB2YXIgcmFuZ2UgPSBbXTtcblxuICBzdGFydCA9IGlkeChhcnIsIHN0YXJ0KTtcbiAgZW5kID0gaWR4KGFyciwgZW5kLCBsZW4pO1xuXG4gIHdoaWxlIChzdGFydCA8IGVuZCkge1xuICAgIHJhbmdlLnB1c2goYXJyW3N0YXJ0KytdKTtcbiAgfVxuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5cbmZ1bmN0aW9uIGlkeChhcnIsIHBvcywgZW5kKSB7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoID4+PiAwO1xuXG4gIGlmIChwb3MgPT0gbnVsbCkge1xuICAgIHBvcyA9IGVuZCB8fCAwO1xuICB9IGVsc2UgaWYgKHBvcyA8IDApIHtcbiAgICBwb3MgPSBNYXRoLm1heChsZW4gKyBwb3MsIDApO1xuICB9IGVsc2Uge1xuICAgIHBvcyA9IE1hdGgubWluKHBvcywgbGVuKTtcbiAgfVxuXG4gIHJldHVybiBwb3M7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIExhemlseSByZXF1aXJlZCBtb2R1bGUgZGVwZW5kZW5jaWVzXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnbGF6eS1jYWNoZScpKHJlcXVpcmUpO1xuXG4vKipcbiAqIFRlbXBvcmFyaWx5IHJlLWFzc2lnbiByZXF1aXJlIHRvIHRyaWNrIGJyb3dzZXJpZnkgaW50b1xuICogcmVjb2duaXppbmcgbGF6eSByZXF1aXJlc1xuICovXG5cbnZhciBmbiA9IHJlcXVpcmU7XG5yZXF1aXJlID0gdXRpbHM7XG5yZXF1aXJlKCdhcnItZGlmZicsICdkaWZmJyk7XG5yZXF1aXJlKCdraW5kLW9mJywgJ3R5cGVPZicpO1xucmVxdWlyZSA9IGZuO1xuXG4vKipcbiAqIEV4cG9zZSBgdXRpbHNgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscztcbiIsIi8qIVxuICogaXMtZGF0YS1kZXNjcmlwdG9yIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pcy1kYXRhLWRlc2NyaXB0b3I+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuLy8gZGF0YSBkZXNjcmlwdG9yIHByb3BlcnRpZXNcbnZhciBkYXRhID0ge1xuICBjb25maWd1cmFibGU6ICdib29sZWFuJyxcbiAgZW51bWVyYWJsZTogJ2Jvb2xlYW4nLFxuICB3cml0YWJsZTogJ2Jvb2xlYW4nXG59O1xuXG5mdW5jdGlvbiBpc0RhdGFEZXNjcmlwdG9yKG9iaikge1xuICBpZiAodXRpbHMudHlwZU9mKG9iaikgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGRhdGFLZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhvYmopO1xuXG4gIGlmIChvYmouaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcbiAgICBpZiAodXRpbHMuZGlmZihrZXlzLCBkYXRhS2V5cykubGVuZ3RoICE9PSAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChrZXkgPT09ICd2YWx1ZScpIGNvbnRpbnVlO1xuICAgICAgaWYgKHV0aWxzLnR5cGVPZihvYmpba2V5XSkgIT09IGRhdGFba2V5XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldCBvYmplY3Qga2V5cy4gYE9iamVjdC5rZXlzKClgIG9ubHkgZ2V0c1xuICogZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICovXG5cbmZ1bmN0aW9uIGdldEtleXMob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICByZXR1cm4ga2V5cztcbn1cblxuLyoqXG4gKiBFeHBvc2UgYGlzRGF0YURlc2NyaXB0b3JgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBpc0RhdGFEZXNjcmlwdG9yO1xuIiwidmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJyk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIEdldCB0aGUgbmF0aXZlIGB0eXBlb2ZgIGEgdmFsdWUuXG4gKlxuICogQHBhcmFtICB7Kn0gYHZhbGBcbiAqIEByZXR1cm4geyp9IE5hdGl2ZSBqYXZhc2NyaXB0IHR5cGVcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtpbmRPZih2YWwpIHtcbiAgLy8gcHJpbWl0aXZpZXNcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICB9XG4gIGlmICh2YWwgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh2YWwgPT09IHRydWUgfHwgdmFsID09PSBmYWxzZSB8fCB2YWwgaW5zdGFuY2VvZiBCb29sZWFuKSB7XG4gICAgcmV0dXJuICdib29sZWFuJztcbiAgfVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgcmV0dXJuICdzdHJpbmcnO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJyB8fCB2YWwgaW5zdGFuY2VvZiBOdW1iZXIpIHtcbiAgICByZXR1cm4gJ251bWJlcic7XG4gIH1cblxuICAvLyBmdW5jdGlvbnNcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgfHwgdmFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIC8vIGFycmF5XG4gIGlmICh0eXBlb2YgQXJyYXkuaXNBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICAvLyBjaGVjayBmb3IgaW5zdGFuY2VzIG9mIFJlZ0V4cCBhbmQgRGF0ZSBiZWZvcmUgY2FsbGluZyBgdG9TdHJpbmdgXG4gIGlmICh2YWwgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gIH1cbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICByZXR1cm4gJ2RhdGUnO1xuICB9XG5cbiAgLy8gb3RoZXIgb2JqZWN0c1xuICB2YXIgdHlwZSA9IHRvU3RyaW5nLmNhbGwodmFsKTtcblxuICBpZiAodHlwZSA9PT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdbb2JqZWN0IERhdGVdJykge1xuICAgIHJldHVybiAnZGF0ZSc7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nKSB7XG4gICAgcmV0dXJuICdhcmd1bWVudHMnO1xuICB9XG5cbiAgLy8gYnVmZmVyXG4gIGlmICh0eXBlb2YgQnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiBpc0J1ZmZlcih2YWwpKSB7XG4gICAgcmV0dXJuICdidWZmZXInO1xuICB9XG5cbiAgLy8gZXM2OiBNYXAsIFdlYWtNYXAsIFNldCwgV2Vha1NldFxuICBpZiAodHlwZSA9PT0gJ1tvYmplY3QgU2V0XScpIHtcbiAgICByZXR1cm4gJ3NldCc7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdbb2JqZWN0IFdlYWtTZXRdJykge1xuICAgIHJldHVybiAnd2Vha3NldCc7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdbb2JqZWN0IE1hcF0nKSB7XG4gICAgcmV0dXJuICdtYXAnO1xuICB9XG4gIGlmICh0eXBlID09PSAnW29iamVjdCBXZWFrTWFwXScpIHtcbiAgICByZXR1cm4gJ3dlYWttYXAnO1xuICB9XG4gIGlmICh0eXBlID09PSAnW29iamVjdCBTeW1ib2xdJykge1xuICAgIHJldHVybiAnc3ltYm9sJztcbiAgfVxuXG4gIC8vIG11c3QgYmUgYSBwbGFpbiBvYmplY3RcbiAgcmV0dXJuICdvYmplY3QnO1xufTtcbiIsIi8qKlxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBCdWZmZXJcbiAqXG4gKiBBdXRob3I6ICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIExpY2Vuc2U6ICBNSVRcbiAqXG4gKiBgbnBtIGluc3RhbGwgaXMtYnVmZmVyYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gISEob2JqICE9IG51bGwgJiZcbiAgICAob2JqLl9pc0J1ZmZlciB8fCAvLyBGb3IgU2FmYXJpIDUtNyAobWlzc2luZyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yKVxuICAgICAgKG9iai5jb25zdHJ1Y3RvciAmJlxuICAgICAgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iaikpXG4gICAgKSlcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBMYXppbHkgcmVxdWlyZWQgbW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ2xhenktY2FjaGUnKShyZXF1aXJlKTtcblxuLyoqXG4gKiBUZW1wb3JhcmlseSByZS1hc3NpZ24gcmVxdWlyZSB0byB0cmljayBicm93c2VyaWZ5IGludG9cbiAqIHJlY29nbml6aW5nIGxhenkgcmVxdWlyZXNcbiAqL1xuXG52YXIgZm4gPSByZXF1aXJlO1xucmVxdWlyZSA9IHV0aWxzO1xucmVxdWlyZSgna2luZC1vZicsICd0eXBlT2YnKTtcbnJlcXVpcmUoJ2lzLWFjY2Vzc29yLWRlc2NyaXB0b3InLCAnaXNBY2Nlc3NvcicpO1xucmVxdWlyZSgnaXMtZGF0YS1kZXNjcmlwdG9yJywgJ2lzRGF0YScpO1xucmVxdWlyZSA9IGZuO1xuXG4vKipcbiAqIEV4cG9zZSBgdXRpbHNgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscztcbiIsIi8qIVxuICogZ2V0LXZhbHVlIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9nZXQtdmFsdWU+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIG5vbmNoYXJhY3RlcnMgPSByZXF1aXJlKCdub25jaGFyYWN0ZXJzJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCdpcy1leHRlbmRhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VmFsdWUob2JqLCBzdHIsIGZuKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIHt9O1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiBvYmo7XG5cbiAgdmFyIHBhdGg7XG5cbiAgaWYgKGZuICYmIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHBhdGggPSBmbihzdHIpO1xuICB9IGVsc2UgaWYgKGZuID09PSB0cnVlKSB7XG4gICAgcGF0aCA9IGVzY2FwZVBhdGgoc3RyKTtcbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gc3RyLnNwbGl0KC9bWy5cXF1dLykuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgdmFyIGxlbiA9IHBhdGgubGVuZ3RoLCBpID0gLTE7XG4gIHZhciBsYXN0ID0gbnVsbDtcblxuICB3aGlsZSgrK2kgPCBsZW4pIHtcbiAgICB2YXIga2V5ID0gcGF0aFtpXTtcbiAgICBsYXN0ID0gb2JqW2tleV07XG4gICAgaWYgKCFsYXN0KSB7IHJldHVybiBsYXN0OyB9XG5cbiAgICBpZiAoaXNPYmplY3Qob2JqKSkge1xuICAgICAgb2JqID0gbGFzdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxhc3Q7XG59O1xuXG5cbmZ1bmN0aW9uIGVzY2FwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5zcGxpdCgnXFxcXC4nKS5qb2luKG5vbmNoYXJhY3RlcnNbMF0pO1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5zcGxpdChub25jaGFyYWN0ZXJzWzBdKS5qb2luKCcuJyk7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZVBhdGgoc3RyKSB7XG4gIHJldHVybiBlc2NhcGUoc3RyKS5zcGxpdCgnLicpLm1hcChmdW5jdGlvbiAoc2VnKSB7XG4gICAgcmV0dXJuIHVuZXNjYXBlKHNlZyk7XG4gIH0pO1xufVxuIiwiLyohXG4gKiBpcy1leHRlbmRhYmxlIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pcy1leHRlbmRhYmxlPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRXh0ZW5kYWJsZSh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnICYmIHZhbCAhPT0gbnVsbFxuICAgICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKTtcbn07XG4iLCIvKiFcbiAqIG5vbmNoYXJhY3RlcnMgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L25vbmNoYXJhY3RlcnM+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gW1xuICAnXFx1RkZGRicsXG4gICdcXHVGRkZFJyxcblxuICAnXFx1RkREMScsXG4gICdcXHVGREQyJyxcbiAgJ1xcdUZERDMnLFxuICAnXFx1RkRENCcsXG4gICdcXHVGREQ1JyxcbiAgJ1xcdUZERDYnLFxuICAnXFx1RkRENycsXG4gICdcXHVGREQ4JyxcbiAgJ1xcdUZERDknLFxuICAnXFx1RkREQScsXG4gICdcXHVGRERCJyxcbiAgJ1xcdUZEREMnLFxuICAnXFx1RkRERCcsXG4gICdcXHVGRERFJyxcbiAgJ1xcdUZEREYnLFxuICAnXFx1RkRFMCcsXG4gICdcXHVGREUxJyxcbiAgJ1xcdUZERTInLFxuICAnXFx1RkRFMycsXG4gICdcXHVGREU0JyxcbiAgJ1xcdUZERTUnLFxuICAnXFx1RkRFNicsXG4gICdcXHVGREU3JyxcbiAgJ1xcdUZERTgnLFxuICAnXFx1RkRFOScsXG4gICdcXHVGREVBJyxcbiAgJ1xcdUZERUInLFxuICAnXFx1RkRFQycsXG4gICdcXHVGREVEJyxcbiAgJ1xcdUZERUUnLFxuICAnXFx1RkRFRidcbl07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2FjaGUgcmVzdWx0cyBvZiB0aGUgZmlyc3QgZnVuY3Rpb24gY2FsbCB0byBlbnN1cmUgb25seSBjYWxsaW5nIG9uY2UuXG4gKlxuICogYGBganNcbiAqIHZhciBsYXp5ID0gcmVxdWlyZSgnbGF6eS1jYWNoZScpKHJlcXVpcmUpO1xuICogLy8gY2FjaGUgdGhlIGNhbGwgdG8gYHJlcXVpcmUoJ2Fuc2kteWVsbG93JylgXG4gKiBsYXp5KCdhbnNpLXllbGxvdycsICd5ZWxsb3cnKTtcbiAqIC8vIHVzZSBgYW5zaS15ZWxsb3dgXG4gKiBjb25zb2xlLmxvZyhsYXp5LnllbGxvdygndGhpcyBpcyB5ZWxsb3cnKSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gYGZuYCBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIG9ubHkgb25jZS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBGdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgdG8gZ2V0IHRoZSBjYWNoZWQgZnVuY3Rpb25cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbGF6eUNhY2hlKGZuKSB7XG4gIHZhciBjYWNoZSA9IHt9O1xuICB2YXIgcHJveHkgPSBmdW5jdGlvbiAobW9kLCBuYW1lKSB7XG4gICAgbmFtZSA9IG5hbWUgfHwgY2FtZWxjYXNlKG1vZCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3h5LCBuYW1lLCB7XG4gICAgICBnZXQ6IGdldHRlclxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZ2V0dGVyICgpIHtcbiAgICAgIGlmIChjYWNoZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICByZXR1cm4gY2FjaGVbbmFtZV07XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gKGNhY2hlW25hbWVdID0gZm4obW9kKSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgZXJyLm1lc3NhZ2UgPSAnbGF6eS1jYWNoZSAnICsgZXJyLm1lc3NhZ2UgKyAnICcgKyBfX2ZpbGVuYW1lO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gZ2V0dGVyO1xuICB9O1xuICByZXR1cm4gcHJveHk7XG59XG5cbi8qKlxuICogVXNlZCB0byBjYW1lbGNhc2UgdGhlIG5hbWUgdG8gYmUgc3RvcmVkIG9uIHRoZSBgbGF6eWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmAgU3RyaW5nIGNvbnRhaW5pbmcgYF9gLCBgLmAsIGAtYCBvciB3aGl0ZXNwYWNlIHRoYXQgd2lsbCBiZSBjYW1lbGNhc2VkLlxuICogQHJldHVybiB7U3RyaW5nfSBjYW1lbGNhc2VkIHN0cmluZy5cbiAqL1xuXG5mdW5jdGlvbiBjYW1lbGNhc2Uoc3RyKSB7XG4gIGlmIChzdHIubGVuZ3RoID09PSAxKSB7IHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTsgfVxuICBzdHIgPSBzdHIucmVwbGFjZSgvXltcXFdfXSt8W1xcV19dKyQvZywgJycpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvW1xcV19dKyhcXHd8JCkvZywgZnVuY3Rpb24gKF8sIGNoKSB7XG4gICAgcmV0dXJuIGNoLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEV4cG9zZSBgbGF6eUNhY2hlYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gbGF6eUNhY2hlO1xuIiwiLyohXG4gKiBzZXQtdmFsdWUgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L3NldC12YWx1ZT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCdpc29iamVjdCcpO1xudmFyIG5jID0gcmVxdWlyZSgnbm9uY2hhcmFjdGVycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldFZhbHVlKG9iaiwgcGF0aCwgdmFsKSB7XG4gIGlmIChwYXRoID09IG51bGwpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG4gIHBhdGggPSBlc2NhcGUocGF0aCk7XG4gIHZhciBzZWcgPSAoL14oLispXFwuKC4rKSQvKS5leGVjKHBhdGgpO1xuICBpZiAoc2VnICE9PSBudWxsKSB7XG4gICAgY3JlYXRlKG9iaiwgc2VnWzFdLCBzZWdbMl0sIHZhbCk7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuICBvYmpbdW5lc2NhcGUocGF0aCldID0gdmFsO1xuICByZXR1cm4gb2JqO1xufTtcblxuZnVuY3Rpb24gY3JlYXRlKG9iaiwgcGF0aCwgY2hpbGQsIHZhbCkge1xuICBpZiAoIXBhdGgpIHJldHVybiBvYmo7XG4gIHZhciBhcnIgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoLCBpID0gMDtcbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgdmFyIGtleSA9IHVuZXNjYXBlKGFycltpKytdKTtcbiAgICBpZiAoIW9ialtrZXldIHx8ICFpc09iamVjdChvYmpba2V5XSkpIHtcbiAgICAgIG9ialtrZXldID0ge307XG4gICAgfVxuICAgIG9iaiA9IG9ialtrZXldO1xuICB9XG4gIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgY2hpbGQgPSB1bmVzY2FwZShjaGlsZCk7XG4gIH1cbiAgcmV0dXJuIChvYmpbY2hpbGRdID0gdmFsKTtcbn1cblxuLyoqXG4gKiBFc2NhcGUgPT4gYFxcXFwuYFxuICovXG5mdW5jdGlvbiBlc2NhcGUoc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQoJ1xcXFwuJykuam9pbihuY1sxXSk7XG59XG5cbi8qKlxuICogVW5lc2NhcGVkIGRvdHNcbiAqL1xuZnVuY3Rpb24gdW5lc2NhcGUoc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQobmNbMV0pLmpvaW4oJy4nKTtcbn1cblxuIiwiLyohXG4gKiB1bnNldC12YWx1ZSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvdW5zZXQtdmFsdWU+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2lzb2JqZWN0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnaGFzLXZhbHVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdW5zZXQob2JqLCBwcm9wKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkIGFuIG9iamVjdC4nKTtcbiAgfVxuICBpZiAoaGFzKG9iaiwgcHJvcCkpIHtcbiAgICB2YXIgc2VncyA9IHByb3Auc3BsaXQoJy4nKTtcbiAgICB2YXIgbGFzdCA9IHNlZ3MucG9wKCk7XG4gICAgd2hpbGUgKHByb3AgPSBzZWdzLnNoaWZ0KCkpIHtcbiAgICAgIG9iaiA9IG9ialtwcm9wXTtcbiAgICB9XG4gICAgcmV0dXJuIChkZWxldGUgb2JqW2xhc3RdKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvKiFcbiAqIGhhcy12YWx1ZSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaGFzLXZhbHVlPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBnZXQgPSByZXF1aXJlKCdnZXQtdmFsdWUnKTtcbnZhciBoYXNWYWx1ZXMgPSByZXF1aXJlKCdoYXMtdmFsdWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG8sIHBhdGgsIGZuKSB7XG4gIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAobGVuID09PSAxIHx8IChsZW4gPT09IDIgJiYgdHlwZW9mIHBhdGggPT09ICdib29sZWFuJykpIHtcbiAgICByZXR1cm4gaGFzVmFsdWVzLmFwcGx5KGhhc1ZhbHVlcywgYXJndW1lbnRzKTtcbiAgfVxuICBpZiAobGVuID09PSAzICYmIHR5cGVvZiBmbiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGhhc1ZhbHVlcyhnZXQuYXBwbHkoZ2V0LCBhcmd1bWVudHMpLCBmbik7XG4gIH1cbiAgcmV0dXJuIGhhc1ZhbHVlcyhnZXQuYXBwbHkoZ2V0LCBhcmd1bWVudHMpKTtcbn07XG4iLCIvKiFcbiAqIGhhcy12YWx1ZXMgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2hhcy12YWx1ZXM+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNWYWx1ZShvLCBub1plcm8pIHtcbiAgaWYgKG8gPT09IG51bGwgfHwgbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAobyA9PT0gMCAmJiBub1plcm8gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoby5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBvLmxlbmd0aCAhPT0gMDtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBvKSB7XG4gICAgaWYgKG8uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTGF6aWx5IHJlcXVpcmVkIG1vZHVsZSBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCdsYXp5LWNhY2hlJykocmVxdWlyZSk7XG52YXIgZm4gPSByZXF1aXJlO1xucmVxdWlyZSA9IHV0aWxzO1xucmVxdWlyZSgnc2V0LXZhbHVlJywgJ3NldCcpO1xucmVxdWlyZSgnZ2V0LXZhbHVlJywgJ2dldCcpO1xucmVxdWlyZSgndW5zZXQtdmFsdWUnLCAnZGVsJyk7XG5yZXF1aXJlKCdjb2xsZWN0aW9uLXZpc2l0JywgJ3Zpc2l0Jyk7XG5yZXF1aXJlKCdkZWZpbmUtcHJvcGVydHknLCAnZGVmaW5lJyk7XG5yZXF1aXJlKCdjb21wb25lbnQtZW1pdHRlcicsICdFbWl0dGVyJyk7XG5yZXF1aXJlKCdjbGFzcy11dGlscycsICdjdScpO1xucmVxdWlyZSA9IGZuO1xuXG4vKipcbiAqIEV4cG9zZSBgdXRpbHNgIG1vZHVsZXNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzO1xuIiwiLyohXG4gKiBiYXNlLW9wdGlvbnMgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2Jhc2Utb3B0aW9ucz5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9wdGlvbihhcHApIHtcbiAgYXBwLm1peGluKCdvcHRpb24nLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zIHx8IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gdXRpbHMuZ2V0KHRoaXMub3B0aW9ucywga2V5KTtcbiAgICAgIH1cbiAgICAgIHV0aWxzLnNldCh0aGlzLm9wdGlvbnMsIGtleSwgdmFsdWUpO1xuICAgICAgdGhpcy5lbWl0KCdvcHRpb24nLCBrZXksIHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT0gbnVsbCB8fCB0eXBlb2Yga2V5ICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgYSBzdHJpbmcgb3Igb2JqZWN0LicpO1xuICAgIH1cblxuICAgIHRoaXMudmlzaXQoJ29wdGlvbicsIGtleSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDYWNoZSByZXN1bHRzIG9mIHRoZSBmaXJzdCBmdW5jdGlvbiBjYWxsIHRvIGVuc3VyZSBvbmx5IGNhbGxpbmcgb25jZS5cbiAqXG4gKiBgYGBqc1xuICogdmFyIGxhenkgPSByZXF1aXJlKCdsYXp5LWNhY2hlJykocmVxdWlyZSk7XG4gKiAvLyBjYWNoZSB0aGUgY2FsbCB0byBgcmVxdWlyZSgnYW5zaS15ZWxsb3cnKWBcbiAqIGxhenkoJ2Fuc2kteWVsbG93JywgJ3llbGxvdycpO1xuICogLy8gdXNlIGBhbnNpLXllbGxvd2BcbiAqIGNvbnNvbGUubG9nKGxhenkueWVsbG93KCd0aGlzIGlzIHllbGxvdycpKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBgZm5gIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgb25seSBvbmNlLlxuICogQHJldHVybiB7RnVuY3Rpb259IEZ1bmN0aW9uIHRoYXQgY2FuIGJlIGNhbGxlZCB0byBnZXQgdGhlIGNhY2hlZCBmdW5jdGlvblxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBsYXp5Q2FjaGUoZm4pIHtcbiAgdmFyIGNhY2hlID0ge307XG4gIHZhciBwcm94eSA9IGZ1bmN0aW9uIChtb2QsIG5hbWUpIHtcbiAgICBuYW1lID0gbmFtZSB8fCBjYW1lbGNhc2UobW9kKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJveHksIG5hbWUsIHtcbiAgICAgIGdldDogZ2V0dGVyXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBnZXR0ZXIgKCkge1xuICAgICAgaWYgKGNhY2hlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBjYWNoZVtuYW1lXTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiAoY2FjaGVbbmFtZV0gPSBmbihtb2QpKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBlcnIubWVzc2FnZSA9ICdsYXp5LWNhY2hlICcgKyBlcnIubWVzc2FnZSArICcgJyArIF9fZmlsZW5hbWU7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBnZXR0ZXI7XG4gIH07XG4gIHJldHVybiBwcm94eTtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIGNhbWVsY2FzZSB0aGUgbmFtZSB0byBiZSBzdG9yZWQgb24gdGhlIGBsYXp5YCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBgc3RyYCBTdHJpbmcgY29udGFpbmluZyBgX2AsIGAuYCwgYC1gIG9yIHdoaXRlc3BhY2UgdGhhdCB3aWxsIGJlIGNhbWVsY2FzZWQuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGNhbWVsY2FzZWQgc3RyaW5nLlxuICovXG5cbmZ1bmN0aW9uIGNhbWVsY2FzZShzdHIpIHtcbiAgaWYgKHN0ci5sZW5ndGggPT09IDEpIHsgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpOyB9XG4gIHN0ciA9IHN0ci5yZXBsYWNlKC9eW1xcV19dK3xbXFxXX10rJC9nLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFxXX10rKFxcd3wkKS9nLCBmdW5jdGlvbiAoXywgY2gpIHtcbiAgICByZXR1cm4gY2gudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59XG5cbi8qKlxuICogRXhwb3NlIGBsYXp5Q2FjaGVgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBsYXp5Q2FjaGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTGF6aWx5IHJlcXVpcmVkIG1vZHVsZSBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgbGF6eSA9IHJlcXVpcmUoJ2xhenktY2FjaGUnKShyZXF1aXJlKTtcbnZhciBmbiA9IHJlcXVpcmU7XG5cbnJlcXVpcmUgPSBsYXp5O1xucmVxdWlyZSgnc2V0LXZhbHVlJywgJ3NldCcpO1xucmVxdWlyZSgnZ2V0LXZhbHVlJywgJ2dldCcpO1xucmVxdWlyZSA9IGZuO1xuXG4vKipcbiAqIEV4cG9zZSBgbGF6eWAgbW9kdWxlc1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gbGF6eTtcbiIsIi8qIVxuICogYmFzZS1wbHVnaW5zIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9iYXNlLXBsdWdpbnM+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG4gIGlmICghdGhpcy5wbHVnaW5zKSB7XG4gICAgdGhpcy5kZWZpbmUoJ3BsdWdpbnMnLCBbXSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGEgcGx1Z2luIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBpbW1lZGlhdGVseSB1cG9uIGluaXQuXG4gICAqIFRoZSBvbmx5IHBhcmFtZXRlciBleHBvc2VkIHRvIHRoZSBwbHVnaW4gaXMgdGhlIGFwcGxpY2F0aW9uXG4gICAqIGluc3RhbmNlLlxuICAgKlxuICAgKiBBbHNvLCBpZiBhIHBsdWdpbiByZXR1cm5zIGEgZnVuY3Rpb24sIHRoZSBmdW5jdGlvbiB3aWxsIGJlIHB1c2hlZFxuICAgKiBvbnRvIHRoZSBgcGx1Z2luc2AgYXJyYXksIGFsbG93aW5nIHRoZSBwbHVnaW4gdG8gYmUgY2FsbGVkIGF0IGFcbiAgICogbGF0ZXIgcG9pbnQsIGVsc2V3aGVyZSBpbiB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIC8vIGRlZmluZSBhIHBsdWdpblxuICAgKiBmdW5jdGlvbiBmb28oYXBwKSB7XG4gICAqICAgLy8gZG8gc3R1ZmZcbiAgICogfVxuICAgKlxuICAgKiAvLyByZWdpc3RlciBwbHVnaW5zXG4gICAqIHZhciBhcHAgPSBuZXcgQmFzZSgpXG4gICAqICAgLnVzZShmb28pXG4gICAqICAgLnVzZShiYXIpXG4gICAqICAgLnVzZShiYXopXG4gICAqIGBgYFxuICAgKiBAbmFtZSAudXNlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGBmbmAgcGx1Z2luIGZ1bmN0aW9uIHRvIGNhbGxcbiAgICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpdGVtIGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgYXBwLm1peGluKCd1c2UnLCBmdW5jdGlvbihmbikge1xuICAgIHZhciBwbHVnaW4gPSBmbi5jYWxsKHRoaXMsIHRoaXMpO1xuICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnBsdWdpbnMucHVzaChwbHVnaW4pO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdCgndXNlJyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSdW4gYWxsIHBsdWdpbnNcbiAgICpcbiAgICogYGBganNcbiAgICogdmFyIGNvbmZpZyA9IHt9O1xuICAgKiBhcHAucnVuKGNvbmZpZyk7XG4gICAqIGBgYFxuICAgKiBAbmFtZSAucnVuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBgdmFsdWVgIE9iamVjdCB0byBiZSBtb2RpZmllZCBieSBwbHVnaW5zLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgdGhlIGl0ZW0gaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBhcHAubWl4aW4oJ3J1bicsIGZ1bmN0aW9uKHZhbCkge1xuICAgIHRoaXMucGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHR5cGVvZiB2YWwudXNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbC51c2UoZm4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm4uY2FsbCh2YWwsIHZhbCk7XG4gICAgICAgIGFwcC5lbWl0KCd1c2UnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG59O1xuIl19
