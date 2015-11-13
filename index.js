/*!
 * cyborg <https://github.com/jonschlinkert/cyborg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var path = require('path');
var base = require('base-methods');
var utils = require('./lib/utils');

var Base = base.namespace('cache');

function Cyborg(options) {
  if (!(this instanceof Cyborg)) {
    return new Cyborg(options);
  }
  Base.call(this);
  this.options = options || {};
  this.define('providers', {});
  this.use(utils.use);
  this.use(utils.option());
  this.use(utils.store('global', {cwd: '~/.cyborg/.datastore'}));
}

Base.extend(Cyborg);

Cyborg.prototype.provider = function(name, fn) {
  this.providers[name] = fn;
};

Cyborg.prototype.resolve = function(dependency, version, cb) {
  if (typeof version === 'function') {
    cb = version;
    version = null;
  }

  var self = this;
  var keys = Object.keys(this.providers);
  var i = 0;

  next();
  function next() {
    var provider = self.providers[keys[i++]];
    if (!provider) return cb();

    provider(dependency, version, function(err, loader) {
      if (err) return cb(err);
      if (loader) return cb(null, loader);
      next();
    });
  }
};

Cyborg.prototype.install = function(dependency, version, cb) {
  if (typeof version === 'function') {
    cb = version;
    version = null;
  }
  var config = {
    dest: path.join(process.cwd(), '.cyborg')
  };

  this.resolve(dependency, version, function(err, installer) {
    if (err) return cb(err);
    if (!installer) {
      return cb(new Error('Unable to resolve a valid installer for ' + dependency + ' ' + (version || '')));
    }
    installer.install(dependency, version, function(err, files) {
      if (err) return cb(err);
      utils.async.each(files, function(file, next) {
        utils.writeFile(path.join(config.dest, dependency, file.path), file.content, next);
      }, cb);
    });
  });
};

Cyborg.prototype.update = function(dependency, version, cb) {};
Cyborg.prototype.save = function(dependency, version, cb) {};

module.exports = Cyborg;
