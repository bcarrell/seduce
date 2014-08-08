var _    = require('lodash');

var util = require('./util'),
  create = require('./create').create,
  parse  = require('./parse');

/**
 * Main constructor fn.
 *
 * Will return an object with query functions attached.
 */
module.exports = function(paths, opt) {
  var sqlFileContent;

  if (_.isString(paths)) paths = [paths];

  if (_.isArray(paths)) {
    sqlFileContent = _.map(paths, util.read);
  } else {
    throw '`paths` must be an array of string paths or a single string';
  }

  return _.reduce(sqlFileContent, function(o, file) {
    var queries = parse.parseQueries(file);

    _.pairs(queries).forEach(function(pair) {
      var name = pair[0],
        spliced = parse.spliceParameters(pair[1]);

      if (opt && _.isFunction(opt.escape)) {
        queries[name] = create(spliced, opt.escape);
      } else {
        queries[name] = create(spliced);
      }
    });

    return _.merge(o, queries);
  }, {});

};
