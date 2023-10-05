import user_pic from "../../assets/user_pic.jpg"
import ai_pic from "../../assets/ai_pic.jpg"


export const Message = ({ message }) => {
	return (
		<div>
			<div className="chat chat-start">
				<div className="chat-image avatar">
					<div className="w-10 rounded-full">
						<img src={message.type === "USER" ? user_pic : ai_pic} />
					</div>
				</div>
				<div className="chat-header">{message.name}</div>
				<div className="chat-bubble">{message.text}</div>
				{
					//<div className="chat-footer opacity-50">Delivered</div>
				}
			</div>
		</div>
	);
};
