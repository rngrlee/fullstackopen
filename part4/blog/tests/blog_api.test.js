const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('..models/blog')

const initalBlogs = [
    {
        title: 'Blog 1',
        author: 'Blogger 1',
        url: 'https://blog1.com',
        likes: 69
    },
    {
        title: 'Blog 2',
        author: 'Blogger 2',
        url: 'https://blog2.com',
        likes: 420
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('id property of exists for each blog post', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('new blog can be added', async () => {

    const newBlog = {
        title: 'New Blog',
        author: 'New Blog Author',
        url: 'https://newblog.com',
        likes: 0
    }

    await api
        .post(/api/blogs)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    expect(response.body).toHaveLength(initalBlogs + 1)
    expect(titles).toContain('New Blog')
})
  

afterAll(async () => {
    await mongoose.connection.close()
})