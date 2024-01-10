import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { addNotif, removeNotif } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const filtered = filter === ''
        ? [...anecdotes]
        : anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    const dispatch = useDispatch()

    const vote = (id) => {
        const votedFor = anecdotes.find(anecdote => anecdote.id === id)
        dispatch(addNotif(`you voted '${votedFor.content}'`))
        setTimeout(() => {
            dispatch(removeNotif())
        }, 5000)
        dispatch(voteFor(id))
    }

    return (
        <>
            {filtered.sort((a, b) => b.votes - a.votes).map(anecdote =>
            <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
            </div>
            )}
        </>
    )
}

export default AnecdoteList