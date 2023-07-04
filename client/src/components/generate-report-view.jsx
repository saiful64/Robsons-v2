import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./auth";
import { DateRange } from "react-date-range";
import moment from "moment";

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
	const generateReport = () => {
		axios({
			url: "http://localhost:3050/api/generate-report",
			method: "GET",
			responseType: "blob",
			params: {
				startDate: moment(dateRange[0].startDate).format("YYYY-MM-DD"),
				endDate: moment(dateRange[0].endDate).format("YYYY-MM-DD"),
			},
		})
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				const randomNumber = Math.floor(Math.random() * 10000);
				const fileName = `RobsonsClassificaton_Report_${moment(
					dateRange[0].startDate
				).format("YYYY-MM-DD")}_${moment(dateRange[0].endDate).format(
					"YYYY-MM-DD"
				)}_${moment(new Date()).format("x")}${randomNumber}.xlsx`;
				link.href = url;
				link.setAttribute("download", fileName); // set file name here
				document.body.appendChild(link);
				link.click();
			})
			.catch((error) => {
				console.error(error);
				toast.error("unexpected error occurred");
			});
	};

	return (
		<>
			<div className='flex flex-col items-center justify-center h-screen'>
				{
					<div className='bg-white p-6 rounded-lg shadow-md w-full sm:w-96'>
						<h1 className='text-3xl font-bold mb-4'>Welcome {auth.user}</h1>
						<div className='flex flex-col justify-center'>
							<div className='flex flex-col justify-center'>
								<label className='text-sm text-left  mb-4'>Date Range</label>
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
								className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded m-2'
								onClick={() => generateReport()}
							>
								GENERATE REPORT
							</button>
						</div>
					</div>
				}
			</div>
		</>
	);
}

export default GenerateReportView;
