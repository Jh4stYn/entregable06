const request = require('supertest')
const app = require('../app')

const BASE_URL = '/api/v1/categories'
const BASE_URL_LOGIN = '/api/v1/users/login'
let TOKEN
let categoryId

beforeAll(async () => {
  const user = {
    email: 'juan@gmail.com',
    password: 'juan123'
  }
  const res = await request(app)
    .post(BASE_URL_LOGIN)
    .send(user)

    TOKEN = res.body.token
})

const category = {
  name: 'CocaCola'
}

test('POST -> BASE_URL, should return statusCode 201, and res.body.name === user.name', async () => {
  const res = await request(app)
    .post(BASE_URL)
    .send(category)
    .set('Authorization', `Bearer ${TOKEN}`)

  categoryId = res.body.id

  expect(res.statusCode).toBe(201)
  expect(res.body.name).toBeDefined()
  expect(res.body.name).toBe(category.name)
})

test('GET -> BASE_URL, should return statusCode 200, and res.body.lenght === 1', async() => {
  const res = await request(app)
    .get(BASE_URL)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test('DELETE -> BASE_URL/categoryId, should return statusCode 204', async() => {
  const res = await request(app)
    .delete(`${BASE_URL}/${categoryId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(204)
})
