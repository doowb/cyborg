'use strict';

var utils = require('../utils');
var GithubContent = require('github-content');

function Provider(options) {
  if (!(this instanceof Provider)) {
    return new Provider(options);
  }
  this.options = options || {};
}

Provider.prototype.fetch = function(config, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  var installer = this.createInstaller(config, options);
  if (!installer) return cb(null, []);

  var results = [];
  var files = config.files || [{src: config.src}];
  utils.async.eachSeries(files, function(node, next) {
    installer.files(node.src, function(err, downloaded) {
      if (err) return next(err);
      results = results.concat(downloaded || []);
      next();
    });
  }, function(err) {
    if (err) return cb(err);
    cb(null, results);
  });
};

Provider.prototype.createInstaller = function(config, options) {
  var cwd = config.cwd || (config.options && config.options.cwd);
  var url = utils.parse(cwd);
  if (!url || !url.repo) {
    return null;
  }

  var gc = new GithubContent();
  return gc.owner(url.user)
    .repo(url.repo)
    .branch(url.branch);
};

Provider.prototype.getManifest = function(config, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  var installer = this.createInstaller(config, options);
  if (!installer) return cb(null, {});

  installer.file(config.src, function(err, manifest) {
    if (err) return cb(err);
    if (!manifest || !manifest.content) {
      return cb(new Error('Invalid manifest file for ' + config.cwd));
    }
    if (manifest.content.toLowerCase().indexOf('not found') !== -1) {
      return cb(new Error('Manifest not found for ' + config.cwd));
    }
    if (manifest.content.toLowerCase().indexOf('invalid request') !== -1) {
      return cb(new Error('Invalid request for manifest file for ' + config.cwd));
    }
    cb(null, tryParseJSON(manifest.content));
  });
};

function tryParseJSON(content) {
  try {
    return JSON.parse(content);
  } catch (err) {
    return {};
  }
}

module.exports = Provider;
