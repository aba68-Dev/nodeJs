const request = require('supertest');
const app = require('../src/app');

describe('Main App', () => {
  describe('GET /', () => {
    it('should return welcome message and endpoints', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Welcome to the Sample Node.js API',
        version: '1.0.0',
        endpoints: {
          users: '/api/users',
          tasks: '/api/tasks',
          health: '/health'
        }
      });
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Not Found');
    });
  });
});