'use strict';

var GithubProvider = require('../lib/providers/github');
var FsProvider = require('../lib/providers/fs');
var Cyborg = require('../');
var cyborg = new Cyborg();

cyborg.option('defaultProvider', 'github');
cyborg.option('manifestfile', 'manifest.json');
cyborg.provider('fs', new FsProvider());
cyborg.provider('github', new GithubProvider());

var manifest = require('../manifest.json');

cyborg.install(manifest, function(err) {
  if (err) return console.error(err);
  console.log('done');
});
