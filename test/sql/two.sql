-- name: findByName
-- Queries the cars table by car name
SELECT *
FROM cars
WHERE cars.name = :name

-- name: findByNameAndModel
-- Queries the cars table by car name and model
SELECT *
FROM cars
WHERE cars.name = :name AND cars.model = :model
