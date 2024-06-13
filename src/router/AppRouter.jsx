import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '../auth/pages/LoginPage';
import { SignUpPage } from '../auth/pages/SignUpPage';
import ChatRoom from '../chat/pages/ChatRoom';
import { useSelector } from 'react-redux';
import { React, useEffect } from "react";
import RecoverPassword from '../auth/pages/RecoverPassword';
import UserProfile from '../profile/UserProfile';

// TODO: Proteger ruta chat

export const AppRouter = () => {
	const userSession = useSelector((state) => state.session.value);


	return (
		<Routes>
			<Route path="login" element={<LoginPage />} />
			<Route path="signup" element={<SignUpPage />} />
			<Route path="chat" element={<ChatRoom />} />
			<Route path='profile' element={<UserProfile />} />
			<Route path='/' element={<LoginPage />} />
			<Route path="recover_password" element={<RecoverPassword />} />
		</Routes>
	);
};
