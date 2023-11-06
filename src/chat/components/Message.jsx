import user_pic from "../../assets/user_pic.jpg"
import ai_pic from "../../assets/ai_pic.jpg"


export const Message = ({ message }) => {

	function format_chat_message(msg){
		return msg.replace(/\n/g, "<br />").replace(/(\s){4}/g, "&emsp;")
	}


	return (
		<div>
			<div className="chat chat-start">
				<div className="chat-image avatar">
					<div className="w-10 rounded-full">
						<img src={message.type === "human" ? user_pic : ai_pic} />
					</div>
				</div>
				<div className="chat-header">{message.type === "human" ? "Usuario" : "Asistente"}</div>
				<div className="chat-bubble" dangerouslySetInnerHTML={{ __html: format_chat_message(message.message) }}></div>
				{
					//<div className="chat-footer opacity-50">Delivered</div>
				}
			</div>
		</div>
	);
};
