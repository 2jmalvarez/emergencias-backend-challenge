CREATE TABLE IF NOT EXISTS person (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  date_of_birth TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS phone_type (
  id BIGSERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS phone (
  id BIGSERIAL PRIMARY KEY,
  number VARCHAR(30) NOT NULL,
  person_id BIGINT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  phone_type_id BIGINT NOT NULL REFERENCES phone_type(id)
);

CREATE TABLE IF NOT EXISTS address (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  locality VARCHAR(120) NOT NULL,
  street VARCHAR(120) NOT NULL,
  number INTEGER NOT NULL,
  notes TEXT NULL
);

CREATE TABLE IF NOT EXISTS contact_activities (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('call', 'meeting', 'email')),
  activity_date TEXT NOT NULL,
  description TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_person_email ON person(email);
CREATE INDEX IF NOT EXISTS idx_phone_number ON phone(number);
CREATE INDEX IF NOT EXISTS idx_phone_person_id ON phone(person_id);
CREATE INDEX IF NOT EXISTS idx_address_person_id ON address(person_id);
CREATE INDEX IF NOT EXISTS idx_activity_person_type ON contact_activities(person_id, activity_type);
