import { ChatBox } from '../components/ChatBox';
import { SendMessage } from '../components/SendMessage';

// TODO: Realizar la sidebar
// TODO: Darle contexto emisor-receptor

export const ChatRoom = () => {
	return (
		<div>
			<ChatBox />
			<SendMessage />
		</div>
	);
};
