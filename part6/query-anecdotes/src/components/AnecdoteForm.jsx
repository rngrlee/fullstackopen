import { useQueryClient, useMutation } from '@tanstack/react-query'
import { create } from '../services/requests'
import { useNotifDispatch } from '../NotifContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotifDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
    onError: () => {
      dispatch({ type: 'SHOW', payload: 'anecdote must be 5 or more characters!' })
      setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0 })
    await dispatch({ type: 'SHOW', payload: `anecdote '${content}' created` })
    setTimeout(() => {
      dispatch({ type: 'HIDE' })
    }, 5000)
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
