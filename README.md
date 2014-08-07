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

Notice the `name:` pragma.  This is required, and the name that you define
will be the name of the function that `seduce` will generate for you.  You can
add any number of comment lines describing what the query does after that line.

Next, write your query normally.  For any portion that needs to take a
parameter, indicate your parameter like `:name`.

Write any number of queries that you want -- each should be separated by an
empty line.

To use this query that you've just defined, do this:

    var seduce = require('seduce'),
        q = seduce('queries.sql');

`seduce(...)` will return an `Object` with functions.  You can call your
functions by referring to them by name, like this:

    q.findByNameAndModel('Ford', 'Explorer');
    q.findByNameAndModel({ name: 'Ford', model: 'Explorer' });

This will return a String like this:

    SELECT * FROM cars WHERE cars.name = "Ford" AND cars.model = "Explorer"


