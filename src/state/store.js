import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from "./slicers/session";
import active_chatReducer from "./slicers/active_chat";
import messagesReducer from "./slicers/messages";
import codePanelReducer from "./slicers/code_panel";

export default configureStore({
    reducer: {
        session: sessionReducer,
        active_chat: active_chatReducer,
        messages: messagesReducer,
        code_panel: codePanelReducer
    }
})