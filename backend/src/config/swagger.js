const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Electric Cars DataGrid API',
      version: '1.0.0',
      description: 'A comprehensive API for managing electric car data with search, filter, and export capabilities',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Cars',
        description: 'Electric cars endpoints',
      },
      {
        name: 'Export',
        description: 'Data export endpoints',
      },
      {
        name: 'Favorites',
        description: 'User favorites management',
      },
      {
        name: 'Health',
        description: 'System health checks',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
