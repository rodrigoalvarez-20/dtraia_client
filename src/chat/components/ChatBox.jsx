import { Message } from './Message';

export const ChatBox = () => {
	const messages = [
		{
			id: 1,
			text: 'Hello there',
			name: 'Adrian Rodriguez',
		},
		{
			id: 2,
			text: 'Hi!',
			name: 'Rodrigo Alvarez',
		},
	];

	return (
		<div className="pb-44 pt-20 containerWrap">
			{messages.map((message) => (
				<Message key={message.id} message={message} />
			))}
		</div>
	);
};
