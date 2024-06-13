import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useSelector, useDispatch } from "react-redux";
import { setActiveChat } from '../../state/slicers/active_chat';
import { addChatToSession, setSession } from '../../state/slicers/session';
import { toast, ToastContainer } from 'react-toastify';
import MoonLoader from "react-spinners/MoonLoader";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import delete_icon from "../../assets/delete.png";
import { Button } from 'flowbite-react';

import menu_icon from "../../assets/menu_icon.svg";
//import profile_icon from "../../assets/profile_icon.png"
import bot_conv from "../../assets/bot_conv_icon.png";


import "../../styles/chatsbar.css";

const ChatsBar = () => {
    const userSession = useSelector((state) => state.session)
    const stateChatId = useSelector((state) => state.active_chat.value);
    const [userChats, setUserChats] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("User Data updated in Store");
        if (userSession.value.chatsId && userSession.value.chatsId.length) {
            setUserChats(userSession.value.chatsId)
        }
    }, [userSession]);

    const closeSession = () => {
        localStorage.clear()
        dispatch(setSession({}));
        return navigate("/login", { replace: true })

    }

    const createNewChat = () => {
        const tk = localStorage.getItem("token");
        if (!tk) {
            console.log("Ha ocurrido un error al obtener la token");
            return navigate("/login", { replace: true })
        }
        setIsLoading(true);
        axios.post(`/api/users/new_chat`, {}, { "headers": { "Authorization": tk } }).then(r => {
            if (r.status !== 201) {
                toast.error("Ha ocurrido un error al crear el chat");
                return
            }
            const { chat_info } = r.data;
            dispatch(addChatToSession(chat_info));
            dispatch(setActiveChat(chat_info["chat_id"]));
        }).catch(error => {
            console.log(error);
            if (error.response.data) {
                toast.warn(error.response.data.error)
            } else {
                toast.error("Ha ocurrido un error al crear el Chat. Intente de nuevo.");
            }
        }).finally(() => { setIsLoading(false) });
    }

    const DeleteChat = ({ chatid }) => {
        const [isDeleting, setIsDeleting] = useState(false);

        const handleDeleteChat = () => {
            const tk = localStorage.getItem("token");
            if (!tk) {
                toast.error("Ha ocurrido un error al obtener la token");
            }
            const headers = {
                "Authorization": tk
            }
            setIsDeleting(true);
            axios.post(`/api/users/delete_chat?chat_id=${chatid}`, {}, { headers: headers }).then(r => {
                if (r.status !== 200) {
                    toast.warning(r.data.error)
                    return
                }

                toast.success(r.data.message);

            }).catch(error => {
                console.log(error);
                toast.error("Ha ocurrido un error al realizar la peticion")
            }).finally(() => {
                setIsDeleting(false);
                // Reload user chats
                window.location.reload()
            });
        }


        return (
            isDeleting ?
                <SyncLoader color='#FFFDD0' size={6} /> :
                <img src={delete_icon} className='delete_icon' onClick={handleDeleteChat} />
        )
    }

    return (
        <Sidebar backgroundColor='transparent' width='280px' collapsed={isCollapsed} breakPoint='md' collapsedWidth='100px'>
            <Menu style={{ display: "flex", justifyContent: isCollapsed ? "center" : "end", alignItems: isCollapsed ? "center" : "end", margin: "12px 24px", cursor: "pointer" }}>
                <img onClick={() => { setIsCollapsed(!isCollapsed) }} src={menu_icon} style={{ width: "32px" }} />
            </Menu>
            <Menu style={{ maxWidth: "100%", textAlign: "center", justifyContent: "center", alignItems: "center", margin: "12px 24px" }}>
                <SubMenu
                    label="Perfil"
                    
                    icon={
                        <img src={`/api/static/${userSession.value.profilePic}?${new Date().getTime()}`}
                            style={{ borderRadius: 16 }}
                            alt='Profile Icon' />
                    }
                    style={{ backgroundColor: "transparent", textAlign: "center", marginBottom: 12 }}>
                    <MenuItem
                        onClick={() => navigate("/profile")}
                        style={{
                            color: "gray",
                            backgroundColor: isCollapsed ? "black" : "transparent"
                        }}>{userSession.value.nombre}
                    </MenuItem>
                    <MenuItem
                        style={{ fontSize: "2em" }}>
                        <Button onClick={closeSession} pill color='failure' style={{ margin: "auto", width: "100%", color: "white" }}>Cerrar Sesion</Button>
                    </MenuItem>
                </SubMenu>
                <SubMenu
                    defaultOpen
                    label="Chats"
                    icon={<img src={bot_conv} alt='Chats Icon' />}
                    style={{ backgroundColor: "transparent", textAlign: "center" }}>
                    <MenuItem
                        style={{
                            //color: "gray"
                        }}>
                        {
                            isLoading ?
                                <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", margin: 12 }}>
                                    <MoonLoader
                                        loading={true}
                                        size={28}
                                        color='white'
                                        aria-label="Loading Spinner" />
                                </div>
                                :
                                <Button onClick={createNewChat} pill color='info' style={{ margin: "auto", marginTop: 12, width: "100%", color: "white" }}>
                                    Nuevo Chat
                                </Button>

                        }
                    </MenuItem>
                    <div className='chat_separator'></div>
                    <div>
                        {
                            userChats.map(c => {
                                return (
                                    <div key={c["chat_id"]}
                                        style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: 12 }}>
                                        <MenuItem
                                            className='chat_item'
                                            style={{
                                                contain: "inline-size",
                                                borderRadius: 8,
                                                //color: stateChatId === c["chat_id"] ? "black" : "white",
                                                backgroundColor: stateChatId === c["chat_id"] ? "#F5F5F5" : "transparent"
                                            }} onClick={() => dispatch(setActiveChat(c["chat_id"]))}>
                                            {
                                                c["chat_id"] !== c["name"] ? c["name"] : `Chat ${c['name']}`
                                            }
                                        </MenuItem>
                                        <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <DeleteChat chatid={c["chat_id"]} />
                                        </div>
                                    </div>

                                )
                            })
                        }
                    </div>
                    
                </SubMenu>
            </Menu>
        </Sidebar>
    )
}

export default ChatsBar