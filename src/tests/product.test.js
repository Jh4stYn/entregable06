require('../models')
const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category')

const BASE_URL = '/api/v1/products'
const BASE_URL_LOGIN = '/api/v1/users/login'
let TOKEN
let product
let category
let productId

beforeAll(async () => {
  const hits = {
    email: 'juan@gmail.com',
    password: 'juan123'
  }
  const res = await request(app)
    .post(BASE_URL_LOGIN)
    .send(hits)

  TOKEN = res.body.token

  category = await Category.create({ name: 'Buzos' })

  product = {
    title: "Nike C1",
    description: "C1 is ...",
    price: 149.90,
    categoryId: category.id
  }
})

afterAll(async () => {
  await category.destroy()
})


test('POST -> BASE_URL, should statusCode 201, and res.body.title === product.title', async() => {
  const res = await request(app)
    .post(BASE_URL)
    .send(product)
    .set('Authorization', `Bearer ${TOKEN}`)

  productId = res.body.id

  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(product.title)
  expect(res.body.categoryId).toBe(category.id)
})

test('GET -> BASE_URL, should statusCode 200, and res.body.length = 1', async() => {
  const res = await request(app)
    .get(BASE_URL)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)

  expect(res.body[0].category.id).toBeDefined()
  expect(res.body[0].category.id).toBe(category.id)
})

test('GET -> BASE_URL/productId, should statusCode 200, and and res.body.title === product.title', async() => {
  const res = await request(app)
    .get(`${BASE_URL}/${productId}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(product.title)

  expect(res.body.category.id).toBeDefined()
  expect(res.body.category.id).toBe(category.id)
})

test('PUT -> BASE_URL/productId, should statusCode 200, and res.body.title === productUpdate.title', async() => {
  const productUpdate = {
    title: "Nike B1",
    description: "B1 is ..."
  }

  const res = await request(app)
    .put(`${BASE_URL}/${productId}`)
    .send(productUpdate)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(productUpdate.title)

  expect(res.body.categoryId).toBeDefined()
  expect(res.body.categoryId).toBe(category.id)
})

test('DELETE -> BASE_URL/productId, should statusCode 204', async() => {
  const res = await request(app)
    .delete(`${BASE_URL}/${productId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(204)
})