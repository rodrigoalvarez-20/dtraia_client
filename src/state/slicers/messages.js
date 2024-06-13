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
        },
        updateRate: (state, action) => {
            state.value = state.value.map((v) => v["_id"] === action.payload.message_id ? { ...v, "rate": action.payload.rate } : v )
        }
    },
})

// Action creators are generated for each case reducer function
export const { setInitialMessages, addMessage, updateRate } = messagesSlicer.actions

export default messagesSlicer.reducer