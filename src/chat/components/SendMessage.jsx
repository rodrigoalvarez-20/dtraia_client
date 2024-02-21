import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import axios from "axios"
import { addMessage } from '../../state/slicers/messages';
import { updateChatName } from '../../state/slicers/session';
import MoonLoader from "react-spinners/MoonLoader";

export const SendMessage = () => {
	const stateChatId = useSelector((state) => state.active_chat.value);
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValue] = useState('');
	const [inputHeight, setInputHeight] = useState(46);
	const dispatch = useDispatch();

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!value) {
			console.log("Campo vacio");
			return
		}

		let payload = {
			"question": value
		}

		let actual_date = new Date();
		const actualMonth = actual_date.getMonth() + 1;
		const fmt_date = `${actual_date.getDate()}-${actualMonth}-${actual_date.getFullYear()}`
		const fmt_hour = `${actual_date.getHours()}:${actual_date.getMinutes().toString().padStart(2, "0")}:${actual_date.getSeconds().toString().padStart(2, "0")}`

		const fmt_datetime = `${fmt_date} ${fmt_hour}`

		dispatch(addMessage({ "data": {
			"type": "human",
			"message": value,
			"datetime": fmt_datetime
		}}));

		const tk = localStorage.getItem("token");
		setIsLoading(true);
		axios.post(`${import.meta.env.VITE_API_HOST}/api/chat/${stateChatId}`, payload, { "headers": { "Authorization": tk }, timeout: 1000*120 }).then(r => {
			//console.log(r.data);
			//Añadir la respuesta de la IA
			let actual_date = new Date();
			const actualMonth = actual_date.getMonth() + 1;
			const fmt_date = `${actual_date.getDate()}-${actualMonth}-${actual_date.getFullYear()}`
			const fmt_hour = `${actual_date.getHours()}:${actual_date.getMinutes().toString().padStart(2, "0")}:${actual_date.getSeconds().toString().padStart(2, "0")}`

			const fmt_datetime = `${fmt_date} ${fmt_hour}`

			dispatch(addMessage({
				"data": {
					"type": "ai",
					"message": r.data.message,
					"datetime": fmt_datetime
				}
			}));

			const new_topic = r.data.topic;

			dispatch(updateChatName({ "chat_id": stateChatId, "new_name": new_topic }))

		}).catch(e => {
			console.log(e)
		}).finally(() => {
			setIsLoading(false);
			setValue("");
		})
		

	};


	return (
		<div
			style={{ }}
			className="bg-slate-300 bottom-0 py-10 shadow-lg">
			<form style={{ display: "flex", margin: "auto", width: "80%", color: "#555555" }} onSubmit={handleSendMessage}>
				<textarea
					value={value}
					disabled={isLoading}
					rows={5}
					onChange={(e) => {
						setValue(e.target.value)
						if (e.target.value === "") {
							setInputHeight(46)
						} else {
							setInputHeight(e.target.scrollHeight + 2)
						}
						
					}}
					style={{
						height: `${Math.max(46, inputHeight)}px`,
						maxHeight: "160px"
					 }}
					className="input w-full focus:outline-none bg-gray-100 rounded-r-none"
					type="text"
				/>
				{
					isLoading ? 
					<div style={{ margin: "auto 12px" }}>
							<MoonLoader
								loading={true}
								size={32}
								color='#1200ff'
								aria-label="Loading Spinner" />
					</div> :
						<button
							type="submit"
							className="w-auto bg-gray-500 text-white rounded-r-lg px-5 text-sm"
						>
							Send
						</button>
				}

			</form>
		</div>
	);
};
