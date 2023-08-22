export const SignUpPage = () => {
	return (
		<div className="flex justify-center items-center h-screen">
			<form className="bg-white p-8 shadow-md rounded-md mt-[-200px]">
				<h1 className="text-6xl text-center font-bold mb-4">
					Registrarse
				</h1>
				<h4 className="text-3xl text-center text-slate-400 mb-8">
					Rellene el siguiente formulario para darse de alta
				</h4>
				<input
					className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
					type="text"
					name="name"
					id="name"
					placeholder="Nombre"
				/>
				<input
					className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none  focus:ring focus:border-blue-300"
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
				<input
					className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none  focus:ring focus:border-blue-300"
					type="password"
					name="confirm"
					id="confirm"
					placeholder="Confirme contraseña"
				/>
				<div className="flex justify-center">
					<button
						className="flex justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-6"
						type="submit"
					>
						Registrarse
					</button>
				</div>
				<h4 className="text-center text-slate-400">
					O utiliza otra opcion
				</h4>
			</form>
		</div>
	);
};
