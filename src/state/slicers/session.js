import { createSlice } from '@reduxjs/toolkit'

export const sessionSlicer = createSlice({
    name: 'session',
    initialState: {
        value: {},
    },
    reducers: {
        setSession: (state, action) => {
            state.value = action.payload
        },
        addChatToSession: (state, action) => {
            state.value["chatsId"] = [...state.value["chatsId"], action.payload ]
        },
        deleteSession: (state) => {
            state.value = {}
        }
    },
})

// Action creators are generated for each case reducer function
export const { setSession, deleteSession, addChatToSession } = sessionSlicer.actions

export default sessionSlicer.reducer