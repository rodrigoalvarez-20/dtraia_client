import { createSlice } from '@reduxjs/toolkit'

export const codePanelSlicer = createSlice({
    name: 'code_panel',
    initialState: {
        value: {
            isOpened: false,
            code_execute: ""
        },
    },
    reducers: {
        togglePanel: (state) => {
            state.value.isOpened = !state.value.isOpened
        },
        setCodeToExecute: (state, action) => {
            state.value.code_execute = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { togglePanel, setCodeToExecute } = codePanelSlicer.actions

export default codePanelSlicer.reducer