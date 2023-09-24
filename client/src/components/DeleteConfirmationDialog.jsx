import React from "react";

const DeleteConfirmationDialog = ({ patient, onConfirm, onCancel }) => {
	const handleDelete = () => {
		onConfirm(patient.patient_id);
	};

	return (
		<div className='fixed top-0 left-0 flex justify-center items-center w-full h-full bg-gray-600 bg-opacity-50'>
			<div className='bg-white p-4 rounded-lg w-80 shadow-md text-center'>
				<p className='mb-4'>
					Are you sure you want to delete patient with{" "}
					<span className='font-extrabold'>ID: {patient.patient_id}?</span>
				</p>
				<button
					className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2'
					onClick={handleDelete}
				>
					Delete
				</button>
				<button
					className='bg-gray-500 hover-bg-gray-700 text-white font-bold py-2 px-4 rounded'
					onClick={onCancel}
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default DeleteConfirmationDialog;
