import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ChatApp } from './ChatApp';
import { Provider } from "react-redux"

import store from './state/store';

import "react-toastify/dist/ReactToastify.css";


ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<BrowserRouter>
			<ChatApp />
		</BrowserRouter>
	</Provider>
);
