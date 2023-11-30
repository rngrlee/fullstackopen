const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
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

test('id property exists for each blog post', async () => {
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
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain('New Blog')
})
  
test('likes property is missing, set default value to 0', async () => {

    const newBlog = {
        title: 'New Blog',
        author: 'New Blog Author',
        url: 'https://newblog.com',
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.body.likes).toEqual(0)
})

describe('missing properties', () => {
    test('title missing', async () => {
        const newBlog = {
            author: 'Title missing',
            url: 'https://titlemissing.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
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
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})