FROM postgres:16

COPY ./sql/*.sql /docker-entrypoint-initdb.d/
COPY ./seed/default/*.sql /docker-entrypoint-initdb.d/
