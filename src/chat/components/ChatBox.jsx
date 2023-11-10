import { Message } from './Message';

export const ChatBox = ({messages}) => {
	
	return (
		<div style={{ padding: "24px", overflow: "auto", contain: "content", flex: 1 }}>
			{messages.map((message, idx) => (
				<Message key={idx} message={message} />
			))}
			<div id="messagesAnchor" style={{ margin: "8px" }} />
		</div>
	);
};
