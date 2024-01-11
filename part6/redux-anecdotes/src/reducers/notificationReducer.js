import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        addNotif(state, action) {
            return action.payload
        },
        // eslint-disable-next-line no-unused-vars
        removeNotif(state, action) {
            return null
        }
    }
})

export const { addNotif, removeNotif } = notificationSlice.actions

export const setNotification = (message, delay) => {
    return (dispatch) => {
        dispatch(addNotif(message))
        setTimeout(() => {
            dispatch(removeNotif())
        }, delay * 1000)
    }
}

export default notificationSlice.reducer