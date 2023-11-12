import user_pic from "../../assets/user_pic.jpg"
import ai_pic from "../../assets/ai_pic.jpg"
import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";
import { useEffect, useState } from "react";


export const Message = ({ message }) => {

	useEffect(() => {
		//console.log(message)
	}, [])

	const LLMCodeBlock = (message) => {
		const [ beforeCodeText, setBeforeCodeText ] = useState("");
		const [afterCodeText, setAfterCodeText] = useState("");
		const [ codeText, setCodeText ] = useState("");
		const [codeLang, setCodeLang] = useState("python");
		const possibleLangCodes = ['bash', 'c', 'clojure', 'cpp', 'csharp', 'dart', 'elixir', 'elm', 'erlang', 'fsharp', 'graphql', 
		'go', 'groovy', 'haskell', 'html', 'java', 'javascript', 'jsx', 'julia', 'kotlin', 'lisp', 'makefile', 'matlab', 'objectivec', 
		'ocaml', 'php', 'python', 'r', 'ruby', 'rust', 'scala', 'sql', 'swift', 'tsx', 'typescript']
		
		useEffect(() => {
			//console.log(codeLang)
		}, [codeLang]);

		useEffect(() => {

			const llmtext = message.message;
			const splitedText = llmtext.split("```")
			//console.log(splitedText)
			const beforeCode = splitedText[0];
			var afterCode = "";
			var textCode = splitedText[1]
			var possibleLangCode = textCode.split("\n")[0].split(":")[0].replace(" ", "").replace("++", "pp");
			if (possibleLangCode && possibleLangCodes.indexOf(possibleLangCode.toLocaleLowerCase() >= 0)){
				//console.log("Setting Code Lang")
				//console.log(possibleLangCode);
				setCodeLang(possibleLangCode);
				textCode = textCode.split("\n").slice(1).join("\n").trim()
			}else{
				setCodeLang("python")
			}

			if (splitedText.length >= 2 ){
				//console.log(splitedText[2])
				afterCode = splitedText.slice(2).join("\n").trim();
				if (afterCode.startsWith("\n")){
					afterCode = afterCode.replace("\n");
				}
			}

			setBeforeCodeText(beforeCode);
			setAfterCodeText(afterCode);
			setCodeText(textCode);
		}, []);


		return (
		
			<div>
				<div style={{ whiteSpace: "pre-line", margin: "8px 0" }}>{beforeCodeText}</div>
				<CopyBlock
					wrapLongLines={true}
					text={codeText}
					language={codeLang}
					showLineNumbers={false}
					theme={dracula}
					
				/>
				{
					afterCodeText && afterCodeText !== "" ? <div style={{ whiteSpace: "pre-line", margin: "8px 0" }}>{afterCodeText}</div> : null
				}
			</div>
		)

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
				<div className="chat-bubble">
					{
						message.message.includes("```") ? 
							<LLMCodeBlock message={message.message} /> : 
							<div style={{ whiteSpace: "pre-line"}}>{message.message}</div>
					}
				</div>
				{
					//<div className="chat-footer opacity-50">Delivered</div>
				}
			</div>
		</div>
	);
};
