import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setSession } from '../../state/slicers/session';
import { useDispatch } from 'react-redux'
import { Navbar } from 'flowbite-react';
import axios from 'axios';
import navbar_icon from "../../assets/navbar_icon.png";


export const Navigationbar = () => {
	const userSession = useSelector((state) => state.session.value);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		document.documentElement.classList.add('dark');
	}, []);

	return (
		<Navbar fluid rounded>
			<Navbar.Brand href="/chat">
				<img src={navbar_icon} className="mr-3 h-6 sm:h-9" alt="DTRAIA Chat Logo" />
				<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">DTRAIA</span>
			</Navbar.Brand>
			<Navbar.Toggle />
			<Navbar.Collapse>
				<Navbar.Link href="#" active>
					Home
				</Navbar.Link>
				<Navbar.Link as={Link} href="#">
					About
				</Navbar.Link>
				<Navbar.Link href="#">Services</Navbar.Link>
				<Navbar.Link href="#">Pricing</Navbar.Link>
				<Navbar.Link href="#">Contact</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	)
};
