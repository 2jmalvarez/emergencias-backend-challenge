INSERT INTO phone_type (type_name)
VALUES ('mobile'), ('home'), ('work')
ON CONFLICT (type_name) DO NOTHING;
