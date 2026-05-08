SELECT id, first_name AS "firstName", last_name AS "lastName", date_of_birth AS "dateOfBirth", email
FROM person
{{WHERE_CLAUSE}}
ORDER BY id
LIMIT {{LIMIT_INDEX}} OFFSET {{OFFSET_INDEX}};
