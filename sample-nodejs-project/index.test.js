const request = require('supertest');
const express = require('express');
let server;

describe('API Integration', () => {
  beforeAll((done) => {
    server = require('./index');
    setTimeout(done, 500); // Wait for DB setup
  });

  let token;
  let itemId;

  it('registers a user', async () => {
    const res = await request(server)
      .post('/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect([201, 400]).toContain(res.statusCode); // 400 if already exists
  });

  it('logs in and gets a token', async () => {
    const res = await request(server)
      .post('/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('creates an item', async () => {
    const res = await request(server)
      .post('/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Item' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Item');
    itemId = res.body.id;
  });

  it('gets all items', async () => {
    const res = await request(server)
      .get('/items')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('gets a single item', async () => {
    const res = await request(server)
      .get(`/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(itemId);
  });

  it('updates an item', async () => {
    const res = await request(server)
      .put(`/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Item' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Item');
  });

  it('deletes an item', async () => {
    const res = await request(server)
      .delete(`/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(itemId);
  });
});