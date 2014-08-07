var parse = require(__dirname + '/../lib/parse'),
  util = require(__dirname + '/../lib/util');

var sql = util.read(__dirname + '/sql/two.sql');

exports.testParseQueries = function(test) {
  // console.log(parse.parseQueries(sql));

  test.done();
};

exports.testSpliceParameters = function(test) {
  test.done();
};
