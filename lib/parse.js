var _ = require('lodash');

var util = require('./util');

/**
 * parseQueries() takes a string representing the contents of an .sql file
 * and returns an object with keys corresponding to the function name specified
 * and values the unparametrized sql query string.
 */
exports.parseQueries = function(s) {
  // we define query blocks as being separated by a blank line
  var queryBlocks = s.split('\n\n');

  // regex for a single query
  var nameLine = '--\\s*name:\\s*(\\w+)\r?\n',
    commentedLines = '(?:--.*\r?\n)+';

  return _.reduce(queryBlocks, function(o, s) {
    var name = s.match(new RegExp(nameLine, 'i'))[1],
      query = s.split(new RegExp(commentedLines, 'mgi'))[1],
      merger = {};

    if (!name || !query) { // malformation, moving on...
      return o;
    }

    merger[name] = query.split('\n').join(' ').trimRight();

    return _.merge(o, merger);
  }, {});
};

/**
 * spliceParameters() takes a string representing an SQL query and returns
 * an array of the form [String*, Object] where Object is a spot where a
 * parameter needs to be injected.
 */
exports.spliceParameters = function(query) {
  var withoutParams = query.split(/(?::\w+)/),
    preParams = util.allMatches(/(:\w+)+/g, query),
    params = _.map(preParams, function(p) {
      return {
        name: _.first(_.rest(p.split(':'))),
        idx: _.indexOf(preParams, p)
      };
    }),
    interleaved = util.interleave(withoutParams, params);

  _.remove(interleaved, _.isUndefined);

  return interleaved;
};
