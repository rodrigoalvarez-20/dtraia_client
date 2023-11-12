import { createSlice } from '@reduxjs/toolkit'

export const messagesSlicer = createSlice({
    name: 'messages',
    initialState: {
        value: [],
    },
    reducers: {
        setInitialMessages: (state, action) => {
            state.value = action.payload.data
        },
        addMessage: (state, action) => {
            state.value = [ ...state.value, action.payload.data ]
        }
    },
})

// Action creators are generated for each case reducer function
export const { setInitialMessages, addMessage } = messagesSlicer.actions

export default messagesSlicer.reducer