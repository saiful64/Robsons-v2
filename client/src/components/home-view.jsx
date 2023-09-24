import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

function HomeView() {
	const navigate = useNavigate();
	const auth = useAuth();

	const buttons = [
		{ text: "CLASSIFY", action: () => navigate("/forms") },
		...(auth.user === "doctor"
			? [
					{ text: "DASHBOARD", action: () => navigate("/dashboard") },
					{
						text: "RECORDED DATA",
						action: () => navigate("/generate-excel-sheet"),
					},
					{ text: "ANALYSIS", action: () => navigate("/generate-status") },
					{ text: "UPLOAD EXCEL FILE", action: () => navigate("/upload-xlsx") },
					{ text: "PATIENT LOG", action: () => navigate("/patientlog") },
			  ]
			: []),
		{ text: "LOG OUT", action: () => logout() },
	];

	const logout = () => {
		auth.logout();
		navigate("/");
	};

	const footerData = [
		{ key: "mainText", displayText: "@ 2023 JIPMER, O & G Dept." },
		{ key: "subText", displayText: "Made with 🧡 by MCA students" },
	];

	return (
		<>
			<div className='flex flex-col items-center justify-center h-screen'>
				<div className='bg-white p-7 rounded-lg shadow-2xl ring-1 ring-gray-900/5 md:w-5/12 lg:w-1/4 sm:w-96'>
					<h1 className='text-3xl font-bold mb-8 text-center'>
						{auth.user === "student" ? (
							<div className='bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-clip-text bg-transparent'>
								<h1>
									Welcome<span className=''> Student</span>
								</h1>
							</div>
						) : (
							<div className='font-kalam'>
								<h1>
									Welcome,{" "}
									<span className='bg-gradient-to-br from-indigo-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent'>
										Doctor!
									</span>{" "}
									👋
								</h1>
							</div>
						)}
					</h1>
					<div className='flex flex-col justify-center'>
						{buttons.map((button, index) => (
							<button
								key={index}
								onClick={button.action}
								className='relative mb-4 inline-block text-lg group'
								style={{
									backgroundColor:
										auth.user === "doctor" ? "#82ca9d" : "#8884d8",
								}}
							>
								<span className='relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white'>
									<span className='absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50'></span>
									<span className='absolute left-0 w-full h-48  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease'></span>
									<span className='relative z-10'>{button.text}</span>
								</span>
								<span className='absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0'></span>
							</button>
						))}
					</div>
				</div>
				<div className='flex flex-col bottom-[4%] font-light absolute inset-x-0 mt-10 animate-bounce items-center justify-center'>
					{footerData.map((item) => (
						<p key={item.key} className='text-md'>
							{item.displayText}
						</p>
					))}
				</div>
			</div>
		</>
	);
}

export default HomeView;
