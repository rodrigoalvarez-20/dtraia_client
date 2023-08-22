import { useState } from 'react';
import { ResetPasswordModal } from '../../ui';

export const LoginPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const toogleModal = () => {
		event.preventDefault();
		setIsModalOpen(!isModalOpen);
	};

	const handleOnClose = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<form className="bg-white p-8 shadow-md rounded-md mt-[-300px]">
				<h1 className="text-6xl text-center font-bold mb-4">Acceder</h1>
				<h4 className="text-3xl text-center text-slate-400 mb-8">
					Accede al sistema
				</h4>
				<input
					className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
					type="email"
					name="email"
					id="email"
					placeholder="Email"
				/>
				<input
					className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none  focus:ring focus:border-blue-300"
					type="password"
					name="password"
					id="password"
					placeholder="Contraseña"
				/>
				<div className="flex justify-center mt-4 pb-4">
					<button className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded mr-2">
						Acceder
					</button>
					<button
						className="bg-gray-300 text-gray-700 hover:bg-gray-400 py-2 px-4 rounded"
						onClick={() => toogleModal()}
					>
						Olvidaste tu contraseña?
					</button>
				</div>

				<ResetPasswordModal
					onClose={handleOnClose}
					isVisible={isModalOpen}
				/>

				<h4 className="text-center text-slate-400">
					O utiliza otra opcion
				</h4>
			</form>
		</div>
	);
};
