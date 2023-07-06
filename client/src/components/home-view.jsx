import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

function HomeView() {

	const navigate = useNavigate();
	const auth = useAuth();
	const logout = () => {
		auth.logout();
		navigate("/");
	};
	const goToFormPage = () => {
		navigate("/forms");
	};
	const generateSheetPage = () => {
		navigate("/generate-excel-sheet");
	};
	const generateStatus = () => {
		navigate("/generate-status");
	};
	return (
		<>
			<div className='flex flex-col items-center justify-center h-screen'>
				<div className='bg-white p-7 rounded-lg  shadow-xl ring-1 ring-gray-900/5  sm:w-96'>
					<h1 className='text-3xl font-bold mb-8 text-center'>
						{auth.user === "student" ? "Welcome Student" : "Welcome Doctor"}
					</h1>
					<div className='flex flex-col justify-center'>
						<button
							className='bg-zinc-300 hover:bg-gray-800 hover:text-white text-gray-500 font-medium hover:font-bold hover:shadow-xl py-2 px-4 rounded m-2 mb-6'
							onClick={() => goToFormPage()}
						>
							ENTER DATA
						</button>
						{auth.user === "doctor" && (
							<>
								<button
									className='bg-zinc-400 hover:bg-gray-600 hover:text-zinc-200 text-white font-medium hover:font-bold hover:shadow-xl py-2 px-4 rounded m-2 mb-6'
									onClick={() => generateSheetPage()}
								>
									GENERATE EXCEL SHEET REPORT
								</button>
								<button
									className='bg-zinc-500 hover:bg-gray-600 text-white font-medium hover:font-bold hover:shadow-xl py-2 px-4 rounded m-2 mb-6'
									onClick={() => generateStatus()}
								>
									GENERATE STATUS
								</button>
							</>
						)}
						<button
							className='bg-zinc-700 hover:bg-gray-300 hover:text-black text-white font-medium hover:font-bold hover:shadow-xl py-2 px-4 rounded m-2 mb-6'
							onClick={() => logout()}
						>
							LOGOUT
						</button>
					</div>
				</div>
			</div>
		</>
	);

}

export default HomeView;
