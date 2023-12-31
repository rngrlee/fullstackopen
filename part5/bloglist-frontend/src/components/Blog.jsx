import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const viewedBlog = () => {
    return (
      <>
        {blog.url}<br />
        likes: {blog.likes} <button>like</button><br />
        {blog.user.name}
      </>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && viewedBlog()}
    </div>  
  )
}

export default Blog