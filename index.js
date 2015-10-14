/*!
 * cyborg <https://github.com/jonschlinkert/cyborg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

import base from 'base-methods';
import plugin from 'base-plugins';
import option from 'base-options';

const Base = base.namespace('cache');

function Cyborg(options) {
  if (!(this instanceof Cyborg)) {
    return new Cyborg(options);
  }
  Base.call(this);
  this.options = options || {};
}

Base.extend(Cyborg);

export default Cyborg;
