const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

const samuel = { username: 'samuel', password: 'doggy' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach( async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe('server.js', () => {
  it('should set testing environment', () => {
    expect(process.env.NODE_ENV).toBe('testing')
  })
})

describe('[POST] /register', () => {
  it('should return the newly created user', async () => {
    const res = await request(server).post('/api/auth/register').send(samuel)
    //console.log('samuel: ', samuel)
    console.log('REGISTER Response Body: ' , res.body)
    expect(res.body.username).toBe('samuel')
  })
  it('should return the user list with correct length after new user added', async () => {
    const res = await request(server).post('/api/auth/register').send(samuel)
    //console.log('samuel: ', samuel)
    //console.log('response body: ' , res.body[0])
    expect(res.body.username).toBe('samuel')

    const res2 = await request(server).get('/api/users')
    expect(res2.body).toHaveLength(1)
  })
})

describe('[POST] /login', () => {
  it('should resolve an "invalid credentials" method when user logs in with incorrect password', async () => {
     await request(server).post('/api/auth/register').send(samuel)

     const res = await request(server).post('/api/auth/login').send({username: 'samuel', password: 'cat'})
     //console.log(res.body.message)
     expect(res.body.message).toContain('invalid credentials')

  })
  it('should produce a json web token upon valid login', async () => {
    const newUser = await request(server).post('/api/auth/register').send(samuel)
    console.log('TEST LOG, register new user response: ', newUser)

    const res = await request(server).post('/api/auth/login').send(samuel)
    console.log('TEST LOG, login response: ', res.body)
    expect(res.body.token).toBeDefined()

    const jwtToken = res.body.token
    console.log('TEST LOG, login token: ', jwtToken)

    const getRes = await request(server).get('/api/jokes').set(`Authorization`, `Bearer ${jwtToken}`)
    console.log('TEST LOG, jokes response: ', getRes)
    //console.log('Log Test Jokes Body: ', getRes.body)
    expect(getRes.statusCode).toBe(200)
  })
})

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})
