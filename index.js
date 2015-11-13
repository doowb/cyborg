/*!
 * cyborg <https://github.com/jonschlinkert/cyborg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var base = require('base-methods');
var utils = require('./lib/utils');

var Base = base.namespace('cache');

function Cyborg(options) {
  if (!(this instanceof Cyborg)) {
    return new Cyborg(options);
  }
  Base.call(this);
  this.options = options || {};
  this.use(utils.use);
  this.use(utils.option());
  this.use(utils.store('global', {cwd: '~/.cyborg/.datastore'}));
}

Base.extend(Cyborg);

module.exports = Cyborg;
