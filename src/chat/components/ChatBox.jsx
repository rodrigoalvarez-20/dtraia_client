import { Message } from './Message';

export const ChatBox = ({messages}) => {
	
	return (
		<div style={{ padding: "24px", overflow: "auto", contain: "content", height: "80%" }}>
			{messages.map((message, idx) => (
				<Message key={idx} message={message} />
			))}
			<div id="messagesAnchor" />
		</div>
	);
};
