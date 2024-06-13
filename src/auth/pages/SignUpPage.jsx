import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { setSession } from '../../state/slicers/session';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { PUB_KEY } from "../../assets/constants";
import { sha256 } from "js-sha256";
import { pki, md, mgf1, util } from "node-forge";
import MoonLoader from "react-spinners/MoonLoader";
import axios from "axios";
import Lottie from "lottie-react";
import PasswordInput from "../../ui/components/PasswordInput";
import loadinganimation from "../../assets/loading_animation.json";

export const SignUpPage = () => {
	const userSession = useSelector((state) => state.session.value);
	const [isLoading, setIsLoading] = useState(false);
	const [generalLoading, setGeneralLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		console.log("Validating user session");
		setGeneralLoading(true);
		const tk = localStorage.getItem("token");
		if (tk) {
			const headers = {
				"Authorization": tk
			}
			axios.get(`/api/users/profile`, { headers }).then(r => {
				if (r.data) {
					const userData = r.data;
					console.log("Setting user session to STORE");
					//console.log(userData)
					dispatch(setSession(userData));
					setGeneralLoading(false);
					return navigate("/chat", { replace: true })
				}
				setGeneralLoading(false);
			}).catch(error => {
				console.log(error)
				localStorage.setItem("token", "");
				dispatch(setSession({}));
				setGeneralLoading(false);
			})
		} else {
			setGeneralLoading(false);
		}
	}, [])


	const handleUserRegister = (e) => {
		e.preventDefault();

		const user_name = e.target[0].value;
		const user_email = e.target[1].value;
		const user_pwd = e.target[2].value;
		const user_pwdc = e.target[4].value;
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
		axios.post(`/api/users/register`, usr_payload).then(r => {
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
			setTimeout(() => {
				document.getElementById("registerForm").reset();
				return navigate("/chat", { replace: true })
			}, 3000)
			
		}).catch(error => {
			console.log(error);
			if (error.response.data) {
				toast.warn(error.response.data.error)
			} else {
				toast.error("Ha ocurrido un error al crear el usuario. Intente de nuevo.");
			}
			document.getElementById("registerForm").reset();
		}).finally(() => {
			setIsLoading(false);
		})

	}

	return (
		<div className="flex justify-center items-center h-screen" style={{ margin: "auto 24px" }}>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				theme="light"
			/>
			{
				generalLoading ? <Lottie animationData={loadinganimation} loop={true} style={{ height: "50%", width: "80%" }} /> :
					<form
						id="registerForm"
						onSubmit={handleUserRegister}
						style={{ margin: "auto 24px" }}
						className="bg-white p-8 shadow-md rounded-md mt-[-200px]">
						<p className="text-4xl text-center font-bold mb-4">
							Registrarse
						</p>
						<input
							className="w-full px-3 py-2 mb-4 border text-black rounded-md focus:outline-none focus:ring focus:border-blue-300"
							type="text"
							name="name"
							id="name"
							required
							placeholder="Nombre"
						/>
						<input
							className="w-full px-3 py-2 mb-4 border text-black rounded-md focus:outline-none  focus:ring focus:border-blue-300"
							type="email"
							name="email"
							id="email"
							required
							placeholder="Email"
						/>
						<PasswordInput placeholder="Contraseña" id="pwd" name="pwd" />
						<PasswordInput placeholder="Confirmar contraseña" id="cpwd" name="cpwd" />
						<p className="muted mb-4 mt-2 text-center text-sm font-bold text-grey-600">
							* La contraseña debe de tener +8 caracteres, un caracter especial y un numero *
						</p>
						<div className="flex" style={{ justifyContent: "space-around", alignItems: "center" }}>
							<button
								onClick={() => { navigate(-1) }}
								className="bg-transparent hover:bg-gray-200 text-gray-500 rounded w-1/2 h-10 m-6"
								type="button"
							>
								Regresar
							</button>
							{
								isLoading ? <MoonLoader
									loading={true}
									size={28}
									color='#1200ff'
									aria-label="Loading Spinner" /> :
									<button
										className="m-6 bg-blue-500 hover:bg-blue-600 text-white rounded-md w-1/2 h-10"
										type="submit"
									>
										Registrarse
									</button>
							}

						</div>
					</form>
			}

		</div>
	);
};
