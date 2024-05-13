import axios from 'axios';
import { useState } from 'react';
import MoonLoader from "react-spinners/MoonLoader";

export const ResetPasswordModal = ({ isVisible, onClose }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleOnClose = (e) => {
		if (e.target.id === 'container') onClose();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Enviar correo de recuperacion a: ', email);
		setIsLoading(true);

		const payload = {
			"email": email,
			"password": ""
		}

		axios.post(`/api/users/recover_password`, payload).then(r => {
			if (r.status !== 200){
				alert(r.data.error)
			}else{
				alert(r.data.message)
			}
		}).catch(error => {
			console.log(error)
			alert("Ha ocurrido un error al realizar la peticion. Por favor intente de nuevo")
		}).finally(() => {
			setIsLoading(false);
			onClose();
		});
	};

	if (!isVisible) return null;
	return (
		<div
			id="container"
			onClick={handleOnClose}
			className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
		>
			<div className="bg-white p-8 rounded-md shadow-lg max-w-lg">
				<h2 className="text-3xl font-semibold mb-4 text-center">
					Reestablecer contraseña
				</h2>
				<h6 className="text-xl text-slate-400 text-center mb-4">
					Introduzca su correo electrónico para envio de correo de restablecimiento
				</h6>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<input
							type="email"
							id="email"
							className="mt-1 p-2 block w-full border rounded-md"
							placeholder="ejemplo@mail.com"
							value={email}
							onChange={handleEmailChange}
							required
						/>
					</div>
					<div className="flex justify-center">
						{
							isLoading ? <MoonLoader
								loading={true}
								size={32}
								color='#1200ff'
								aria-label="Loading Spinner" />
								: <button
									type="submit"
									className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-800"
								>
									Enviar
								</button>
						}

					</div>
				</form>
			</div>
		</div>
	);
};
