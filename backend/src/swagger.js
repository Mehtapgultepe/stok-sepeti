const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StokSepeti API',
      version: '1.0.0',
      description: 'Gıda Son Tüketim Tarihi ve Mutfak Stok Takip Sistemi API',
    },
    servers: [{ url: 'http://localhost:3001' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: [path.join(__dirname, 'routes/*.js')],
};

module.exports = swaggerJsdoc(options);
