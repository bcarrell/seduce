var seduce = require(__dirname + '/../lib/index');

exports.testSeduce = function(test) {
  var q1 = seduce(__dirname + '/sql/one.sql'),
    q2 = seduce(__dirname + '/sql/two.sql'),
    q3 = seduce(__dirname + '/sql/three.sql'),
    expected;

  expected = 'SELECT * FROM cars WHERE cars.name = "hello"';
  test.strictEqual(q1.findByName('hello'), expected);
  test.strictEqual(q2.findByName('hello'), expected);

  expected = 'SELECT * FROM cars WHERE cars.name = "hello"' +
    ' AND cars.model = "world"';
  test.strictEqual(q2.findByNameAndModel('hello', 'world'), expected);
  test.strictEqual(q2.findByNameAndModel({
    name: 'hello',
    model: 'world'
  }), expected);

  expected = 'SELECT * FROM cars WHERE cars.name IN ("hello","world")';
  test.strictEqual(q3.findByNameWithArray(['hello', 'world']), expected);

  expected = 'SELECT * FROM cars WHERE cars.name = "hello"' +
    ' AND cars.model = "world"';
  test.strictEqual(q2.findByNameAndModel.apply(null, ['hello', 'world']),
                   expected);

  test.done();
};
