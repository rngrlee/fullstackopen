import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAll, update } from './services/requests'
import { useNotifDispatch } from './NotifContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotifDispatch()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  })

  const handleVote = async (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    await dispatch({ type: 'SHOW', payload: `anecdote '${anecdote.content}' voted`})
    setTimeout(() => {
      dispatch({ type: 'HIDE'})
    }, 5000)
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
