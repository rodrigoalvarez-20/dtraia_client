import { useEffect, useState } from 'react';
import { ResetPasswordModal } from '../../ui';
import { useNavigate } from 'react-router-dom';
import { setSession } from '../../state/slicers/session';
import { toast, ToastContainer } from 'react-toastify';
import Lottie from "lottie-react";
import { useDispatch, useSelector } from 'react-redux'
import { PUB_KEY } from "../../assets/constants";
import { sha256 } from "js-sha256";
import { pki, md, mgf1, util } from "node-forge";
import MoonLoader from "react-spinners/MoonLoader";
import loadinganimation from "../../assets/loading_animation.json";

import axios from "axios";
import PasswordInput from '../../ui/components/PasswordInput';

export const LoginPage = () => {
	const userSession = useSelector((state) => state.session.value);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loginState, setLoginState] = useState(false);
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
		} else if (!tk || Object.keys(userSession).length === 0) {
			setGeneralLoading(false);
			navigate("/login", { replace: true });
		} else {
			setGeneralLoading(false);
		}
	}, [])

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
		let email = e.target[0].value;
		let pwd = e.target[1].value;

		const pki_key = pki.publicKeyFromPem(PUB_KEY);
		const sha_pwd = sha256(pwd);

		const enc_pwd = pki_key.encrypt(sha_pwd, "RSA-OAEP", {
			md: md.sha256.create(),
			mgf1: mgf1.create()
		});

		const loginPayload = {
			"email": email,
			"password": util.encode64(enc_pwd)
		}

		// Validaciones, despues
		axios.post(`/api/users/login`, loginPayload).then(r => {
			toast.success(r.data["message"]);
			const { user } = r.data;
			localStorage.setItem("token", user.token);
			delete user["token"]
			dispatch(setSession(user));
			return navigate("/chat", { replace: true })
		}).catch(e => {
			console.log(e);
			const edata = e.response.data;
			if (e.response.status != 500) {
				toast.warning(edata.error)
			} else {
				toast.error(edata.error)
			}
		}).finally(() => {
			setLoginState(false);
		});
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
					<>
						<form onSubmit={handleLogin}
							className="bg-white p-8 shadow-md rounded-md mt-[-300px]" style={{ margin: "auto 24px", width: "100%", minWidth: 300, maxWidth: 500 }}>
							<h1 className="text-4xl text-center font-bold mb-4">Acceder</h1>
							<h4 className="text-3xl text-center text-slate-400 mb-8">
								Accede al sistema
							</h4>
							<input
								className="text-black w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
								type="email"
								name="email"
								id="email"
								placeholder="Email"
							/>
							<PasswordInput placeholder="Contraseña" id="password" name="password" />
							<div className="flex justify-center mt-4 pb-4">
								{
									loginState ?
										<div style={{ margin: "12px" }}>
											<MoonLoader
												loading={true}
												size={28}
												color='#1200ff'
												aria-label="Loading Spinner" />
										</div> :
										<button
											style={{ width: "50%" }}
											type='submit'
											className="bg-blue-800 text-white hover:bg-blue-600 py-2 px-4 rounded mr-2">
											Acceder
										</button>
								}
								<button
									style={{ width: "50%" }}
									className="bg-red-500 text-white hover:bg-red-800 py-2 px-4 rounded"
									onClick={() => navigate("/signup")}>
									Registrarse
								</button>
							</div>

							<div style={{ margin: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
								<button
									className="bg-transparent text-black hover:bg-gray-300 py-2 px-4 rounded"
									onClick={toogleModal}>
									¿Olvidaste tu contraseña?
								</button>
							</div>
						</form>
						<ResetPasswordModal
							onClose={handleOnClose}
							isVisible={isModalOpen}
						/>
					</>
			}

		</div>
	);
};
