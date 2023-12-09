const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
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
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain('New Blog')
    })
      
})

describe('missing properties', () => {
    test('likes property is missing, set default value to 0', async () => {

        const newBlog = {
            title: 'New Blog',
            author: 'New Blog Author',
            url: 'https://newblog.com',
        }
    
        const response = await api.post('/api/blogs').send(newBlog)
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

describe('deleting a blog post', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const startingBlogs = await helper.blogsInDb()
        const blogToRemove = startingBlogs[0]

        await api
            .delete(`/api/blogs/${blogToRemove.id}`)
            .expect(204)

        const endingBlogs = await helper.blogsInDb()
        expect(endingBlogs).toHaveLength(startingBlogs.length - 1)
        const titles = endingBlogs.map(blog => blog.title)
        expect(titles).not.toContain(blogToRemove.title)
    })
})

describe('updating a blog post', () => {
    test('succeeds with status code 200 if id is valid', async () => {
    const startingBlogs = await helper.blogsInDb()
    const blogToUpdate = startingBlogs[0]
    const newBlogData = {
        likes: 9001
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlogData)
        .expect(200)

    const endingBlogs = await helper.blogsInDb()
    expect(endingBlogs[0].likes).toEqual(9001)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})