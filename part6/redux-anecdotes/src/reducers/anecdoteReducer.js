import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteFor(state, action) {
      const id = action.payload
      const selectedAnecdote = state.find(anecdote => anecdote.id === id)
      const changedAnecdote = { ...selectedAnecdote, votes: selectedAnecdote.votes++ }
      state.map(anecdote => anecdote.id === id ? changedAnecdote : anecdote)
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteFor, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer