'use strict';

var plugins = [
  require('./log'),
];


module.exports = function (app) {
  var len = plugins.length, i = 0;
  while (len--) {
    app.use(plugins[i++]);
  }
};
