-- name: findByNameWithArray
-- Queries the cars table by car name
SELECT *
FROM cars
WHERE cars.name IN :name
