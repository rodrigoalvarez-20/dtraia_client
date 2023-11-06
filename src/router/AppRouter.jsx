import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '../auth/pages/LoginPage';
import { SignUpPage } from '../auth/pages/SignUpPage';
import { Navbar } from '../ui/components/Navbar';
import ChatRoom from '../chat/pages/ChatRoom';

// TODO: Proteger ruta chat

export const AppRouter = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="login" element={<LoginPage />} />
				<Route path="signup" element={<SignUpPage />} />
				<Route path="chat" element={<ChatRoom />} />
				<Route path='/' element={<LoginPage />} />
			</Routes>
		</>
	);
};
