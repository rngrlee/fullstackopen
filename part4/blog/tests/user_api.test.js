const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('user creation', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        
        const passwordHash = await bcrypt.hash('password', 10)
        const user = new User({ username: 'benjamin', passwordHash })
    
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'rangerl',
            name: 'Ranger Lee',
            password: 'notmyrealpassword'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'benjamin',
                name: 'Benjamin Eleven',
                password: 'randompass'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('expected `username` to be unique')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
    })
})

describe('user creation restrictions', () => {
    test('fails if username is less than 3 characters', async () => {
        const newUser = {
            username: 'ro',
            name: 'Roland',
            password: 'capper'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        expect(result.body.error).toContain('Username must be at least 3 characters long')
    })

    test('fails if password is less than 3 characters', async () => {
        const newUser = {
            username: 'rolandz',
            name: 'Roland',
            password: 'ca'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        expect(result.body.error).toContain('Password must be at least 3 characters long')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})