'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('../../utils');

function Installer(cwd) {
  if (!(this instanceof Installer)) {
    return new Installer(cwd);
  }
  this.cwd = cwd || process.cwd();
}

Installer.prototype.file = function(fp, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};

  var filepath = path.join(this.cwd, fp);
  fs.readFile(filepath, 'utf8', function(err, content) {
    if (err) return cb(err);
    cb(null, {path: fp, content: content});
  });
  return this;
};

Installer.prototype.files = function(files, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  files = utils.arrayify(files);

  utils.async.map(files, function(file, next) {
    this.file(file, options, next);
  }.bind(this), cb);

  return this;
};

module.exports = Installer;
