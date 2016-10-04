var fs = require('fs'),
  _ = require('lodash');

/**
 * Internal collection of utility fns.
 */

module.exports = {
  /** General utility fns **/
  isFunction: function(x) {
    return typeof x === 'function';
  },
  isObject: function(x) {
    return typeof x === 'object' && x !== null;
  },
  isString: function(x) {
    return typeof x === 'string';
  },
  isArray: Array.isArray || function(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  },
  isNumber: function(x) {
    return typeof x === 'number';
  },
  toArray: function(xs) {
    return Array.prototype.slice.call(xs);
  },
  allMatches: function(regexp, s) {
    var matches = [],
      match;

    while ((match = regexp.exec(s)) !== null) {
      matches.push(match[0]);
    }

    return matches;
  },
  interleave: function() {
    var args = this.toArray(arguments);

    return _.flatten(_.zip.apply(null, args));
  },
  read: function(path) {
    return fs.readFileSync(path, { encoding: 'utf8' });
  },

  wrapQuotes: function (v) {
    if (_.isString(v)) return '"' + v + '"';

    return v;
  },

  wrap: function (value, escape) {
    if(!escape) {
      escape = this.wrapQuotes;
    }
    if (this.isString(value)) {
      return escape(value);
    } else if (this.isArray(value)) {
      return '(' + _.map(value, v => this.wrap(v, escape)).toString() + ')';
    } else {
      return value;
    }
  }
};
