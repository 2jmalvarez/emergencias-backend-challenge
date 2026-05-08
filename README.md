# Emergencias Backend Challenge

API RESTful en Node.js + TypeScript + Express para gestionar contactos y actividades.

## Requisitos

- Node.js 20+
- Docker

## Levantar base de datos local

### DB de desarrollo

```bash
npm run db:up
```

- Host: `127.0.0.1`
- Port: `55434`
- Database: `emergencias_dev`
- User: `emergencias`
- Password: `emergencias`

### DB de test

```bash
npm run db:test:up
```

- Host: `127.0.0.1`
- Port: `55435`
- Database: `emergencias_test`
- User: `emergencias`
- Password: `emergencias`

## Seeds

- Dataset base (CI/local): `infra/local/postgres/seed/default/*.sql`
- Snapshots sanitizados (reservado): `infra/local/postgres/seed/snapshots/*`

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

- `PORT`
- `DATABASE_URL` (desarrollo)
- `DATABASE_URL_TEST` (tests de integracion)

## Ejecutar API

```bash
npm install
npm run dev
```

Notas:

- En `NODE_ENV=test` la app usa `DATABASE_URL_TEST` (obligatoria para tests).
- En desarrollo/produccion la app usa `DATABASE_URL`.

Servidor en `http://localhost:3000`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run db:up`
- `npm run db:down`
- `npm run db:reset`
- `npm run db:test:up`
- `npm run db:test:down`
- `npm run db:test:reset`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`
- `npm test`
- `npm run test:integration`
- `npm run test:integration:full`

## Endpoints

- `POST /contacts`
- `GET /contacts/by-email?email=`
- `GET /contacts/search?firstName=&lastName=&dateOfBirth=&limit=&offset=`
- `GET /contacts/by-phone?number=&type=`
- `PATCH /contacts/:id`
- `DELETE /contacts/:id`
- `POST /activities`
- `GET /activities/search?personId=&activityType=`

Documentacion OpenAPI minimal en `GET /docs`.

## SQL por modulo

- Activities: `src/modules/activities/sql/*.sql`
- Contacts: `src/modules/contacts/sql/*.sql`

El runtime lee estos SQL desde `dist` y, si no existen alli, usa `src` como respaldo.
