# Emergencias Backend Challenge

API RESTful en Node.js + TypeScript + Express para gestionar contactos y actividades.

## Stack y arquitectura

- Node.js + TypeScript + Express
- Postgres (docker local)
- Validacion y DTOs con Zod
- Arquitectura por capas: routes -> controllers -> services -> repositories
- SQL separado en archivos por modulo

## Requisitos

- Node.js 20+
- Docker

## Variables de entorno

Copia `.env.example` a `.env`.

- `PORT`: puerto HTTP de la API
- `DATABASE_URL`: conexion a DB de desarrollo
- `DATABASE_URL_TEST`: conexion a DB de test/integracion

Notas:

- En `NODE_ENV=test` se usa `DATABASE_URL_TEST`.
- En desarrollo/produccion se usa `DATABASE_URL`.

## Base de datos local

### Desarrollo

```bash
npm run db:up
```

- Host: `127.0.0.1`
- Puerto: `55434`
- DB: `emergencias_dev`
- User: `emergencias`
- Password: `emergencias`

### Test

```bash
npm run db:test:up
```

- Host: `127.0.0.1`
- Puerto: `55435`
- DB: `emergencias_test`
- User: `emergencias`
- Password: `emergencias`

## Seeds

- Dataset base CI/local: `infra/local/postgres/seed/default/*.sql`
- Snapshots sanitizados (reservado): `infra/local/postgres/seed/snapshots/*`

## Ejecucion rapida

```bash
npm install
npm run db:up
npm run dev
```

API: `http://localhost:3001`
Swagger: `http://localhost:3001/docs`

## Scripts

- `npm run dev`: modo desarrollo
- `npm run build`: compila TypeScript
- `npm run start`: build + run
- `npm run db:up`: levanta DB dev
- `npm run db:down`: detiene DB dev
- `npm run db:reset`: reinicia DB dev limpia
- `npm run db:test:up`: levanta DB test
- `npm run db:test:down`: detiene DB test
- `npm run db:test:reset`: reinicia DB test limpia
- `npm run test`: corre tests
- `npm run test:integration`: corre integracion contra DB test
- `npm run test:integration:full`: reset DB test + integracion
- `npm run lint`: linter

## Smoke test recomendado

```bash
npm run test:integration:full
```

## Endpoints

- `POST /contacts`
- `GET /contacts/by-email?email=`
- `GET /contacts/search?firstName=&lastName=&dateOfBirth=&limit=&offset=`
- `GET /contacts/by-phone?number=&type=`
- `PATCH /contacts/:id`
- `DELETE /contacts/:id`
- `POST /activities`
- `GET /activities/search?personId=&activityType=`

## Ejemplos curl

Crear contacto:

```bash
curl -X POST http://localhost:3001/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Ana",
    "lastName":"Garcia",
    "dateOfBirth":"1992-04-20",
    "email":"ana.garcia@example.com",
    "phones":[{"number":"11-5555-1234","phoneTypeId":1}],
    "addresses":[{"locality":"CABA","street":"Corrientes","number":1234}]
  }'
```

Buscar por email:

```bash
curl "http://localhost:3001/contacts/by-email?email=ana.garcia@example.com"
```

Actualizar contacto:

```bash
curl -X PATCH http://localhost:3001/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ana Maria","lastName":"Garcia","dateOfBirth":"1992-04-20","email":"ana.maria@example.com"}'
```

Crear actividad:

```bash
curl -X POST http://localhost:3001/activities \
  -H "Content-Type: application/json" \
  -d '{"personId":1,"activityType":"call","activityDate":"2026-05-08T14:30:00.000Z","description":"Llamada de seguimiento"}'
```

Buscar actividades:

```bash
curl "http://localhost:3001/activities/search?personId=1&activityType=call"
```

## SQL por modulo

- Activities: `src/modules/activities/sql/*.sql`
- Contacts: `src/modules/contacts/sql/*.sql`

El runtime lee SQL desde `dist` y, si no existe, usa `src` como respaldo.
