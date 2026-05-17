const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StokSepeti API',
      version: '1.0.0',
      description: 'Gıda Son Tüketim Tarihi ve Mutfak Stok Takip Sistemi API',
    },
    servers: [{ url: 'http://localhost:3001' }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
