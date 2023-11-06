import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setSession } from '../../state/slicers/session';
import { useDispatch } from 'react-redux'

import axios from 'axios';

// TODO: Retirar Chat de la Navbar (ahora solo por fines demostrativos)

export const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const userSession = useSelector((state) => state.session.value);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const closeSession = () => {
		localStorage.clear()
		dispatch(setSession({}));
		return navigate("/login", {replace: true})

	}

	useEffect(() => {
		console.log("Validating user session");
		const tk = localStorage.getItem("token");
		if (tk) {
			const headers = {
				"Authorization": tk
			}
			axios.get("http://127.0.0.1:8000/api/users/profile", { headers }).then(r => {
				if (r.data) {
					const userData = r.data;
					console.log("Setting user session to STORE");
					console.log(userData)
					dispatch(setSession(userData));
					return navigate("/chat", { replace: true })
				}
			}).catch(error => {
				console.log(error)
				localStorage.setItem("token", "");
				dispatch(setSession({}));
			})
		}
	}, []);

	useEffect(() => {
		console.log("Updated session")
		console.log(userSession)
	}, [userSession])

	function renderSessionButtons(){
		return <>
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
		</>
	}

	return (
		<div className="bg-indigo-950 opacity-80 py-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-white font-bold text-xl pl-8">DTRAIA</div>
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
					{
						userSession["email"] ?
							<button
								className="bg-indigo-950 text-white hover:bg-blue-500 hover:text-white py-2 px-4 rounded mr-2"
								onClick={() => {}}>
								{userSession["nombre"]}
							</button> : null
					}
					{
						/*
						<Link to="chat">
							<button className="bg-indigo-950 text-white hover:bg-blue-500 hover:text-white py-2 px-4 rounded mr-2">
								Chat
							</button>
						</Link>
						*/
					} 
					{
						userSession["email"] ? 
							<button 
								className="bg-indigo-950 text-white hover:bg-blue-500 hover:text-white py-2 px-4 rounded mr-2"
								onClick={closeSession}>
								Cerrar sesion
							</button> : renderSessionButtons()
					}
				</div>
			</div>
		</div>
	);
};
