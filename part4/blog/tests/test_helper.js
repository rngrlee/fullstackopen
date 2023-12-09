const Blog = require('../models/blog')
const User = require('../models/user')

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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}