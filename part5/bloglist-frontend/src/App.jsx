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
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setSuccess(true)
      setMessage(`${title} by ${author} has been added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setSuccess(false)
      setMessage(error.response.data.message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
    <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" value={username} name="username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input type="password" value={password} name="password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
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
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm createBlog={handleCreate}></BlogForm>
        </Togglable>

        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
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