export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Emergencias Challenge - API de Agenda de Contactos',
    version: '1.0.0',
    description:
      'API RESTful para gestionar una agenda de contactos con telefonos, direcciones y actividades (llamadas, reuniones y emails).',
  },
  servers: [{ url: 'http://localhost:3001' }],
  tags: [
    { name: 'Contactos', description: 'Operaciones sobre contactos de la agenda.' },
    { name: 'Actividades', description: 'Operaciones sobre actividades de contactos.' },
    { name: 'Salud', description: 'Chequeos de disponibilidad de la API.' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Salud'],
        summary: 'Estado de la API',
        description: 'Endpoint de healthcheck para validar que la API esta disponible.',
        responses: {
          200: {
            description: 'API disponible',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/contacts': {
      post: {
        tags: ['Contactos'],
        summary: 'Creacion de contacto',
        description: 'Creacion de un contacto.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateContactRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Contacto creado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ContactDetails' },
              },
            },
          },
          409: { $ref: '#/components/responses/Conflict' },
          422: { $ref: '#/components/responses/ValidationError' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/contacts/by-email': {
      get: {
        tags: ['Contactos'],
        summary: 'Busqueda de contacto por email',
        description: 'Busqueda de contacto por email.',
        parameters: [
          {
            in: 'query',
            name: 'email',
            required: true,
            schema: { type: 'string', format: 'email' },
            example: 'ana.garcia@example.com',
          },
        ],
        responses: {
          200: {
            description: 'Contacto encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ContactDetails' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/contacts/search': {
      get: {
        tags: ['Contactos'],
        summary: 'Busqueda de contactos por datos personales',
        description: 'Busqueda de contactos por datos personales.',
        parameters: [
          {
            in: 'query',
            name: 'firstName',
            required: false,
            schema: { type: 'string' },
            example: 'Ana',
          },
          {
            in: 'query',
            name: 'lastName',
            required: false,
            schema: { type: 'string' },
            example: 'Garcia',
          },
          {
            in: 'query',
            name: 'dateOfBirth',
            required: false,
            schema: { type: 'string', format: 'date' },
            example: '1992-04-20',
          },
          {
            in: 'query',
            name: 'limit',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            example: 20,
          },
          {
            in: 'query',
            name: 'offset',
            required: false,
            schema: { type: 'integer', minimum: 0, default: 0 },
            example: 0,
          },
        ],
        responses: {
          200: {
            description: 'Listado de contactos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ContactSummary' },
                },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationError' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/contacts/by-phone': {
      get: {
        tags: ['Contactos'],
        summary: 'Busqueda de contacto por numero y tipo de telefono',
        description: 'Busqueda de contacto por numero y tipo de telefono.',
        parameters: [
          {
            in: 'query',
            name: 'number',
            required: true,
            schema: { type: 'string' },
            example: '11-5555-1234',
          },
          {
            in: 'query',
            name: 'type',
            required: true,
            schema: { type: 'string' },
            example: 'mobile',
          },
        ],
        responses: {
          200: {
            description: 'Listado de contactos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ContactSummary' },
                },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationError' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/contacts/{id}': {
      patch: {
        tags: ['Contactos'],
        summary: 'Edicion de datos personales del contacto',
        description: 'Edicion de los datos personales de un contacto.',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateContactRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Contacto actualizado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ContactDetails' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          409: { $ref: '#/components/responses/Conflict' },
          422: { $ref: '#/components/responses/ValidationError' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      delete: {
        tags: ['Contactos'],
        summary: 'Eliminacion de contacto',
        description: 'Eliminacion de un contacto.',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            example: 1,
          },
        ],
        responses: {
          204: {
            description: 'Contacto eliminado correctamente',
          },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/activities': {
      post: {
        tags: ['Actividades'],
        summary: 'Creacion de actividad',
        description: 'Creacion de una actividad.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateActivityRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Actividad creada correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedActivity' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/activities/search': {
      get: {
        tags: ['Actividades'],
        summary: 'Busqueda de actividades por contacto y tipo',
        description:
          'Busqueda de actividades por contacto y tipo de actividad especifico. Retornando detalles del contacto (nombre, apellido, email y fecha de nacimiento).',
        parameters: [
          {
            in: 'query',
            name: 'personId',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            example: 1,
          },
          {
            in: 'query',
            name: 'activityType',
            required: true,
            schema: { $ref: '#/components/schemas/ActivityType' },
            example: 'call',
          },
        ],
        responses: {
          200: {
            description: 'Listado de actividades con datos del contacto',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ActivityWithContact' },
                },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationError' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
  },
  components: {
    responses: {
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { message: 'Contact not found' },
          },
        },
      },
      Conflict: {
        description: 'Conflicto de datos',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { message: 'Email already exists' },
          },
        },
      },
      ValidationError: {
        description: 'Error de validacion',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      InternalError: {
        description: 'Error interno del servidor',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { message: 'Unexpected internal error' },
          },
        },
      },
    },
    schemas: {
      ActivityType: {
        type: 'string',
        enum: ['call', 'meeting', 'email'],
      },
      Phone: {
        type: 'object',
        required: ['number', 'phoneTypeId'],
        properties: {
          number: { type: 'string', example: '11-5555-1234' },
          phoneTypeId: { type: 'integer', example: 1 },
        },
      },
      Address: {
        type: 'object',
        required: ['locality', 'street', 'number'],
        properties: {
          locality: { type: 'string', example: 'CABA' },
          street: { type: 'string', example: 'Corrientes' },
          number: { type: 'integer', example: 1234 },
          notes: { type: 'string', nullable: true, example: 'Piso 5 departamento B' },
        },
      },
      CreateContactRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'dateOfBirth', 'email', 'phones', 'addresses'],
        properties: {
          firstName: { type: 'string', example: 'Ana' },
          lastName: { type: 'string', example: 'Garcia' },
          dateOfBirth: { type: 'string', format: 'date', example: '1992-04-20' },
          email: { type: 'string', format: 'email', example: 'ana.garcia@example.com' },
          phones: {
            type: 'array',
            items: { $ref: '#/components/schemas/Phone' },
          },
          addresses: {
            type: 'array',
            items: { $ref: '#/components/schemas/Address' },
          },
        },
      },
      UpdateContactRequest: {
        type: 'object',
        minProperties: 1,
        properties: {
          firstName: { type: 'string', example: 'Ana Maria' },
          lastName: { type: 'string', example: 'Garcia' },
          dateOfBirth: { type: 'string', format: 'date', example: '1992-04-20' },
          email: { type: 'string', format: 'email', example: 'ana.maria@example.com' },
        },
      },
      ContactSummary: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          firstName: { type: 'string', example: 'Ana' },
          lastName: { type: 'string', example: 'Garcia' },
          dateOfBirth: { type: 'string', example: '1992-04-20' },
          email: { type: 'string', format: 'email', example: 'ana.garcia@example.com' },
        },
      },
      ContactDetails: {
        allOf: [
          { $ref: '#/components/schemas/ContactSummary' },
          {
            type: 'object',
            properties: {
              phones: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    number: { type: 'string', example: '11-5555-1234' },
                    phoneTypeId: { type: 'integer', example: 1 },
                    phoneTypeName: { type: 'string', example: 'mobile' },
                  },
                },
              },
              addresses: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    locality: { type: 'string', example: 'CABA' },
                    street: { type: 'string', example: 'Corrientes' },
                    number: { type: 'integer', example: 1234 },
                    notes: { type: 'string', nullable: true, example: 'Piso 5 departamento B' },
                  },
                },
              },
            },
          },
        ],
      },
      CreateActivityRequest: {
        type: 'object',
        required: ['personId', 'activityType', 'activityDate'],
        properties: {
          personId: { type: 'integer', example: 1 },
          activityType: { $ref: '#/components/schemas/ActivityType' },
          activityDate: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-08T14:30:00.000Z',
          },
          description: {
            type: 'string',
            nullable: true,
            example: 'Llamada de seguimiento de turno.',
          },
        },
      },
      CreatedActivity: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 10 },
          personId: { type: 'integer', example: 1 },
          activityType: { $ref: '#/components/schemas/ActivityType' },
          activityDate: { type: 'string', example: '2026-05-08T14:30:00.000Z' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Llamada de seguimiento de turno.',
          },
        },
      },
      ActivityWithContact: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 10 },
          personId: { type: 'integer', example: 1 },
          activityType: { $ref: '#/components/schemas/ActivityType' },
          activityDate: { type: 'string', example: '2026-05-08T14:30:00.000Z' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Llamada de seguimiento de turno.',
          },
          contact: {
            type: 'object',
            properties: {
              firstName: { type: 'string', example: 'Ana' },
              lastName: { type: 'string', example: 'Garcia' },
              email: { type: 'string', format: 'email', example: 'ana.garcia@example.com' },
              dateOfBirth: { type: 'string', example: '1992-04-20' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Unexpected internal error' },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Validation error' },
          issues: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'invalid_type' },
                path: {
                  type: 'array',
                  items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
                },
                message: { type: 'string', example: 'Expected string, received number' },
              },
            },
          },
        },
      },
    },
  },
};
