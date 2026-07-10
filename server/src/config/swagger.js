import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description:
        'Production-ready URL Shortener REST API with JWT authentication, analytics, and admin capabilities.',
      contact: {
        name: 'API Support',
        email: 'support@urlshortener.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token.',
        },
      },
      schemas: {
        ApiSuccess: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Url: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            originalUrl: { type: 'string', format: 'uri' },
            shortCode: { type: 'string' },
            customAlias: { type: 'string' },
            shortUrl: { type: 'string', format: 'uri' },
            clicks: { type: 'integer' },
            owner: { type: 'string' },
            isActive: { type: 'boolean' },
            isFavorite: { type: 'boolean' },
            expiresAt: { type: 'string', format: 'date-time', nullable: true },
            qrCode: { type: 'string', description: 'Base64 QR code data URL' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Analytics: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            urlId: { type: 'string' },
            browser: { type: 'string' },
            os: { type: 'string' },
            device: { type: 'string' },
            country: { type: 'string' },
            city: { type: 'string' },
            referrer: { type: 'string' },
            language: { type: 'string' },
            timezone: { type: 'string' },
            clickedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'URLs', description: 'URL management endpoints' },
      { name: 'Analytics', description: 'Analytics data endpoints' },
      { name: 'Users', description: 'User profile endpoints' },
      { name: 'Admin', description: 'Admin management endpoints' },
      { name: 'Redirect', description: 'Short URL redirect endpoint' },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
