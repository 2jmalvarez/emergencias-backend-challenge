SELECT id, first_name AS "firstName", last_name AS "lastName", date_of_birth AS "dateOfBirth", email
FROM person
WHERE id = $1;
