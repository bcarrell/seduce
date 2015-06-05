var _ = require('lodash');

var util = require('./util');

/**
 * create() takes an array representing a query with parameters
 * and creates a function to be used by the end-user.
 */
exports.create = function(queryArr, opt) {
  return function() {
    var escape = opt ? opt.escape : null;
    var quote = opt ? opt.quote : null;
    var args = _.toArray(arguments);

    return _.reduce(queryArr, function(s, q) {
      var val;

      if (!q) return s;
      if (util.isString(q)) return s + q;

      if (util.isObject(args[0]) && !util.isArray(args[0])) { // direct mapping
        val = util.wrap(args[0][q.name], quote);
      } else {     // one at a time
        val = util.wrap(args[q.idx], quote);
      }

      if (_.isUndefined(val)) val = null;

      if (_.isFunction(escape)) {
        return s + escape(val);
      } else {
        return s + val;
      }
    }, '');
  };
};
