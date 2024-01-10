import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        addNotif(state, action) {
            return action.payload
        },
        removeNotif(state, action) {
            return null
        }
    }
})

export const { addNotif, removeNotif } = notificationSlice.actions
export default notificationSlice.reducer