var _    = require('lodash');

var util = require('./util'),
  create = require('./create').create,
  parse  = require('./parse');

/**
 * Main constructor fn; call with an array of sql files or variadically.
 *
 * Will return an object with query functions attached.
 */
module.exports = function() {
  var args = _.toArray(arguments),
    len = args.length,
    sqlFileContent;

  if (len === 1 && util.isArray(args[0])) { // array of paths
    sqlFileContent = _.map(args[0], util.read);
  }
  else if (len >= 1 && args.every(util.isString)) { // n strings
    sqlFileContent = _.map(args, util.read);
  } else {
    throw 'Wrong usage; you must supply paths via an array or string(s)';
  }

  return _.reduce(sqlFileContent, function(o, file) {
    var queries = parse.parseQueries(file);

    _.pairs(queries).forEach(function(pair) {
      var name = pair[0];
      var transformedQ = create(parse.spliceParameters(pair[1]));

      queries[name] = transformedQ;
    });

    return _.merge(o, queries);
  }, {});

};
