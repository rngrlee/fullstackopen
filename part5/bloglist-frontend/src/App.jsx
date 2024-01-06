import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notif from './components/Notif'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    getBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setSuccess(false)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreate = async (newBlog) => {
    try {
      await blogService.create(newBlog)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      setSuccess(true)
      setMessage(`${newBlog.title} by ${newBlog.author} has been added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setSuccess(false)
      console.log(error)
      setMessage(error.response.data.error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (updatedBlog) => {
    console.log('liked', updatedBlog.title)
    try {
      await blogService.update(updatedBlog.id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
    } catch (error) {
      console.log(error.response.data.error)
      setMessage(error.response.data.error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (deletedBlog) => {
    try {
      if (window.confirm(`Remove blog ${deletedBlog.title} by ${deletedBlog.author}`)) {
        await blogService.remove(deletedBlog.id)
        setSuccess(true)
        setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id))
        setMessage(`${deletedBlog.title} by ${deletedBlog.author} has been removed`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } catch (error) {
      console.log(error.response.data.error)
    }
  }

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" value={username} id="username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input type="password" value={password} id="password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit" id='login-button'>login</button>
      </form>
    </>
  )

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <>
        <h2>blogs</h2>
        <div>
          {user.name} logged in
          <button type="submit" onClick={handleLogout}>logout</button>
        </div>

        <br></br>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm createBlog={handleCreate}></BlogForm>
        </Togglable>

        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} user={user} updateBlog={handleLike} deleteBlog={handleDelete}/>
        )}
      </>
    )
  }

  return (
    <div>
      <Notif message={message} success={success}/>
      {user === null
        ? loginForm()
        : blogForm()}
    </div>
  )
}

export default App