import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import axios from "axios"
import { addMessage } from '../../state/slicers/messages';
import { OrbitProgress } from "react-loading-indicators";

export const SendMessage = () => {
	const stateChatId = useSelector((state) => state.active_chat.value);
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValue] = useState('');
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

		var actual_date = new Date();
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
		axios.post(`http://localhost:8000/api/chat/${stateChatId}`, payload, { "headers": { "Authorization": tk } }).then(r => {
			console.log(r.data);
			//Añadir la respuesta de la IA
			var actual_date = new Date();
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
		}).catch(e => {
			console.log(e)
		}).finally(() => {
			setIsLoading(false);
			setValue("");
		})
		

	};


	return (
		<div
			style={{ width: "-webkit-fill-available" }}
			className="fixed bg-slate-300 bottom-0 py-10 shadow-lg">
			<form style={{ display: "flex", margin: "auto", width: "80%" }} onSubmit={handleSendMessage}>
				<textarea
					value={value}
					disabled={isLoading}
					rows={5}
					onChange={(e) => setValue(e.target.value)}
					className="input w-full focus:outline-none bg-gray-100 rounded-r-none"
					type="text"
				/>
				{
					isLoading ? 
					<div style={{ margin: "0 12px" }}>
							<OrbitProgress color="#1200ff" size="small" text="" textColor="" />
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
