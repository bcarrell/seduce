# seduce

Seduce is a Node module for keeping your SQL out of your code.  With `seduce`,
you write parametrized SQL in .sql files.  Seduce parses it and builds your
queries as functions.

Seduce is a way of writing SQL queries.  It does not provide database logic.

### Install

    npm install seduce

#### Usage

Start by writing your SQL queries like this, in a file like `queries.sql`:

    -- name: findByNameAndModel
    -- Queries the cars table by a car name
    SELECT *
    FROM cars
    WHERE cars.brand = :name AND cars.model = :model

    -- name: findByNames
    SELECT *
    FROM cars
    WHERE cars.brand IN :names

Notice the `name:` notation.  This is required, and the name that you define
will be the name of the function that `seduce` will generate for you.  You can
add any number of comment lines describing what the query does after that line.

Next, write your query normally.  For any portion that needs to take a
parameter, indicate your parameter like `:name`.

Write any number of queries that you want -- each should be separated by an
empty line.

To use this query that you've just defined, do this:

    var seduce = require('seduce'),
        q = seduce('queries.sql');

`seduce(...)` has the following signature: `paths {String|Array}` and `opt {Object}`.
Paths are file paths to your sql files; opt is optional but highly recommended.
It supports a key `escape` to attach a function to escape your parameters to
prevent injection attacks.

You can call your functions by referring to them by name.  Any of these are equivalent:

    var carQuery = q.findByNameAndModel('Ford', 'Explorer');

or

    var carQuery = q.findByNameAndModel({ name: 'Ford', model: 'Explorer' });

or

    var myParams = ['Ford, 'Explorer];
    var carQuery = q.findByNameAndModel.apply(null, myParams);

This will return a String like this:

    SELECT * FROM cars WHERE cars.brand = "Ford" AND cars.model = "Explorer"

If you pass an array as an argument (like if you're doing an IN query), it'll
produce something like this:

    SELECT * FROM cars WHERE cars.brand IN ("Ford", "Honda")

If you have multiple parameters with the same name, Seduce will take care of
that for you and duplicate the value you provide in your query.

#### Example

Starting with `queries.sql` like above...

    var mysql = require('mysql'),
      connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'me',
        password : 'secret'
      }),
      seduce = require('seduce'),
      q = seduce('queries.sql');

    connection.connect();

    connection
    .query(q.findByNameAndModel('Ford', 'Explorer'), function(err, rows, fields) {
      if (err) throw err;

      console.log('The solution is: ', rows[0].solution);
    });

    connection.end();

Example taken from the documentation for node-mysql.

#### Advantages

- Writing SQL in Javascript code is awful; anything remotely complex will be on
multiple lines, and multiline strings in Javascript usually means dumping your
strings into an array and joining them, or concatenating them across multiple
lines.
- Your editor likely has solid support for SQL syntax.  By putting your queries
in sql files, you get the benefits of syntax highlighting and indentation rules.
- You can copy and paste your queries elsewhere easier, like into your favorite
database client, without having to deal with stripping quotes or brackets.
- Someone else can write your queries without having to muck around in code.

#### Status

Brand new.

#### Credits

Seduce is heavily inspired by a Clojure library by Kris Jenkins [Yesql](https://github.com/krisajenkins/yesql).
