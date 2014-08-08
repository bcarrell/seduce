var create = require(__dirname + '/../lib/create'),
  parse = require(__dirname + '/../lib/parse');

exports.testCreate = function(test) {
  var q = 'SELECT * FROM cars WHERE cars.name = :name AND cars.model = :model',
    f = create.create(parse.spliceParameters(q));

  test.strictEqual(f('hello'),
                   'SELECT * FROM cars WHERE cars.name = "hello" ' +
                     'AND cars.model = null');
  test.strictEqual(f({ name: 'hello' }),
                   'SELECT * FROM cars WHERE cars.name = "hello" ' +
                     'AND cars.model = null');

  test.strictEqual(f('hello', 'world'),
                  'SELECT * FROM cars WHERE cars.name = "hello" ' +
                    'AND cars.model = "world"');

  q = 'SELECT * FROM cars WHERE cars.name IN :names';
  f = create.create(parse.spliceParameters(q));

  test.strictEqual(f(['hello', 'world']),
                  'SELECT * FROM cars WHERE cars.name IN ("hello","world")');

  q = 'SELECT * FROM cars WHERE cars.name = :name AND cars.model = :name';
  f = create.create(parse.spliceParameters(q));
  test.strictEqual(f('hello'),
                  'SELECT * FROM cars WHERE cars.name = "hello" AND ' +
                    'cars.model = "hello"');
  test.strictEqual(f({ name: 'hello' }),
                  'SELECT * FROM cars WHERE cars.name = "hello" AND ' +
                    'cars.model = "hello"');

  test.done();
};
