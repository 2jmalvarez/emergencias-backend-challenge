export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Emergencias Contacts API',
    version: '1.0.0',
    description: 'REST API for contacts, phones, addresses and activities.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/contacts': {
      post: {
        summary: 'Create contact',
      },
    },
    '/contacts/by-email': {
      get: {
        summary: 'Get contact by email',
      },
    },
    '/contacts/search': {
      get: {
        summary: 'Search contacts by personal data',
      },
    },
    '/contacts/by-phone': {
      get: {
        summary: 'Search contact by phone number and type',
      },
    },
    '/contacts/{id}': {
      patch: {
        summary: 'Update contact personal fields',
      },
      delete: {
        summary: 'Delete contact',
      },
    },
    '/activities': {
      post: {
        summary: 'Create activity',
      },
    },
    '/activities/search': {
      get: {
        summary: 'Search activities by contact and type',
      },
    },
  },
};
