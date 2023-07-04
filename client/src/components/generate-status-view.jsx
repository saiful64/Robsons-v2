import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DateRange } from "react-date-range";
import moment from "moment";
import { useTable, useResizeColumns } from "react-table";

function GenerateStatus() {
	const [dateRange, setDateRange] = useState([
		{
			startDate: moment().subtract(7, "days").toDate(),
			endDate: new Date(),
			key: "selection",
		},
	]);
	const [generateStatusData, setGenerateStatusData] = useState([]);
	const [columns, setColumns] = useState([]);
	const [data, setData] = useState([]);
	const [showCalendar, setShowCalendar] = useState(false);

	useEffect(() => {
		axios
			.get("http://localhost:3050/api/generate-status-init")
			.then((response) => {
				console.log(response.data);
				setData(response.data.data);
				setColumns(response.data.columns);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);
	const navigate = useNavigate();
	const auth = useAuth();
	const logout = () => {
		auth.logout();
		navigate("/login");
	};
	const goToFormPage = () => {
		navigate("/forms");
	};
	const generateSheetPage = () => {
		navigate("/generate-excel-sheet");
	};

	// Use useMemo to memoize the table instance to avoid unnecessary re-renders
	const tableInstance = useTable({ data, columns }, useResizeColumns);

	// Destructure the table instance and its properties
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		tableInstance;
	return (
		<>
			<div className='flex flex-col items-center justify-center h-screen'>
				<div className='bg-white p-6 rounded-lg shadow-md w-full sm:w-96'>
					<h1 className='text-3xl font-bold mb-4'>Welcome Consultant</h1>
					<div className='flex flex-col justify-center mb-7'>
						<div className='flex flex-col justify-center'>
							{showCalendar && (
								<DateRange
									editableDateInputs={true}
									onChange={(item) => setDateRange([item.selection])}
									moveRangeOnFirstSelection={false}
									maxDate={new Date()}
									ranges={dateRange}
								/>
							)}
							<button
								className='bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded'
								onClick={() => setShowCalendar(!showCalendar)}
							>
								{showCalendar ? "Close Calendar" : "Open Calendar"}
							</button>
						</div>
					</div>
					<div className='flex flex-col justify-center'>
						<div className='overflow-x-auto'>
							<table {...getTableProps()} className='table-auto w-full'>
								<thead className='bg-gray-200 text-gray-600 uppercase text-xs leading-normal'>
									{headerGroups.map((headerGroup) => (
										<tr {...headerGroup.getHeaderGroupProps()}>
											{headerGroup.headers.map((column) => (
												<th
													{...column.getHeaderProps()}
													className='py-3 px-6 text-left'
												>
													{column.render("Header")}
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody
									{...getTableBodyProps()}
									className='text-gray-600 text-sm font-light'
								>
									{rows.map((row) => {
										prepareRow(row);
										return (
											<tr {...row.getRowProps()}>
												{row.cells.map((cell) => {
													return (
														<td
															{...cell.getCellProps()}
															className='py-3 px-6 text-left whitespace-nowrap'
														>
															{cell.render("Cell")}
														</td>
													);
												})}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default GenerateStatus;
