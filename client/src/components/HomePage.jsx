import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
	const navigate = useNavigate();

	const handleLoginClick = () => navigate("/login");
	const handleRegisterClick = () => navigate("/register");

	return (
		<div className='flex justify-center items-center h-screen overflow-hidden'>
			<div className='bg-white p-6 rounded-xl shadow-xl   w-full sm:w-96'>
				<h2 className='text-center hover:cursor-pointer  font-bold text-3xl mb-6'>
					HomePage
				</h2>
				<div className='flex justify-center items-end'>
					<button
						className='px-4 py-2 font-bold bg-gray-900 text-white rounded-md shadow-md'
						onClick={handleRegisterClick}
					>
						Login
					</button>
					<button
						className='px-7 py-2 ml-5 font-bold bg-gray-900 text-white rounded-md shadow-md'
						onClick={handleLoginClick}
					>
						Login
					</button>
				</div>
			</div>
		</div>
	);
}

export default HomePage;
