import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useSelector, useDispatch } from "react-redux";
import { setActiveChat } from '../../state/slicers/active_chat';
import { addChatToSession } from '../../state/slicers/session';
import { toast, ToastContainer } from 'react-toastify';
import { OrbitProgress } from "react-loading-indicators";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatsBar = () => {
    const userSession = useSelector((state) => state.session)
    const stateChatId = useSelector((state) => state.active_chat.value);
    const [userChats, setUserChats] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("User Data updated in Store");
        if (userSession.value.chatsId && userSession.value.chatsId.length) {
            setUserChats(userSession.value.chatsId)
        }
    }, [userSession]);


    const createNewChat = () => {
        const tk = localStorage.getItem("token");
        if (!tk) {
            console.log("Ha ocurrido un error al obtener la token");
            return navigate("/login", { replace: true })
        }
        axios.post("http://localhost:8000/api/users/new_chat", {}, { "headers": { "Authorization": tk } }).then(r => {
            if (r.status !== 201) {
                toast.error("Ha ocurrido un error al crear el chat");
                return
            }
            const { chat_info } = r.data;
            dispatch(addChatToSession(chat_info));
            dispatch(setActiveChat(chat_info["name"]));
        }).catch(error => {
            console.log(error);
            if (error.response.data) {
                toast.warn(error.response.data.error)
            } else {
                toast.error("Ha ocurrido un error al crear el Chat. Intente de nuevo.");
            }
        }).finally(() => { });
    }

    return (
        <Sidebar backgroundColor="#1e1b4b" breakPoint='md'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                theme="light"
            />
            <Menu style={{ padding: 12, contain: "size" }}>
                {
                    isLoading ? <OrbitProgress color="#1200ff" size="small" text="" textColor="" /> :
                        <MenuItem style={{ textAlign: "center", borderRadius: 12 }}>

                            <button onClick={createNewChat} >
                                Nuevo Chat
                            </button>
                        </MenuItem>
                }

                <div style={{
                    width: "80%", backgroundColor: "gray",
                    height: "3px", margin: "auto",
                    justifyContent: "center",
                    marginTop: "12px", marginBottom: "12px"
                }}></div>
                {
                    userChats.map(c => {
                        return <MenuItem
                            className='mt-4'
                            style={{ textAlign: "center", borderRadius: 12, backgroundColor: stateChatId === c["name"] ? "#F5F5F5" : "transparent" }}
                            onClick={() => dispatch(setActiveChat(c["name"]))} key={c["name"]}>
                            Chat {c["name"]}
                        </MenuItem>
                    })
                }
            </Menu>
        </Sidebar>
    )
}

export default ChatsBar