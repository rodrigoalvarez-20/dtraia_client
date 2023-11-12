import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { setSession } from '../../state/slicers/session';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux'
import { PUB_KEY } from "../../assets/constants";
import { sha256 } from "js-sha256";
import { pki, md, mgf1, util } from "node-forge";
import { OrbitProgress } from "react-loading-indicators";
import axios from "axios";

export const SignUpPage = () => {
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();


	useEffect(() => {


	}, [])


	const handleUserRegister = (e) => {
		e.preventDefault();

		const user_name = e.target[0].value;
		const user_email = e.target[1].value;
		const user_pwd = e.target[2].value;
		const user_pwdc = e.target[3].value;
		const regexPwd = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");

		if (!regexPwd.test(user_pwd)) {
			toast.error("La contraseña es invalida.");
			return
		} else if (user_pwd !== user_pwdc) {
			toast.warning("Las contraseñas no coinciden. Por favor revise los datos.");
			return
		}

		const pki_key = pki.publicKeyFromPem(PUB_KEY);
		const sha_pwd = sha256(user_pwd)

		const enc_pwd = pki_key.encrypt(sha_pwd, "RSA-OAEP", {
			md: md.sha256.create(),
			mgf1: mgf1.create()
		});

		const usr_payload = {
			"nombre": user_name,
			"email": user_email,
			"password": util.encode64(enc_pwd)
		}
		setIsLoading(true);
		axios.post("http://127.0.0.1:8000/api/users/register", usr_payload).then(r => {
			console.log(r.data)
			if (r.status !== 201) {
				toast.error(r.data.error);
				return
			}
			toast.success(r.data.message);
			const { user } = r.data;
			localStorage.setItem("token", user.token);
			delete user["token"]
			dispatch(setSession(user));
			return navigate("/chat", { replace: true })
		}).catch(error => {
			console.log(error);
			if (error.response.data){
				toast.warn(error.response.data.error)
			}else {
				toast.error("Ha ocurrido un error al crear el usuario. Intente de nuevo.");
			}
		}).finally(() => {
			setIsLoading(false);
			document.getElementById("registerForm").reset();
		})

	}

	return (
		<div>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				theme="light"
			/>
			<div className="flex justify-center items-center h-screen">
				<form id="registerForm" onSubmit={handleUserRegister} className="bg-white p-8 shadow-md rounded-md mt-[-200px]">
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
						required
						placeholder="Nombre"
					/>
					<input
						className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none  focus:ring focus:border-blue-300"
						type="email"
						name="email"
						id="email"
						required
						placeholder="Email"
					/>
					<input
						className="w-full px-3 py-2 border rounded-md focus:outline-none  focus:ring focus:border-blue-300"
						type="password"
						name="password"
						id="password"
						required
						placeholder="Contraseña"
					/>
					<p className="muted mb-4 mt-2 text-center font-bold">* La contraseña debe de tener +8 caracteres, un caracter especial y un numero *</p>
					<input
						className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none  focus:ring focus:border-blue-300"
						type="password"
						name="confirm"
						id="confirm"
						required
						placeholder="Confirme contraseña"
					/>
					<div className="flex justify-center">
						{
							isLoading ? <OrbitProgress color="#1200ff" size="small" text="" textColor="" /> :
								<button
									className="flex justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-6"
									type="submit"
								>
									Registrarse
								</button>
						}

					</div>
				</form>
			</div>
		</div>
	);
};
