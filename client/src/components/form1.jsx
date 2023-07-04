import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./auth";
import Datetime from "react-datetime";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ObsIndexForm() {
	const [formIndex, setFormIndex] = useState(0); // state to keep track of the current form
	const [formData, setFormData] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState({});
	const [previousFormIndexStack, setPreviousFormIndexStack] = useState([]);
	const [textBoxValue, setTextBoxValue] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [timeOfBirth, setTimeOfBirth] = useState("");
	const [isStatus, setIsStatus] = useState(false);
	const [formId, setFormId] = useState("");
	const auth = useAuth();

	useEffect(() => {
		axios
			.get("http://localhost:3050/api/form-data")
			.then((response) => {
				setFormData(response.data.formData);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const footerData = [
		{ key: "mainText", displayText: "JIPMER" },
		{ key: "subText", displayText: "Obestetrics and Gynaecology Department" },
	];

	// function to handle navigation to the previous form
	const goToPreviousForm = () => {
		if (
			formData[formIndex]?.showPrevious &&
			previousFormIndexStack.length > 0
		) {
			const prevFormIndex = previousFormIndexStack.pop();
			// console.log(prevFormIndex, previousFormIndexStack)
			if (prevFormIndex !== undefined) {
				setFormIndex(prevFormIndex);
				return;
			}
		}
		setFormIndex(formIndex - 1);
	};

	// function to handle navigation to the next form
	const goToNextForm = () => {
		if (formData[formIndex]?.conditions) {
			const selectedOption = selectedOptions[formData[formIndex]?.title];
			const condition = formData[formIndex]?.conditions.find(
				(c) => c.option === selectedOption
			);
			if (condition) {
				const targetFormIndex = formData.findIndex(
					(f) => f.title === condition.target
				);
				if (targetFormIndex !== -1) {
					setFormIndex(targetFormIndex);
					setPreviousFormIndexStack((prev) => [...prev, formIndex]);
					return;
				}
			}
		}
		setFormIndex(formIndex + 1);
	};

	const updateThisOption = (title, option) => {
		setSelectedOptions((prevState) => ({
			...prevState,
			[title]: option,
		}));
	};

	// function to handle navigation to the next form
	const submitForms = () => {
		let created_by = auth.user;
		selectedOptions["created_by"] = created_by;
		axios
			.post("http://localhost:3050/submit-form", selectedOptions)
			.then((response) => {
				console.log(response.data);
				let groupDetails = response.data;
				if (groupDetails) {
					setFormId(groupDetails.formId);
					toast.success("Form Submitted Successfully");
					alert(groupDetails.group);
					goToNextForm();
				}
			})
			.catch((error) => {
				console.error(error);
				toast.error("unexpected error occured");
			});
	};

	// function to update status after successfully inserting data
	const updateStatus = () => {
		let indicationForInduction = selectedOptions[formData[formIndex]?.title];
		axios
			.post("http://localhost:3050/api/update-status", {
				formId,
				indicationForInduction,
			})
			.then((response) => {
				console.log(response.data);
				let groupDetails = response.data;
				if (groupDetails) {
					toast.success("Status Updated Successfully");
					setFormIndex(0);
				}
			})
			.catch((error) => {
				console.error(error);
				toast.error("unexpected error occured");
			});
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<ToastContainer />
			<div className=' bg-white shadow-lg rounded-lg '>
				<div className=' bg-gray-400 rounded-t-lg pr-20 pl-2 py-1'>
					<h2 className='text-2xl relative font-bold text-center'>
						Robsons Classification
					</h2>
					{/* radio buttons */}
				</div>

				{/* form title */}
				<div className='flex form-title mb-4 pr-20 pl-2'>
					<h3 className='text-lg font-bold'>
						{formData[formIndex]?.displayText}
					</h3>
				</div>

				<div className='flex form-content  bg-white mb-4 flex-col justify-between pr-20 pl-2'>
					{formData[formIndex]?.options.map((option, index) => (
						<div key={index}>
							<label key={index} className='inline-flex hover:cursor-pointer hover:text-2xl items-center'>
								<input
									type='radio'
									className='form-radio hover:cursor-pointer'
									name='radio'
									value={option.displayText}
									checked={
										option.displayText ===
										selectedOptions[formData[formIndex]?.title]
									}
									onChange={() =>
										updateThisOption(
											formData[formIndex]?.title,
											option.displayText
										)
									}
								/>
								<span className='ml-2'>{option.displayText}</span>
							</label>

							{option.type &&
								option.type === "textBox" &&
								selectedOptions[formData[formIndex]?.title] ===
									option.displayText && (
									<div className='flex flex-col mb-4'>
										{/* <label className="mb-1">{option.displayText}</label> */}
										<input
											type='text'
											className='form-input'
											value={textBoxValue}
											placeholder={option.displayText}
											onChange={(e) => {
												setTextBoxValue(e.target.value);
												updateThisOption(
													formData[formIndex]?.title,
													e.target.value
												);
											}}
										/>
									</div>
								)}
						</div>
					))}
				</div>

				{/* if date time picker is true then show the date time picker */}
				<div className='mt-6 flex'>
					{formData[formIndex]?.dateAndTimePicker && (
						<div className='flex flex-col mb-4'>
							{/* <label className="mb-1">{option.displayText}</label> */}

							<div className='relative max-w-sm p-2 datetime-box'>
								<Datetime
									dateFormat='YYYY-mm-DD'
									timeFormat={false}
									value={dateOfBirth}
									inputProps={{ placeholder: "Date of Birth" }}
									placeholderText='Date of Birth'
									onClose={(value) => {
										const formattedDate = moment(value).format("YYYY-MM-DD");
										setDateOfBirth(formattedDate);
										updateThisOption(
											formData[formIndex]?.dateOfBirth,
											formattedDate
										);
									}}
								/>
							</div>
							<div className='relative max-w-sm mt-2 p-2 datetime-box'>
								<Datetime
									dateFormat={false}
									timeFormat='HH:mm a'
									value={timeOfBirth}
									placeholderText='Time of Birth'
									inputProps={{ placeholder: "Time of Birth" }}
									onClose={(value) => {
										const formattedTime = moment(value).format("HH:mm");
										setTimeOfBirth(formattedTime);
										updateThisOption(
											formData[formIndex]?.timeOfBirth,
											formattedTime
										);
									}}
								/>
							</div>
						</div>
					)}
				</div>
				{/* navigation buttons */}
				<div className='mt-6 flex rounded-b-lg bg-gray-400'>
					{formData[formIndex]?.showPrevious && (
						<button
							onClick={goToPreviousForm}
							className=' text-white  hover:text-gray-800  rounded-bl-lg font-bold py-2 px-4  mr-auto'
						>
							Previous
						</button>
					)}
					{formData[formIndex]?.showNext && (
						<button
							onClick={goToNextForm}
							className=' text-white hover:text-gray-800  rounded-br-lg font-bold py-2 px-4  ml-auto'
						>
							Next
						</button>
					)}
					{formData[formIndex]?.isSubmit && (
						<button
							onClick={submitForms}
							className=' text-white hover:text-gray-800 bg-gray-700  rounded-br-lg font-bold py-2 px-4  ml-auto'
						>
							Submit
						</button>
					)}
				</div>
			</div>
			<div className='flex flex-col mt-10 items-center justify-center'>
				{footerData.map((item) => (
					<p key={item.key} className='text-md'>
						{item.displayText}
					</p>
				))}
			</div>
		</div>
	);
}

export default ObsIndexForm;
