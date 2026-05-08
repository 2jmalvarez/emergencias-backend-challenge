INSERT INTO contact_activities (person_id, activity_type, activity_date, description)
VALUES ($1, $2, $3, $4)
RETURNING id, person_id AS "personId", activity_type AS "activityType", activity_date AS "activityDate", description;
