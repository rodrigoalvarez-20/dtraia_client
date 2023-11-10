import { ChatBox } from '../components/ChatBox';
import { SendMessage } from '../components/SendMessage';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import axios from "axios"
import ChatsBar from '../../ui/components/ChatsBar';
import { deleteSession } from '../../state/slicers/session';
import { setInitialMessages } from '../../state/slicers/messages';
import { useNavigate } from 'react-router-dom';

const ChatRoom = () => {
	const stateChatId = useSelector((state) => state.active_chat.value);
	const chatMessages = useSelector((state) => state.messages.value);
	const sessionState = useSelector((state) => state.session.value);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	useEffect(() => {
		if (Object.keys(sessionState).length === 0){
			navigate ("/login", { replace: true });
		}
	}, [])

	useEffect(() => {
		console.log("Chat Messages updated");
		const msgA = window.document.getElementById("messagesAnchor");
		if (msgA){
			msgA.scrollIntoView()
		}
		
	}, [chatMessages])

	useEffect(() => {
		if (stateChatId){
			const tk = localStorage.getItem("token");
			if (!tk){
				console.log("Ha ocurrido un error al obtener la token");
			}
			axios.get(`http://localhost:8000/api/users/chat_history?chat_id=${stateChatId}`, { "headers": {"Authorization": tk}}).then(r => {
				console.log(r.data)
				dispatch(setInitialMessages({ "data": r.data["messages"] }))
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


	return (
		<div style={{ height: "100%", display: "flex" }}>
			<ChatsBar />
			{
				stateChatId === "" ? <p>Renderizar Tutorial</p> :
					<div style={{ display: "flex", flexDirection: "column", width: "-webkit-fill-available", contain: "size" }}>
						<ChatBox messages={chatMessages} />
						<SendMessage />
					</div>
			}

		</div>
	);
};

export default ChatRoom