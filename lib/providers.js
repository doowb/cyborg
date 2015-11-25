'use strict';

var utils = require('./utils');

module.exports = function() {
  return function(app) {
    app.define('providers', {});
    app.mixin('provider', function(name, matcher, provider) {
      if (typeof matcher === 'object') {
        provider = matcher;
        matcher = defaultMatcher(name);
      }

      this.providers[name] = {
        matcher: matcher,
        provider: provider
      };
    });

    app.mixin('resolveProvider', function(config, options) {
      for (var key in this.providers) {
        var val = this.providers[key];
        if (val.matcher(config, options)) {
          return val.provider;
        }
      }
      var name = this.option('defaultProvider');
      if (name && this.providers.hasOwnProperty(name)) {
        return this.providers[name].provider;
      }
    });
  };
};

function defaultMatcher(name) {
  return function(config, options) {
    if (typeof config === 'string' && config === name) {
      return true;
    }
    return false;
  };
}
