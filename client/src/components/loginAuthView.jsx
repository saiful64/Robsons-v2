import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import API_BASE_URL from "./config";

function LoginAuthView(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const auth = useAuth();
	const navigate = useNavigate();

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		let body = {
			username: username,
			password: password,
		};
		axios
			.post(`${API_BASE_URL}/auth-login`, body)
			.then((response) => {
				if (response.data === "student") {
					auth.login("student");
					navigate("/home-view");
				} else if (response.data === "doctor") {
					auth.login("doctor");
					navigate("/home-view");
				} else {
					alert("Invalid Credentials");
				}
			})
			.catch((error) => {
				if (error) {
					toast.error("Invalid Credentials", {
						autoClose: 1000,
					});
				}
			});
	};

	const footerData = [
		{ key: "mainText", displayText: "@ 2023 JIPMER, O & G  Dept." },
		{ key: "subText", displayText: "Made with 🧡 by MCA students" },
	];

	return (
		<div className='flex flex-col justify-center items-center h-screen overflow-hidden'>
			<ToastContainer />
			<div className='bg-white lg:w-1/4 sm:w-96 p-6 rounded-lg drop-shadow-2xl'>
				<h1 className='text-gray-900  opacity-100 font-space text-center hover:cursor-pointer  font-bold text-3xl mb-4'>
					Welcome{" "}
					<span className='bg-gradient-to-br from-blue-500  to-pink-500 bg-clip-text text-transparent'>
						Back!
					</span>{" "}
					👋
				</h1>
				<p className='mb-6 mt-0 text-center'>Log in to your account</p>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							className='block font-bold text-gray-800 mb-2'
							htmlFor='username'
						>
							Username
						</label>
						<input
							className='border border-gray-400 p-2 mb-2 w-full rounded-md'
							type='text'
							id='username'
							value={username}
							onChange={handleUsernameChange}
						/>
					</div>
					<div className='mb-4 relative'>
						<label
							className='block font-bold  text-gray-800 mb-2'
							htmlFor='password'
						>
							Password
						</label>
						<input
							className='border  border-gray-400 p-2 w-full rounded-md'
							type={isPasswordVisible ? "text" : "password"}
							id='password'
							value={password}
							onChange={handlePasswordChange}
						/>
						<div
							className='absolute hover:cursor-pointer right-4 top-11'
							onClick={() => setIsPasswordVisible((prev) => !prev)}
						>
							{isPasswordVisible ? <VscEye /> : <VscEyeClosed />}
						</div>
					</div>
					<div className='flex justify-center'>
						<button
							type='submit'
							className='relative inline-block mb-4 text-lg group'
						>
							<span className='relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white'>
								<span className='absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50'></span>
								<span className='absolute left-0 w-full h-80  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease'></span>
								<span className='relative z-10'>Login</span>
							</span>
							<span
								className='absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0'
								data-rounded='rounded-lg'
							></span>
						</button>
					</div>
				</form>
			</div>
			<div className='flex flex-col bottom-[4%] font-light absolute inset-x-0 mt-10 animate-bounce items-center justify-center'>
				{footerData.map((item) => (
					<p key={item.key} className='text-md'>
						{item.displayText}
					</p>
				))}
			</div>
		</div>
	);
}

export default LoginAuthView;
