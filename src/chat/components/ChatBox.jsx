import { Message } from './Message';

export const ChatBox = () => {
	const messages = [
		{
			id: 1,
			text: 'Hola',
			name: 'Usuario',
			type: "USER"
		},
		{
			id: 2,
			text: 'Texto de prueba',
			name: 'Asistente',
			type: "AI"
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
