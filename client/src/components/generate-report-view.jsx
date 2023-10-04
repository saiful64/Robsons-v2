import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./auth";
import { DateRange } from "react-date-range";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

function GenerateReportView() {
	const navigate = useNavigate();
	const auth = useAuth();
	const [dateRange, setDateRange] = useState([
		{
			startDate: moment().subtract(7, "days").toDate(),
			endDate: new Date(),
			key: "selection",
		},
	]);

	const generateReport = (specificData) => {
		axios({
			url: specificData
				? `${API_BASE_URL}/api/generate-report-one`
				: `${API_BASE_URL}/api/generate-report`,
			method: "GET",
			responseType: "blob",
			params: {
				startDate: moment(dateRange[0].startDate).format("YYYY-MM-DD"),
				endDate: moment(dateRange[0].endDate).format("YYYY-MM-DD"),
			},
		})
			.then((response) => {
				if (response.data) {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement("a");
					const randomNumber = Math.floor(Math.random() * 10000);
					const fileName = `RobsonsClassificaton_Report_${moment(
						dateRange[0].startDate
					).format("YYYY-MM-DD")}_${moment(dateRange[0].endDate).format(
						"YYYY-MM-DD"
					)}_${moment(new Date()).format("x")}${randomNumber}.xlsx`;
					link.href = url;
					link.setAttribute("download", fileName);
					document.body.appendChild(link);
					link.click();
				} else {
					toast.warning("No data found");
				}
			})
			.catch((error) => {
				console.error(error);
				toast.error("No data available.");
			});
	};

	const goHome = () => {
		navigate("/home-view");
	};

	return (
		<>
			<ToastContainer />
			<div className='flex flex-col items-center justify-center h-screen'>
				<div className='bg-white p-6 rounded-lg shadow-md sm:w-96'>
					<h1 className='text-3xl font-bold mb-4'>Welcome {auth.user}</h1>
					<div className='flex flex-col justify-center'>
						<div className='flex flex-col justify-center'>
							<label className='text-sm text-left mb-4'>Date Range</label>
							<DateRange
								editableDateInputs={true}
								onChange={(item) => setDateRange([item.selection])}
								moveRangeOnFirstSelection={false}
								maxDate={new Date()}
								ranges={dateRange}
							/>
						</div>
					</div>
					<div className='flex flex-col justify-center mt-5'>
						<button
							className='bg-zinc-300 hover:bg-gray-300 hover:text-black text-gray-600 font-bold py-2 px-4 rounded m-2'
							onClick={() => generateReport(false)}
						>
							GENERATE ALL DATA
						</button>
						<button
							className='bg-zinc-400 hover:bg-gray-300 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
							onClick={() => generateReport(true)}
						>
							GENERATE SPECIFIC DATA
						</button>
						<button
							className='bg-zinc-600 hover:bg-gray-300 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
							onClick={goHome}
						>
							HOME
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default GenerateReportView;