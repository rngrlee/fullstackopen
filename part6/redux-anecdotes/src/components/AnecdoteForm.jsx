import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { addNotif, removeNotif } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const createNew = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(addNotif(`you added '${content}'`))
        setTimeout(() => {
            dispatch(removeNotif())
        }, 5000)
        dispatch(createAnecdote(content))
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={createNew}>
                <div><input name='anecdote'/></div>
                <button type='submit'>create</button>
            </form>
        </>
    )
}

export default AnecdoteForm