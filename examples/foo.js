'use strict';

var GithubContent = require('github-content');
var Cyborg = require('../');
var cyborg = new Cyborg();

cyborg.provider('git', function(dependency, version, cb) {
  if (typeof version === 'function') {
    cb = version;
    version = null;
  }

  var segs = dependency.split('@');
  if (!segs.length || segs[0] !== 'git') {
    return cb();
  }

  var foo = segs[1].split('/');
  var gc = new GithubContent();
  gc.owner(foo[0])
    .repo(foo[1]);

  return cb(null, {
    install: function install(dependency, version, cb) {
      console.log('install git', arguments);
      if (typeof version === 'function') {
        cb = version;
        version = null;
      }
      gc.files('package.json', cb);
    }
  });
});

cyborg.install('git@doowb/github-content', function(err) {
  if (err) return console.error(err);
  console.log(arguments);
});
