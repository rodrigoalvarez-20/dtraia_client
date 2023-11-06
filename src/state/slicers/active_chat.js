import { createSlice } from '@reduxjs/toolkit'

export const activeChatSlicer = createSlice({
    name: 'active_chat',
    initialState: {
        value: "",
    },
    reducers: {
        setActiveChat: (state, action) => {
            state.value = action.payload
        },
        deleteActiveChat: (state) => {
            state.value = ""
        }
    },
})

// Action creators are generated for each case reducer function
export const { setActiveChat, deleteActiveChat } = activeChatSlicer.actions

export default activeChatSlicer.reducer