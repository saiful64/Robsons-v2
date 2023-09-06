import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "./config";
import { useNavigate } from "react-router-dom";

const PatientLog = () => {
	const [patients, setPatients] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [patientsPerPage] = useState(10);
	const [patientToDelete, setPatientToDelete] = useState(null);
	const [searchQuery, setSearchQuery] = useState(""); // New state for search
	const navigate = useNavigate();

	const fetchPatients = () => {
		fetch(`${API_BASE_URL}/api/patients`)
			.then((response) => response.json())
			.then((data) => {
				const sortedPatients = data.sort((a, b) => {
					const dateA = new Date(a.created_on);
					const dateB = new Date(b.created_on);
					return dateB - dateA;
				});

				setPatients(sortedPatients);
			})
			.catch((error) => {
				console.error("Error fetching patient IDs:", error);
			});
	};

	useEffect(() => {
		fetchPatients();
	}, []);

	const indexOfLastPatient = currentPage * patientsPerPage;
	const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

	// Apply search filter to patients
	const filteredPatients = patients.filter(
		(patient) =>
			(patient.patient_id && patient.patient_id.includes(searchQuery)) ||
			(patient.patient_name &&
				patient.patient_name.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const currentPatients = filteredPatients.slice(
		indexOfFirstPatient,
		indexOfLastPatient
	);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const goHome = () => {
		navigate("/home-view");
	};

	const handleEditClick = (patient) => {
		toast.success(`Editing patient with ID : ${patient.patient_id}`);
	};

	const handleDeleteClick = (patient) => {
		setPatientToDelete(patient);
		toast.info(
			<div className='text-center'>
				<p className='mb-4'>
					Are you sure you want to delete patient with ID : {patient.patient_id}
					?
				</p>
				<button
					className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2'
					onClick={() => confirmDelete(patient.patient_id)}
				>
					Delete
				</button>
				<button
					className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'
					onClick={cancelDelete}
				>
					Cancel
				</button>
			</div>,
			{
				onClose: () => setPatientToDelete(null),
			}
		);
	};

	const confirmDelete = (patient_id) => {
		axios
			.delete(`${API_BASE_URL}/api/patients/${patient_id}`)
			.then((response) => {
				if (response.status === 200) {
					toast.success(
						`Patient with ID : ${patient_id} deleted successfully.`
					);
					fetchPatients();
				} else {
					toast.error(`Error deleting patient with ID ${patient_id}.`);
				}
			})
			.catch((error) => {
				toast.error(`Network error: ${error.message}`);
			})
			.finally(() => {
				setTimeout(() => {
					toast.dismiss();
					setPatientToDelete(null);
				}, 3000);
			});
	};

	const cancelDelete = () => {
		toast.dismiss();
	};

	const handleViewClick = (patient) => {
		toast.info(`Viewing patient with ID : ${patient.patient_id}`);
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	return (
		<>
			<ToastContainer />
			<div className='flex items-center justify-center h-screen'>
				<div className='bg-white p-6 rounded-lg shadow-md w-96'>
					<h1 className='text-3xl font-bold mb-4 text-center'>Patient Log</h1>
					{/* Search input */}
					<input
						type='text'
						placeholder='Search patients by ID or name'
						value={searchQuery}
						onChange={handleSearchChange}
						className='w-full px-4 py-2 mb-4 border rounded-md'
					/>
					<table className='table-auto w-full'>
						<thead>
							<tr>
								<th className='px-4 py-2'>Patient ID</th>
								<th className='px-4 py-2'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{currentPatients.map((patient) => (
								<tr key={patient.patient_id}>
									<td className='border px-4 py-2'>{patient.patient_id}</td>
									<td className='border px-4 py-2 text-right'>
										<button
											className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded-md mr-2'
											onClick={() => handleEditClick(patient)}
										>
											Edit
										</button>
										<button
											className='bg-green-500 hover:bg-green-700 text-white font-bold px-2 py-1 rounded-md mr-2'
											onClick={() => handleViewClick(patient)}
										>
											View
										</button>
										<button
											className='bg-rose-500 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded-md'
											onClick={() => handleDeleteClick(patient)}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='pagination text-center mt-4'>
						<button
							onClick={goHome}
							className='bg-gray-300 hover:cursor-pointer hover:bg-gray-400 font-bold px-2 py-1 rounded-md mr-2'
						>
							Home
						</button>
						<button
							onClick={() => paginate(currentPage - 1)}
							disabled={currentPage === 1}
							className='disabled:hidden bg-gray-300 hover:cursor-pointer hover:bg-gray-400 font-bold px-2 py-1 rounded-md mr-2'
						>
							Previous
						</button>
						<button
							onClick={() => paginate(currentPage + 1)}
							disabled={indexOfLastPatient >= patients.length}
							className='bg-blue-500 hover:cursor-pointer hover:bg-blue-700 font-bold text-white px-2 py-1 rounded-md'
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default PatientLog;
