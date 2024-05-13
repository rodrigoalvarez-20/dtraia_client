import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from 'flowbite-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Markdown from 'react-markdown';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { updateRate } from '../../state/slicers/messages';
import { togglePanel, setCodeToExecute } from "../../state/slicers/code_panel"
import ai_pic from "../../assets/ai_pic.jpg"
import assistant_icon from "../../assets/assistant_icon.png"
import "../../styles/messages.css";
import axios from "axios"

export const Message = ({ message, parent_id }) => {
	const sessionState = useSelector((state) => state.session.value);
	const [username, setUsername] = useState("Usuario")
	//const dispatch = useDispatch();

	useEffect(() => {
		setUsername(sessionState.nombre)
	}, [sessionState])

	

	const AgentActionButtons = ({message_data, parent_id}) => {
		const dispatch = useDispatch();
		const [isExecutable, setIsExecutable] = useState(false);

		useEffect(() => {
			const pythonRegex = /`{3}(\\n)*(python)+/g;
			const messageSplited = message_data.message.split(pythonRegex);
			setIsExecutable(messageSplited.length > 1)
		}, []);

		const executeCode = () => {
			dispatch(setCodeToExecute(message_data.message))
			dispatch(togglePanel())
		}

		function rate_answer(parent_id, actual_id, rate){

			const tk = localStorage.getItem("token");
			if (!tk) {
				console.log("Ha ocurrido un error al obtener la token");
			}

			const rateData = {
				"qmessage_id": parent_id,
				"amessage_id": actual_id,
				"rating": rate
			}

			axios.post(`/api/rate_message/rate`, rateData, { headers: { "Authorization": tk } }).then(r => {
				console.log(r.data);
				dispatch(updateRate({ "message_id": actual_id, "rate": rate }))
			}).catch(e => {
				console.log(e);
				const edata = e.response.data;
				alert(edata.error)
			});
			
		}

		return (
			<div style={{ marginTop: "8px" }}>
				<hr style={{ width: "100%", height: "2px", borderColor: "#F0F8FF", margin: "auto" }} />
				<div style={{ display: "flex", flexDirection: "row", marginTop: "8px" }}>
					<div style={{ flex: "1", display: "flex", justifyContent: "space-evenly", maxWidth: "160px", alignItems: "center" }}>
						<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
						onClick={() => rate_answer(parent_id, message_data["_id"], 1)}
							className="qualify_button" style={{ backgroundColor: message_data.rate && message_data.rate === 1 ? "#004225" : "transparent" } }>
							<title />
							<g data-name="1" id="_1">
								<path d="M348.45,432.7H261.8a141.5,141.5,0,0,1-49.52-8.9l-67.5-25.07a15,15,0,0,1,10.45-28.12l67.49,25.07a111.79,111.79,0,0,0,39.08,7h86.65a14.21,14.21,0,1,0,0-28.42,15,15,0,0,1,0-30H368.9a14.21,14.21,0,1,0,0-28.42,15,15,0,0,1,0-30h20.44a14.21,14.21,0,0,0,10.05-24.26,14.08,14.08,0,0,0-10.05-4.16,15,15,0,0,1,0-30h20.45a14.21,14.21,0,0,0,10-24.26,14.09,14.09,0,0,0-10-4.17H268.15A15,15,0,0,1,255,176.74a100.2,100.2,0,0,0,9.2-29.33c3.39-21.87-.79-41.64-12.42-58.76a12.28,12.28,0,0,0-22.33,7c.49,51.38-23.25,88.72-68.65,108a15,15,0,1,1-11.72-27.61c18.72-8,32.36-19.75,40.55-35.08,6.68-12.51,10-27.65,9.83-45C199.31,77,211,61,229.18,55.34s36.81.78,47.45,16.46c24.71,36.36,20.25,74.1,13.48,97.21H409.79a44.21,44.21,0,0,1,19.59,83.84,44.27,44.27,0,0,1-20.44,58.42,44.27,44.27,0,0,1-20.45,58.43,44.23,44.23,0,0,1-40,63Z" />
								<path d="M155,410.49H69.13a15,15,0,0,1-15-15V189.86a15,15,0,0,1,15-15H155a15,15,0,0,1,15,15V395.49A15,15,0,0,1,155,410.49Zm-70.84-30H140V204.86H84.13Z" />
							</g>
						</svg>
						<svg
							onClick={() => rate_answer(parent_id, message_data["_id"], 0)}
							style={{ backgroundColor: message_data.rate === 0 ? "#960018" : "transparent" }} 
							className="qualify_button" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
							<title />
							<g data-name="1" id="_1">
								<path d="M242.28,427.39a43.85,43.85,0,0,1-13.1-2c-18.22-5.69-29.87-21.64-29.69-40.62.16-17.35-3.15-32.5-9.83-45-8.19-15.33-21.83-27.13-40.55-35.08A15,15,0,1,1,160.83,277c45.4,19.26,69.14,56.6,68.65,108a12.28,12.28,0,0,0,22.33,7c28.34-41.71,3.47-87.63,3.22-88.09a15,15,0,0,1,13.12-22.27H409.79a14.22,14.22,0,0,0,0-28.43H389.34a15,15,0,1,1,0-30,14.2,14.2,0,0,0,14.21-14.21,14.23,14.23,0,0,0-14.21-14.21H368.9a15,15,0,0,1,0-30,14.21,14.21,0,1,0,0-28.42H348.45a15,15,0,0,1,0-30,14.21,14.21,0,1,0,0-28.42H261.8a111.69,111.69,0,0,0-39.07,7l-67.5,25.07A15,15,0,0,1,144.78,82l67.5-25.07A141.5,141.5,0,0,1,261.8,48h86.65a44.25,44.25,0,0,1,40,63,44.27,44.27,0,0,1,20.45,58.43,44.27,44.27,0,0,1,20.44,58.42,44.21,44.21,0,0,1-19.59,83.84H290.11c6.77,23.11,11.23,60.85-13.48,97.22A41.21,41.21,0,0,1,242.28,427.39Z" />
								<path d="M155,305.85H69.13a15,15,0,0,1-15-15V85.21a15,15,0,0,1,15-15H155a15,15,0,0,1,15,15V290.85A15,15,0,0,1,155,305.85Zm-70.84-30H140V100.21H84.13Z" />
							</g>
						</svg>
					</div>
					{
						isExecutable ?
							<div style={{ flex: 4, justifyContent: "end", display: "flex", marginRight: "12px" }}>
								<Button onClick={executeCode} gradientDuoTone="purpleToBlue">
									<svg style={{ fill: "white" }} baseProfile="tiny" height="24px" version="1.1" viewBox="0 0 512 512"
										width="24px" xmlns="http://www.w3.org/2000/svg">
										<g id="Layer_7">
											<g>
												<path d="M253.806,1.783c-20.678,0.098-40.426,1.859-57.803,4.935c-51.187,9.044-60.48,27.97-60.48,62.877v46.103    h120.963v15.366H135.522H90.126c-35.155,0-65.937,21.13-75.563,61.325c-11.107,46.075-11.603,74.83,0,122.939    c8.599,35.808,29.13,61.324,64.286,61.324h41.589v-55.269c0-39.921,34.544-75.143,75.564-75.143h120.822    c33.632,0,60.479-27.689,60.479-61.466V69.594c0-32.776-27.653-57.406-60.479-62.877C296.045,3.257,274.483,1.684,253.806,1.783z     M188.391,38.86c12.494,0,22.699,10.37,22.699,23.12c0,12.705-10.205,22.982-22.699,22.982c-12.542,0-22.699-10.277-22.699-22.982    C165.692,49.23,175.849,38.86,188.391,38.86z" id="path1948_1_" />
												<path d="M392.387,131.062v53.712c0,41.648-35.303,76.692-75.562,76.692H196.002    c-33.094,0-60.48,28.327-60.48,61.469v115.186c0,32.777,28.503,52.063,60.48,61.463c38.291,11.259,75.004,13.3,120.822,0    c30.451-8.812,60.479-26.561,60.479-61.463v-46.105H256.485v-15.364h120.817h60.479c35.157,0,48.26-24.519,60.482-61.324    c12.629-37.895,12.093-74.335,0-122.939c-8.687-34.993-25.281-61.325-60.482-61.325H392.387z M324.438,422.75    c12.539,0,22.698,10.269,22.698,22.975c0,12.749-10.159,23.124-22.698,23.124c-12.493,0-22.696-10.375-22.696-23.124    C301.741,433.019,311.944,422.75,324.438,422.75z" id="path1950_1_" />
											</g>
										</g>
									</svg>
									<div style={{ margin: "0 12px" }}>Ejecutar</div>
								</Button>
							</div> : null
					}

				</div>
			</div>
		)
	}

	return (
		<div>
			<div className="chat chat-start">
				<div className="chat-image avatar">
					<div className="w-10 rounded-full">
						<img src={message.type === "human" ? `/static/${sessionState.profilePic}?${new Date().getTime()}` : ai_pic} alt={`${message.type} Message`} />
					</div>
				</div>
				<div className="chat-header">{message.type === "human" ? username : "Asistente"}</div>
				<div className="chat-bubble">
					<Markdown
						children={message.message}
						components={{
							code(props) {
								const { children, className, node, ...rest } = props
								const match = /language-(\w+)/.exec(className || '')
								return match ? (
									<SyntaxHighlighter
										{...rest}
										PreTag="div"
										customStyle={{ fontSize: "14px" }}
										children={String(children).replace(/\n$/, '')}
										language={match[1]}
										style={darcula}
									/>
								) : (
									<code {...rest} className={className}>
										{children}
									</code>
								)
							}
						}}
					/>
					{
						message.type === "ai" ? <AgentActionButtons message_data={message} parent_id={parent_id} /> : null
					}
				</div>
			</div>
		</div>
	);
};
