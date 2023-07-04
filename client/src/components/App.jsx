import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("");
	const navigate = useNavigate();

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};
	const handleRoleChange = (event) => {
		setRole(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		let body = {
			username: username,
			role: role,
			password: password,
		};

		axios
			.post("http://localhost:3050/register", body)
			.then((res) => {
				console.log(res.data);
				toast.success("Registered Successfully");
				navigate("/");
			})
			.catch((error) => {
				if (error) {
					console.log(error);
				}
			});
	};

	return (
		<div className='flex justify-center items-center h-screen'>
			<ToastContainer />
			<div className='bg-white p-6 rounded-lg shadow-md w-full sm:w-96'>
				<h1 className='text-center font-bold text-2xl mb-6'>Register</h1>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							className='block font-bold text-gray-700 mb-2'
							htmlFor='username'
						>
							Username
						</label>
						<input
							className='border border-gray-400 p-2 w-full rounded-md'
							type='text'
							id='username'
							value={username}
							onChange={handleUsernameChange}
							required
						/>
					</div>
					<div className='mb-4'>
						<label
							className='block font-bold text-gray-700 mb-2'
							htmlFor='role'
						>
							Role
						</label>
						<input
							className='border border-gray-400 p-2 w-full rounded-md'
							type='text'
							id='role'
							value={role}
							onChange={handleRoleChange}
							required
						/>
					</div>
					<div className='mb-4'>
						<label
							className='block font-bold text-gray-700 mb-2'
							htmlFor='password'
						>
							Password
						</label>
						<input
							className='border border-gray-400 p-2 w-full rounded-md'
							type='password'
							id='password'
							value={password}
							onChange={handlePasswordChange}
							required
						/>
					</div>

					<div className='flex justify-center'>
						<button
							className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md'
							type='submit'
						>
							Register
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
