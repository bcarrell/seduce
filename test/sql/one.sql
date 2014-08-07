-- name: findByName
-- Queries the cars table by a car name
SELECT *
FROM cars
WHERE cars.name = :name
