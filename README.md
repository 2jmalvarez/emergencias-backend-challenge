# Emergencias Backend Challenge

API RESTful en Node.js + TypeScript + Express para gestionar contactos y actividades.

## Requisitos

- Node.js 20+
- Docker

## Levantar base de datos local

```bash
docker compose -f infra/local/postgres/docker-compose.yml up --build -d
```

DB por defecto:

- Host: `localhost`
- Port: `55433`
- Database: `emergencias`
- User: `emergencias`
- Password: `emergencias`

## Ejecutar API

```bash
npm install
npm run dev
```

Servidor en `http://localhost:3000`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`
- `npm test`

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
