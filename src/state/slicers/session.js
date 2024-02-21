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
        updateChatName: (state, action) => {
            const oldState = state.value["chatsId"];
            const newState = oldState.map(chat => {
                if (chat["chat_id"] === action.payload.chat_id){
                    return { ...chat, name: action.payload.new_name }
                }else {
                    return chat
                }
            })
            state.value["chatsId"] = newState;
        },
        deleteSession: (state) => {
            state.value = {}
        }
    },
})

// Action creators are generated for each case reducer function
export const { setSession, deleteSession, addChatToSession, updateChatName } = sessionSlicer.actions

export default sessionSlicer.reducer