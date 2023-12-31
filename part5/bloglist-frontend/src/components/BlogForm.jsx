import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>

      <form onSubmit={handleCreate}>
        <div>
          title:
          <input value={title} className="title" onChange={event => setTitle(event.target.value)} />
        </div>
        <div>
          author:
          <input value={author} className="author" onChange={event => setAuthor(event.target.value)} />
        </div>
        <div>
          url:
          <input value={url} className="url" onChange={event => setUrl(event.target.value)} />
        </div>
        <button type="submit" id='create'>create</button>
      </form>
    </>
  )
}

export default BlogForm
