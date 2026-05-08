SELECT
  ca.id,
  ca.person_id AS "personId",
  ca.activity_type AS "activityType",
  ca.activity_date AS "activityDate",
  ca.description,
  JSON_BUILD_OBJECT(
    'firstName', p.first_name,
    'lastName', p.last_name,
    'email', p.email,
    'dateOfBirth', p.date_of_birth
  ) AS contact
FROM contact_activities ca
JOIN person p ON p.id = ca.person_id
WHERE ca.person_id = $1 AND ca.activity_type = $2
ORDER BY ca.activity_date DESC;
