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
			<div className='bg-white p-6 rounded-lg shadow-md  sm:w-96'>
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
						
<button id="dropdownRadioButton" data-dropdown-toggle="dropdownDefaultRadio" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown radio <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>


<div id="dropdownDefaultRadio" class="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
    <ul class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
      <li>
        <div class="flex items-center">
            <input id="default-radio-1" type="radio" value="" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
            <label for="default-radio-1" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default radio</label>
        </div>
      </li>
      <li>
        <div class="flex items-center">
            <input checked id="default-radio-2" type="radio" value="" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
            <label for="default-radio-2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Checked state</label>
        </div>
      </li>
      <li>
        <div class="flex items-center">
            <input id="default-radio-3" type="radio" value="" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
            <label for="default-radio-3" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default radio</label>
        </div>
      </li>
    </ul>
</div>

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
