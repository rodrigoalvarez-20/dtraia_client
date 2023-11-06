import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useSelector, useDispatch } from "react-redux";
import { setActiveChat } from '../../state/slicers/active_chat';

const ChatsBar = () => {
    const userSession = useSelector((state) => state.session)
    const stateChatId = useSelector((state) => state.active_chat.value);
    const [userChats, setUserChats] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("User Data updated in Store");
        if (userSession.value.chatsId && userSession.value.chatsId.length){
            setUserChats(userSession.value.chatsId)
        }
    }, [userSession]);


    const createNewChat = () => {
        
    }

    return (
        <Sidebar backgroundColor="#1e1b4b" breakPoint='md'>
            <Menu style={{ padding: 12 }}>
                <MenuItem style={{textAlign: "center", borderRadius: 12}}>
                    <button onClick={createNewChat} >
                        Nuevo Chat
                    </button>
                </MenuItem>
                <div style={{ 
                    width: "80%", backgroundColor:"gray", 
                    height: "3px", margin: "auto", 
                    justifyContent: "center", 
                    marginTop: "12px", marginBottom: "12px" }}></div>
                {
                    userChats.map(c => {
                        return <MenuItem style={{ textAlign: "center", borderRadius: 12, backgroundColor: stateChatId === c ? "#F5F5F5" : "transparent" }} onClick={() => dispatch(setActiveChat(c))} key={c}>Chat {c}</MenuItem>
                    })
                }
            </Menu>
        </Sidebar>
    )
}

export default ChatsBar