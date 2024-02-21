import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '../auth/pages/LoginPage';
import { SignUpPage } from '../auth/pages/SignUpPage';
import { Navigationbar } from '../ui/components/Navbar';
import ChatRoom from '../chat/pages/ChatRoom';
import { useSelector } from 'react-redux';
import {React, useEffect} from "react";

// TODO: Proteger ruta chat

export const AppRouter = () => {
	const userSession = useSelector((state) => state.session.value);


	useEffect(() => {
		console.log(Object.keys(userSession))
	}, [userSession])

	

	return (
		<>
			{
				/*Object.keys(userSession).length > 0 ? <Navigationbar /> : null*/
			}
			<Routes>
				<Route path="login" element={<LoginPage />} />
				<Route path="signup" element={<SignUpPage />} />
				<Route path="chat" element={<ChatRoom />} />
				<Route path='/' element={<LoginPage />} />
			</Routes>
		</>
	);
};
