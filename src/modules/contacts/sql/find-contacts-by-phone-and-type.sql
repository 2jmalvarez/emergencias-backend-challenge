SELECT DISTINCT p.id, p.first_name AS "firstName", p.last_name AS "lastName", p.date_of_birth AS "dateOfBirth", p.email
FROM person p
JOIN phone ph ON ph.person_id = p.id
JOIN phone_type pt ON pt.id = ph.phone_type_id
WHERE REGEXP_REPLACE(ph.number, '[\\s-]', '', 'g') = $1
  AND LOWER(pt.type_name) = LOWER($2)
ORDER BY p.id;
