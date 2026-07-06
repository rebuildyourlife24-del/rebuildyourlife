import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RYL OS Core API',
      version: '1.0.0',
      description: 'The Unified Cloud-Grade API for RYL OS. Powered by a Modular Monolith architecture and CQRS Read Models.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local Development Server',
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
    security: [{ bearerAuth: [] }],
  },
  apis: ['./apps/api/src/routes/*.ts', './apps/api/src/modules/**/*.ts'], // Scan for JSDoc annotations
};

const swaggerSpec = swaggerJSDoc(options);

export const setupOpenAPI = (app: Express) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('[OpenAPI] Swagger docs available at /api/docs');
};
