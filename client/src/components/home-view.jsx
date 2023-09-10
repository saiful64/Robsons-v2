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
	const recorderdata = () => {
		navigate("/generate-excel-sheet");
	};
	const analysis = () => {
		navigate("/generate-status");
	};
	const dashboard = () => {
		navigate("/dashboard");
	};
	const patientlog = () => {
		navigate("/patientlog");
	};
	
	const footerData = [
		{ key: "mainText", displayText: "@ 2023 JIPMER, O & G  Dept." },
		{ key: "subText", displayText: "Made with 🧡 by MCA students" },
	];
	return (
		<>
			<div className='flex flex-col items-center justify-center h-screen'>
				<div className='bg-white p-7 rounded-lg  shadow-2xl ring-1 ring-gray-900/5  sm:w-96'>
					<h1 className='text-3xl text-gray-900 font-bold mb-8 text-center'>
						{auth.user === "student" ? "Welcome Student" : "Welcome Doctor"}
					</h1>
					<div className='flex flex-col justify-center'>
						

						<button onClick={() => goToFormPage()} className="relative mb-4 inline-block text-lg group">
  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
    <span className="absolute left-0 w-full h-48  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
    <span className="relative z-10">CLASSIFY</span>
  </span>
  <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
</button>
						{auth.user === "doctor" && (
							<>
								
								
								<button onClick={() => dashboard()} className="relative mb-4 inline-block text-lg group">
  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
    <span className="absolute left-0 w-full h-80  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
    <span className="relative z-10">DASHBOARD</span>
  </span>
  <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
</button>

								
								<button onClick={() => recorderdata()} className="relative mb-4 inline-block text-lg group">
  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
    <span className="absolute left-0 w-full h-80  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
    <span className="relative z-10">RECODED DATA</span>
  </span>
  <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
</button>

								<button onClick={() => analysis()} className="relative mb-4 inline-block text-lg group">
  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
    <span className="absolute left-0 w-full h-80  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
    <span className="relative z-10">ANALYSIS</span>
  </span>
  <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
</button>
								
								<button onClick={() => patientlog()} className="relative inline-block mb-4 text-lg group">
  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
    <span className="absolute left-0 w-full h-80  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
    <span className="relative z-10">Patient Log</span>
  </span>
  <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
</button>

							</>
						)}
						
						<button onClick={() => logout()} className="relative inline-block mb-4 text-lg group">
  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
    <span className="absolute left-0 w-full h-80  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
    <span className="relative z-10">LOG OUT</span>
  </span>
  <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
</button>
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
