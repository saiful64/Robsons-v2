import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "./config";

function Register() {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		role: "doctor", // Default role
	});

	const navigate = useNavigate();

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post(`${API_BASE_URL}/register`, formData);
			console.log(response.data);
			toast.success("Registered Successfully");
			navigate("/");
		} catch (error) {
			console.error(error);
			toast.error("Registration failed. Please try again.");
		}
	};

	return (
		<div className='flex justify-center items-center h-screen'>
			<ToastContainer />
			<div className='bg-white p-6 rounded-lg shadow-md sm:w-96'>
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
							name='username'
							value={formData.username}
							onChange={handleInputChange}
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
						<select
							className='border border-gray-400 p-2 w-full rounded-md'
							id='role'
							name='role'
							value={formData.role}
							onChange={handleInputChange}
							required
						>
							<option value='doctor'>Doctor</option>
							<option value='student'>Student</option>
							<option value='department'>Department</option>
						</select>
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
							name='password'
							value={formData.password}
							onChange={handleInputChange}
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
