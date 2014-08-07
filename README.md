# seduce

Seduce is a Node module for keeping your SQL out of your code.  With `seduce`,
you write parametrized SQL in .sql files.  Seduce parses it and builds your
queries as functions.

Seduce is a way of writing SQL queries.  It does not provide database logic.

### Install

`npm install seduce`

### Usage

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

`seduce(...)` takes file paths to SQL files and return an `Object` with functions.  You can call your
functions by referring to them by name, like this:

    var carQuery = q.findByNameAndModel('Ford', 'Explorer');
    var carQuery = q.findByNameAndModel({ name: 'Ford', model: 'Explorer' });

    var myParams = ['Ford, 'Explorer];
    var carQuery = q.findByNameAndModel.apply(null, myParams);

This will return a String like this:

    SELECT * FROM cars WHERE cars.name = "Ford" AND cars.model = "Explorer"

#### Full Example

Starting with `queries.sql` like above...

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'me',
      password : 'secret'
    });

    var q = require('seduce')('queries.sql');

    connection.connect();

    connection.query(q.findByNameAndModel('Ford', 'Explorer'), function(err, rows, fields) {
      if (err) throw err;

      console.log('The solution is: ', rows[0].solution);
    });

    connection.end();

Example taken from the documentation for node-mysql.
