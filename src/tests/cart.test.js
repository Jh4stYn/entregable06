require('../models')
const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')
const Category = require('../models/Category')

const BASE_URL = '/api/v1/cart'
const BASE_URL_LOGIN = '/api/v1/users/login'
let TOKEN
let userId
let cartId
let category
let cart
let product
let productBody


beforeAll(async () => {
  const hits = {
    email: "juan@gmail.com",
    password: "juan123"
  }
  const res = await request(app)
    .post(BASE_URL_LOGIN)
    .send(hits)

  TOKEN = res.body.token
  userId = res.body.user.id

  category = await Category.create({ name: 'Buzos' })

  productBody = {
    title: "Adidas B1",
    description: "B1 is ...",
    price: 149.90,
    categoryId: category.id
  }

  product = await Product.create(productBody)

  cart = {
    quantity: 1,
    productId: product.id
  }

})

afterAll(async () => {
  await category.destroy()
})

test("POST -> 'BASE_URL', should return status code 201 and res.body.quantity === cart.quantity", async () => {

  const res = await request(app)
    .post(BASE_URL)
    .send(cart)
    .set('Authorization', `Bearer ${TOKEN}`)

  cartId = res.body.id

  expect(res.status).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.quantity).toBe(cart.quantity)
  expect(res.body.userId).toBe(userId)
})

test("GET -> 'BASE_URL',should return status code 200 and res.body.length === 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)

  expect(res.body[0].userId).toBeDefined()
  expect(res.body[0].userId).toBe(userId)

  expect(res.body[0].product).toBeDefined()
  expect(res.body[0].productId).toBe(product.id)
  expect(res.body[0].product.id).toBe(product.id)


  // expect(res.body[0].product.productImgs).toBeDefined()
  // expect(res.body[0].product.productImgs).toHaveLength(0)

})

test("GET -> 'BASE_URL/:id',should return status code 200 and res.body.quantity === cart.quantity", async () => {
  const res = await request(app)
    .get(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.quantity).toBe(cart.quantity)

  expect(res.body.userId).toBeDefined()
  expect(res.body.userId).toBe(userId)

  expect(res.body.product).toBeDefined()
  expect(res.body.productId).toBe(product.id)
  expect(res.body.product.id).toBe(product.id)


  // expect(res.body[0].product.productImgs).toBeDefined()
  // expect(res.body[0].product.productImgs).toHaveLength(0)

})

test("PUT -> 'BASE_URL/:id',should return status code 200 and res.body.quantity === cartUpdate.quantity", async () => {
  const cartUpdate = {
    quantity: 2
  }

  const res = await request(app)
    .put(`${BASE_URL}/${cartId}`)
    .send(cartUpdate)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.quantity).toBe(cartUpdate.quantity)

})


test("DELETE -> 'BASE_URL/:id',should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(204)
  await product.destroy()
})

