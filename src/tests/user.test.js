const request = require('supertest')
const app = require('../app')

const BASE_URL = '/api/v1/users'
let TOKEN
let userId

beforeAll(async () => {
  const hits = {
    email: 'juan@gmail.com',
    password: 'juan123'
  }
  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(hits)
  
    TOKEN = res.body.token
    // console.log(TOKEN)
})

const user = {
  firstName: 'Jhas',
  lastName: 'PR',
  email: 'jj@gmail.com',
  password: 'jj123',
  phone: '+51987654321'
}

test('POST -> BASE_URL, should return statusCode 201, and res.body.firstName === user.firstName', async () => {
  const res = await request(app)
    .post(BASE_URL)
    .send(user)

  userId = res.body.id

  expect(res.statusCode).toBe(201)
  expect(res.body.firstName).toBeDefined()
  expect(res.body.firstName).toBe(user.firstName)
})

test('GET -> BASE_URL, should return statusCode 200, and res.body.lenght === 2', async() => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(2)
})

test('PUT -> BASE_URL/userId, should return statusCode 200, and res.body.firstName === userUpdate.firstName', async() => {
  const userUpdate = {
    firstName: 'Jeff',
  }
  const res = await request(app)
    .put(`${BASE_URL}/${userId}`)
    .send(userUpdate)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.firstName).toBe(userUpdate.firstName)
})

test('POST -> BASE_URL/login, should return statusCode 200, and res.body.user.email === user.email', async() => {
  const hits = {
    email: user.email,
    password: user.password
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(hits)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.user).toBeDefined()
  expect(res.body.token).toBeDefined()
  expect(res.body.user.email).toBe(hits.email)
})

test('POST -> BASE_URL/login, should return statusCode 401, and res.body.user.email === user.email', async() => {
  const hits = {
    email: user.email,
    password: 'invalidPassword'
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(hits)

  expect(res.statusCode).toBe(401)
})

test('DELETE -> BASE_URL/userId, should return statusCode 204', async() => {
  const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
  
    expect(res.statusCode).toBe(204)
})

