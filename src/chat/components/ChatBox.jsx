import { useSelector } from 'react-redux';
import { Message } from './Message';
import { useEffect, useRef } from 'react';


export const ChatBox = () => {
	const messagesRef = useRef(null);
	const chatMessages = useSelector((state) => state.messages.value);
	
	
	useEffect(() => {
		messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [chatMessages])



	return (
		<div style={{flexDirection: "row", display: "flex", flex: 1, overflow: "auto"}}>
			<div id='messagesContainer' style={{ padding: "8px 12px", overflow: "auto", contain: "content", width: "100%" }}>
				{chatMessages.map((message, idx) => (
					<Message key={idx} message={message} parent_id={idx !== 0 ? chatMessages[idx - 1]["_id"] : "0"} />
				))}
				<div id="messagesAnchor" ref={messagesRef} style={{ margin: "8px" }} />
			</div>
		</div>
	);
};
