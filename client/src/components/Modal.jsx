import React from "react";
import { useNavigate } from "react-router-dom";

const Modal = ({ group }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/home-view");
	};

	return (
		<div className='relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
			<div className='mt-3 text-center'>
				<div className='mx-auto mb-4 text-5xl flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
				😊
				</div>
				<h3 className='text-lg leading-6 font-medium text-gray-900'>
					Successfully added into <strong>{group.toUpperCase()}</strong>.
				</h3>

				<div className='mt-2 px-7 py-3'>
					<p className='text-sm text-gray-500'>
						Continue filling another data.
					</p>
				</div>
				<div className='items-center px-4 py-3'>
					<button
						onClick={handleClick}
						id='ok-btn'
						className='px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300'
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
