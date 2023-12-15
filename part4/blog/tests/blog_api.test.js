const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'user1', password: passwordHash })
    await user.save()

    const userForToken = {
        username: user.username,
        id: user._id
    }

    token = jwt.sign(userForToken, process.env.SECRET)

    await Blog.deleteMany({})
    helper.initialBlogs.forEach(async blog => {
        let blogObject = new Blog(blog)
        await blogObject.save()
    })
})
describe('when there are notes already saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('correct amount of blog posts', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('id property exists for each blog post', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            expect(blog.id).toBeDefined()
        })
    })
})

describe('when adding a new blog', () => {
    test('new blog can be added with valid request and authorization', async () => {

        const newBlog = {
            title: 'New Blog',
            author: 'New Blog Author',
            url: 'https://newblog.com',
            likes: 0
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsInDb = await helper.blogsInDb()
        const titles = blogsInDb.map(blog => blog.title)
        expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain('New Blog')
    })

    test('fails with 401 status code if token is missing', async () => {

        const newBlog = {
            title: 'no token',
            author: 'no token writer',
            url: 'https://notoken.com',
            likes: 11
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('authorization', '')
            .expect(401)
    })
      
})

describe('missing properties', () => {
    test('likes property is missing, set default value to 0', async () => {

        const newBlog = {
            title: 'New Blog',
            author: 'New Blog Author',
            url: 'https://newblog.com',
        }
    
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('authorization', `Bearer ${token}`)
        expect(response.body.likes).toEqual(0)
    })
    test('title missing', async () => {
        const newBlog = {
            author: 'Title missing',
            url: 'https://titlemissing.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('authorization', `Bearer ${token}`)
            .expect(400)
    })

    test('author missing', async () => {
        const newBlog = {
            title: 'Author missing',
            url: 'https://authormissing.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('authorization', `Bearer ${token}`)
            .expect(400)
    })
})

describe('deleting a blog post', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogToRemove = {
            title: 'to be removed',
            author: 'remover',
            url: 'https://gonnaberemoved.com',
            likes: 69
        }

        const result = await api
            .post('/api/blogs')
            .send(blogToRemove)
            .set('authorization', `Bearer ${token}`)

        const startingBlogs = await helper.blogsInDb()

        await api
            .delete(`/api/blogs/${result.body.id}`)
            .set('authorization', `Bearer ${token}`)
            .expect(204)

        const endingBlogs = await helper.blogsInDb()
        expect(endingBlogs).toHaveLength(startingBlogs.length - 1)
        const titles = endingBlogs.map(blog => blog.title)
        expect(titles).not.toContain(blogToRemove.title)
    })
})

// describe('updating a blog post', () => {
//     test('succeeds with status code 200 if id is valid', async () => {
//     const startingBlogs = await helper.blogsInDb()
//     const blogToUpdate = startingBlogs[0]
//     const newBlogData = {
//         likes: 9001
//     }

//     await api
//         .put(`/api/blogs/${blogToUpdate.id}`)
//         .send(newBlogData)
//         .expect(200)

//     const endingBlogs = await helper.blogsInDb()
//     expect(endingBlogs[0].likes).toEqual(9001)
//     })
// })

afterAll(async () => {
    await mongoose.connection.close()
})