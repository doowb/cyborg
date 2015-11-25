/*!
 * cyborg <https://github.com/jonschlinkert/cyborg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var path = require('path');
var base = require('base-methods');

var CyborgStore = require('./lib/cyborg-store');
var utils = require('./lib/utils');
var providers = require('./lib/providers');

var Base = base.namespace('cache');

function Cyborg(options) {
  if (!(this instanceof Cyborg)) {
    return new Cyborg(options);
  }

  Base.call(this);
  this.options = options || {};
  this.use(utils.use);
  this.use(utils.option());
  this.use(providers());
  this.define('manifests', new CyborgStore());
  this.use(utils.store('global', {cwd: '~/.cyborg/.datastore'}));
}

Base.extend(Cyborg);

Cyborg.prototype.addManifest = function(name, manifest) {
  this.manifests.set(utils.escapeKeys(name), manifest);
  return this;
};

Cyborg.prototype.getManifest = function(name) {
  return this.manifests.get(utils.escapeKeys(name));
};

Cyborg.prototype.install = function(src, options, cb) {
  var self = this;

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (typeof src === 'object') {
    return this.installManifest(this.resolveProvider('fs'), src, options, cb);
  }

  var manifestConfig = {
    cwd: src,
    src: this.option('manifestfile') || 'package.json'
  };

  var provider = this.resolveProvider(manifestConfig);
  provider.getManifest(manifestConfig, function(err, manifest) {
    if (err) return cb(err);
    if (utils.isEmpty(manifest)) return cb();
    self.addManifest(src, manifest);
    manifest.cwd = src;
    self.installManifest(provider, manifest, options, cb);
  });
};

Cyborg.prototype.installFiles = function(provider, config, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  var expanded = utils.expand(utils.extend({}, config));
  provider.fetch(expanded, function(err, files) {
    if (err) return cb(err);
    console.log(config.cwd, files);
    console.log();
    cb();
  });
};

Cyborg.prototype.installDependencies = function(dependencies, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  utils.async.eachOf(dependencies, function(dependency, name, next) {
    this.install(dependency, options, next);
  }.bind(this), cb);
};

Cyborg.prototype.installTargets = function(provider, config, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  var targets = config.targets || {};
  utils.async.eachOf(targets, function(target, name, next) {
    target.cwd = config.cwd;
    this.installFiles(provider, target, options, next);
  }.bind(this), cb);
};

Cyborg.prototype.installManifest = function(provider, manifest, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  var cwd = manifest.cwd || process.cwd();
  var workflow = [];
  var config = {
    cwd: cwd,
    dest: '~/.cyborg/' + cwd
  };
  if (manifest.files) {
    config.src = manifest.files
    workflow.push(utils.async.apply(this.installFiles.bind(this), provider, config, options));
  }

  if (manifest.targets) {
    config.targets = manifest.targets;
    workflow.push(utils.async.apply(this.installTargets.bind(this), provider, config, options));
  }

  if (manifest.dependencies) {
    workflow.push(utils.async.apply(this.installDependencies.bind(this), manifest.dependencies, options));
  }

  utils.async.series(workflow, cb);
};

Cyborg.prototype.update = function(src, options, cb) {
  return this.install.apply(this, arguments);
};

module.exports = Cyborg;
