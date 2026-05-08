INSERT INTO person (first_name, last_name, date_of_birth, email)
VALUES ($1, $2, $3, $4)
RETURNING id;
