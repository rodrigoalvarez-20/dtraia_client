import { useState } from 'react';
import { Link } from 'react-router-dom';

// TODO: Retirar Chat de la Navbar (ahora solo por fines demostrativos)

export const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<div className="bg-indigo-950 opacity-80 py-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-white font-bold text-xl">DTRAIA</div>
				<button
					className="text-white block lg:hidden"
					onClick={toggleMenu}
				>
					<svg
						className="h-6 w-6 fill-current"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</button>
				<div className="hidden lg:block">
					<Link to="chat">
						<button className="bg-indigo-950 text-white hover:bg-blue-500 hover:text-white py-2 px-4 rounded mr-2">
							Chat
						</button>
					</Link>
					<Link to="signup">
						<button className="bg-indigo-950 text-white hover:bg-blue-500 hover:text-white py-2 px-4 rounded mr-2">
							Registrarse
						</button>
					</Link>
					<Link to="login">
						<button className="bg-indigo-950 text-white hover:bg-blue-600 py-2 px-4 rounded">
							Iniciar Sesión
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
