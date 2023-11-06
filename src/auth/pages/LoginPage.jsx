import { useState } from 'react';
import { ResetPasswordModal } from '../../ui';
import { useNavigate } from 'react-router-dom';
import { setSession } from '../../state/slicers/session';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux'
import {sha256} from "js-sha256";
import {OrbitProgress} from "react-loading-indicators";


import axios from "axios";

export const LoginPage = () => {
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loginState, setLoginState] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const toogleModal = (e) => {
		e.preventDefault();
		setIsModalOpen(!isModalOpen);
	};

	const handleOnClose = () => {
		setIsModalOpen(false);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		setLoginState(true);
		var email = e.target[0].value;
		var pwd = e.target[1].value;
		
		// Validaciones, despues
		pwd = sha256(pwd);
		axios.post("http://127.0.0.1:8000/api/users/login", { "email": email, "password": pwd }).then(r => {
			toast.success(r.data["message"]);
			const { user } = r.data;
			localStorage.setItem("token", user.token);
			delete user["token"]
			dispatch(setSession(user));
			return navigate("/chat", { replace: true })
		}).catch(e => {
			console.log(e);
			const edata = e.response.data;
			if (e.response.status != 500){
				toast.warning(edata.error)
			}else {
				toast.error(edata.error)
			}
		}).finally(() => {
			setLoginState(false);
		});
	}

	return (
		<div className="flex justify-center items-center h-screen">
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				theme="light"
			/>
			{/* Same as */}
			<ToastContainer />
			<form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-md mt-[-300px]">
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
				{
					loginState ? 
							<div style={{ margin: "12px" }}>
								<OrbitProgress color="#1200ff" size="small" text="" textColor="" />
							</div> :
							<button type='submit' className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded mr-2">
								Acceder
							</button>
				}
					<button
						className="bg-gray-300 text-gray-700 hover:bg-gray-400 py-2 px-4 rounded"
						onClick={toogleModal}>
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
