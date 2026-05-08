SELECT ph.id, ph.number, ph.phone_type_id AS "phoneTypeId", pt.type_name AS "phoneTypeName"
FROM phone ph
JOIN phone_type pt ON pt.id = ph.phone_type_id
WHERE ph.person_id = $1
ORDER BY ph.id;
