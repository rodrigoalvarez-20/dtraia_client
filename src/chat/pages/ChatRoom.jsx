import { ChatBox } from '../components/ChatBox';
import { SendMessage } from '../components/SendMessage';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import axios from "axios"
import ChatsBar from '../../ui/components/ChatsBar';
import { deleteSession } from '../../state/slicers/session';
import { setInitialMessages } from '../../state/slicers/messages';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";

import chatholder from "../../assets/chats_animation.json";


const ChatRoom = () => {
	const stateChatId = useSelector((state) => state.active_chat.value);
	const sessionState = useSelector((state) => state.session.value);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	useEffect(() => {
		if (Object.keys(sessionState).length === 0){
			navigate ("/login", { replace: true });
		}
	}, [])

	useEffect(() => {
		if (stateChatId){
			const tk = localStorage.getItem("token");
			if (!tk){
				console.log("Ha ocurrido un error al obtener la token");
			}
			axios.get(`${import.meta.env.VITE_API_HOST}/api/users/chat_history?chat_id=${stateChatId}`, { "headers": {"Authorization": tk}}).then(r => {
				console.log(r.data)
				const fmtMsgs = r.data["messages"].map(m => { return { ...m, message: m.message.replace("Not applicable if the user asks about another topic.", "").trim()  }})
				dispatch(setInitialMessages({ "data": fmtMsgs }))
				//setChatMessages()
			}).catch(e => {
				console.log(e.response)
				if (e.response && e.response.status === 401){
					dispatch(deleteSession());
					return navigate("/login", { replace: true })
				}
			});
		}
	}, [stateChatId]);


	const TutorialComponent = () => {
		return (
			<div style={{ display: "flex", justifyContent:"center", alignItems: "center", margin:"auto", marginTop: "24px" }}>
				<Lottie animationData={chatholder} loop={true} style={{ height: "50%", width: "80%" }} />
			</div>
		)
	}

	return (
		<div style={{ height: "100%", display: "flex" }}>
			<ChatsBar />
			{
				stateChatId === "" ? <TutorialComponent /> :
					<div style={{ display: "flex", flexDirection: "column", width: "100%", contain: "size" }}>
						<ChatBox />
						<SendMessage />
					</div>
			}

		</div>
	);
};

export default ChatRoom