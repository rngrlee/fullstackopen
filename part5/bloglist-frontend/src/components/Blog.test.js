import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('Blog', () => {
  const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'testurl.com',
    id: '696969',
    user: {
      name: 'Ranger',
      username: 'rangerl',
      id: '123'
    },
    likes: 5
  }

  let container
  const mockHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={blog.user} updateBlog={mockHandler}/>
    ).container
  })

  test('renders only title and author', () => {
    const title = screen.queryByText(blog.title)
    const author = screen.queryByText(blog.author)
    const url = screen.queryByText(blog.url)
    const likes = screen.queryByText(blog.likes)

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('renders url and likes after button press', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.setVisible')
    await user.click(button)

    const url = screen.queryByText(blog.url)
    const likes = screen.queryByText(blog.likes)

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('event handler is called twice when like button is pressed twice', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.setVisible')
    await user.click(button)

    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
