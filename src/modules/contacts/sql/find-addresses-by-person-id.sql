SELECT id, locality, street, number, notes
FROM address
WHERE person_id = $1
ORDER BY id;
