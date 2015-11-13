'use strict';

module.exports = function (app) {
  app.define('log', function () {
    console.log.apply(console, arguments);
  });
};
