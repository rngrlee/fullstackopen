const maxBy = require('lodash/maxBy')
const sumBy = require('lodash/sumBy')
const groupBy = require('lodash/groupBy')
const orderBy = require('lodash/orderBy')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) return 0
    const reducer = (sum, blog) => sum + blog.likes
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}
    const highestLikes = Math.max(...blogs.map(blog => blog.likes))
    const index = blogs.findIndex(blog => blog.likes === highestLikes)
    return blogs[index]

}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return {}
    const { author, } = maxBy(blogs, (blog) => blog.author)
    const reducer = (sum, element) => element.author === author ? sum + 1 : sum
    const blogsByAuthor = blogs.reduce(reducer, 0)
    return { author: author, blogs: blogsByAuthor }
}

// const mostLikes = (blogs) => {
//     if (blog.lengths === 0) return {}
//     const groupedAuthors = groupBy(blogs, (blog) => blog.author)
//     for (const author in groupedAuthors) {
//         if (Object.hasOwnProperty)
//     }
// }

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}