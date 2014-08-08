var parse = require(__dirname + '/../lib/parse'),
  util = require(__dirname + '/../lib/util');

exports.testParseQueries = function(test) {
  var sql = util.read(__dirname + '/sql/two.sql'),
    parsed = parse.parseQueries(sql),
    expect;

  test.deepEqual(Object.keys(parsed).sort(),
                 ['findByName', 'findByNameAndModel'].sort());
  test.strictEqual(parsed.findByName,
                   'SELECT * FROM cars WHERE cars.name = :name');

  expect = 'SELECT * FROM cars WHERE cars.name = :name AND cars.model = :model';
  test.strictEqual(parsed.findByNameAndModel, expect);

  // empty cases
  test.deepEqual({}, parse.parseQueries(''));
  test.deepEqual({}, parse.parseQueries());

  test.done();
};

exports.testSpliceParameters = function(test) {
  var q = 'SELECT * FROM cars WHERE cars.name = :name AND cars.model = :model',
    result;

  test.deepEqual([
    'SELECT * FROM cars WHERE cars.name = ',
    { idx: 0, name: 'name' },
    ' AND cars.model = ',
    { idx: 1, name: 'model' },
    ''
  ], parse.spliceParameters(q));

  q = 'SELECT * FROM cars AS c INNER JOIN cool_cars as cc ON c.name = cc.name' +
    ' WHERE c.name = :name AND c.model = :name AND cc.model = :cool';

  result = [
    'SELECT * FROM cars AS c INNER JOIN cool_cars as cc ON c.name = cc.name' +
    ' WHERE c.name = ',
    { name: 'name', idx: 0 },
    ' AND c.model = ',
    { name: 'name', idx: 0 },
    ' AND cc.model = ',
    { name: 'cool', idx: 2 },
    ''
  ];
  test.deepEqual(result, parse.spliceParameters(q));

  test.done();
};
