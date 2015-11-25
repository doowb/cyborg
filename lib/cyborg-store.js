'use strict';

var Store = require('data-store');

/**
 * CyborgStore is a pre-configured [data-store][] located at
 * ~/.cyborg/manifests.json.
 *
 * The store contains the local manifest information for any installed manifests.
 *
 * @param {Object} `options` See [data-store][] for `options`
 * @api public
 */

function CyborgStore(options) {
  if (!(this instanceof CyborgStore)) {
    return new CyborgStore(options);
  }
  options = options || {};
  options.cwd = options.cwd || '~/.cyborg'
  Store.call(this, 'manifests', options);
}

Store.extend(CyborgStore);

/**
 * Exposes CyborgStore
 */

module.exports = CyborgStore;
