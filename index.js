/*!
 * cyborg <https://github.com/jonschlinkert/cyborg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var base = require('base-methods');
var plugin = require('base-plugins');
var option = require('base-options');

var Base = base.namespace('cache');

function Cyborg(options) {
  if (!(this instanceof Cyborg)) {
    return new Cyborg(options);
  }
  Base.call(this);
  this.options = options || {};
  this.use(option);
  this.use(plugin);
}

Base.extend(Cyborg);

module.exports = Cyborg;
