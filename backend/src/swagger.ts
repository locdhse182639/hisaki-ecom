import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hisaki E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for Hisaki E-Commerce platform',
      contact: {
        name: 'API Support',
        email: 'support@hisakiecom.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/*.ts'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs }; 