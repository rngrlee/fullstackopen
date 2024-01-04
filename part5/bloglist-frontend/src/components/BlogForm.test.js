import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
    test('calls event handler properly upon blog creation', async () => {
        const mockHandler = jest.fn()
        const user = userEvent.setup()

        const container = render(<BlogForm createBlog={mockHandler}/>).container

        const title = container.querySelector('.title')
        const author = container.querySelector('.author')
        const url = container.querySelector('.url')
        const createButton = screen.getByText('create')

        await user.type(title, 'Test Title')
        await user.type(author, 'Test Author')
        await user.type(url, 'testurl.com')
        await user.click(createButton)

        expect(mockHandler.mock.calls).toHaveLength(1)
        expect(mockHandler.mock.calls[0][0]).toEqual({
            title: 'Test Title',
            author: 'Test Author',
            url: 'testurl.com'
        })
    })
})