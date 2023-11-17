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

module.exports = {
  dummy, totalLikes, favoriteBlog
}