import { useState } from 'react';

export const ResetPasswordModal = ({ isVisible, onClose }) => {
	const [email, setEmail] = useState('');

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleOnClose = (e) => {
		if (e.target.id === 'container') onClose();
	};

	const handleSubmit = (e) => {
		e.preventDefault;
		console.log('Enviar correo de recuperacion a: ', email);
		onClose();
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
					Reinicie su contraseña
				</h2>
				<h6 className="text-xl text-slate-400 text-center mb-4">
					Introduzca su correo electronico y se le hará llegar un
					enlace para restablecer su contraseña
				</h6>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<input
							type="email"
							id="email"
							className="mt-1 p-2 block w-full border rounded-md"
							placeholder="Ingrese su dirección de correo"
							value={email}
							onChange={handleEmailChange}
							required
						/>
					</div>
					<div className="flex justify-center">
						<button
							type="submit"
							className="bg-blue-500 text-white py-2 px-4 rounded"
						>
							Enviar Correo de Recuperación
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
