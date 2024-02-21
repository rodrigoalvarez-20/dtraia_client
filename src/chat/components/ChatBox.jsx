import { useSelector } from 'react-redux';
import { Message } from './Message';
import { useEffect, useRef } from 'react';

export const ChatBox = () => {
	const messagesRef = useRef(null);
	const chatMessages = useSelector((state) => state.messages.value);
	
	useEffect(() => {
		//console.log("Chat Messages updated");
		//console.log(messagesRef.current)
		messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [chatMessages])


	return (
		<div id='messagesContainer' style={{ padding: "24px", overflow: "auto", contain: "content", flex: 1 }}>
			{chatMessages.map((message, idx) => (
				<Message key={idx} message={message} />
			))}
			<div id="messagesAnchor" ref={messagesRef} style={{ margin: "8px" }} />
		</div>
	);
};
