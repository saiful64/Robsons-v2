import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./auth";
import Datetime from "react-datetime";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

function ObsIndexForm() {
	const [formIndex, setFormIndex] = useState(0);
	const [formData, setFormData] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState({});
	const [textBoxValue, setTextBoxValue] = useState("");
	const [textareaValue, setTextareaValue] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [timeOfBirth, setTimeOfBirth] = useState("");
	const [prevFormIndex, setPrevFormIndex] = useState(-1);
	const [apgar1, setApgar1] = useState("");
	const [apgar5, setApgar5] = useState("");
	const auth = useAuth();

	const [selectedRadioButton, setSelectedRadioButton] = useState(null);
	const [group, setgroup] = useState("");
	const [formIndexStack, setFormIndexStack] = useState([]);
	const [isClicked, setIsClicked] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`${API_BASE_URL}/api/form-data`)
			.then((response) => {
				setFormData(response.data.formData);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const footerData = [
		{ key: "mainText", displayText: "@ 2023 JIPMER, O & G  Dept." },
		{ key: "subText", displayText: "Made with 🧡 by MCA students" },
	];

	const goToPreviousForm = () => {
		if (formIndexStack.length > 0) {
			const prevFormIndex = formIndexStack.pop(); // Step 3: Pop the index from the stack
			setFormIndex(prevFormIndex);
			setPrevFormIndex((prevForm) => prevForm - 1);
		}
	};

	const goToNextForm = () => {
		if (!isClicked) {
			const conditions = formData[formIndex]?.conditions;
			if (conditions) {
				let foundMatch = false;
				conditions.forEach((condition) => {
					const optionValue = condition.option;
					const targetValue = condition.target;
					if (selectedRadioButton === optionValue || "null" === optionValue) {
						console.log("Its a match");
						const targetFormIndex = formData.findIndex(
							(item) => item.title === targetValue
						);
						setFormIndex(targetFormIndex);
						setPrevFormIndex(formIndex); // Update prevFormIndex when moving to the next form
						foundMatch = true;
					}
				});
				if (!foundMatch) {
					setFormIndex((prevForm) => prevForm + 1);
					setPrevFormIndex(formIndex); // Update prevFormIndex when moving to the next form
				}
			} else {
				setFormIndex((prevForm) => prevForm + 1);
				setPrevFormIndex(formIndex); // Update prevFormIndex when moving to the next form
			}
			setFormIndexStack((prevStack) => [...prevStack, formIndex]);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			// 👇 Get input value
			goToNextForm();
		}
		if (event.key === "Backspace") {
			goToPreviousForm();
		}
	};

	// const handleKeyDownForSubmit = (event) => {
	// 	if(event.key === 'Enter'){
	// 		submitForms();
	// 	}
	// }

	const updateThisOption = (title, option) => {
		setSelectedOptions((prevState) => ({
			...prevState,
			[title]: option,
		}));
	};

	const goHome = () => {
		navigate("/home-view");
	};

	// function to handle navigation to the next form
	const submitForms = () => {
		let created_by = auth.user;
		selectedOptions["created_by"] = created_by;
		axios
			.post(`${API_BASE_URL}/submit-form`, selectedOptions)
			.then((response) => {
				console.log(response.data);
				let groupDetails = response.data;
				if (groupDetails) {
					setgroup(groupDetails.group);
					toast.success("Form Submitted Successfully");
					setIsClicked(true);
				}
			})
			.catch((error) => {
				console.error(error);
				toast.error("Unexpected error occured");
			});
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<ToastContainer />
			{isClicked && <Modal group={group} />}
			<div
				className={` bg-white shadow-lg rounded-lg ${
					isClicked ? "hidden" : ""
				}`}
			>
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
							<label
								key={index}
								className='inline-flex hover:cursor-pointer hover:text-2xl items-center'
							>
								<input
									type='radio'
									className='form-radio hover:cursor-pointer'
									name='radio'
									value={option.value}
									checked={
										option.displayText ===
										selectedOptions[formData[formIndex]?.title]
									}
									onChange={(event) => {
										setSelectedRadioButton(event.target.value);

										updateThisOption(
											formData[formIndex]?.title,
											option.displayText
										);
									}}
									onClick={() => {
										updateThisOption(
											formData[formIndex]?.title,
											option.displayText
										);
									}}
								/>
								<span className='ml-2'>{option.displayText}</span>
							</label>
						</div>
					))}
				</div>
				<div className='mt-6 flex'>
					{formData[formIndex]?.type == "textbox" && (
						<div className='flex flex-col mb-4'>
							{/* <label className="mb-1">{option.displayText}</label> */}
							<input
								type='text'
								className='border ml-7 border-gray-400 p-2 w-full rounded-md'
								value={textBoxValue}
								placeholder={"Enter Weeks"}
								onChange={(e) => {
									setTextBoxValue(e.target.value);
									updateThisOption(formData[formIndex]?.title, e.target.value);
								}}
							/>
						</div>
					)}
				</div>
				<div className='mt-6 flex'>
					{formData[formIndex]?.type == "twoInputs" && (
						<div className='flex flex-col mb-4 p-4'>
							<p className='m-4'>At 1 min: {apgar1}</p>
							<input
								type='range'
								min={0}
								max={10}
								className='border ml-7 border-gray-400 p-2 w-full rounded-md'
								value={apgar1}
								onChange={(e) => {
									setApgar1(e.target.value);
									updateThisOption("apgar1", e.target.value);
								}}
							/>
							<p className='m-4'>At 5 min: {apgar5}</p>
							<input
								type='range'
								min={0}
								max={10}
								className='border ml-7 border-gray-400 p-2 w-full rounded-md'
								value={apgar5}
								onChange={(e) => {
									setApgar5(e.target.value);
									updateThisOption("apgar5", e.target.value);
								}}
							/>
						</div>
					)}
				</div>
				<div className='m-6 py-3 px-0 w-80 relative justify-center'>
					{formData[formIndex]?.type == "textarea" && (
						<div className='flex h-max flex-col mb-4 '>
							<label for='message' className='mb-1 ml-1 text-sm font-bold'>
								Enter your message:
							</label>
							<textarea
								id='message'
								className='border h-28 rounded-lg form-textarea p-2 block text-sm text-gray-700 mb-2 border-black'
								placeholder='Enter your text here...'
								value={textareaValue}
								onChange={(event) => {
									setTextareaValue(event.target.value);
									updateThisOption(
										formData[formIndex]?.title,
										event.target.value
									);
								}}
							></textarea>
						</div>
					)}
				</div>

				{/* if date time picker is true then show the date time picker */}
				<div className='mt-6 flex'>
					{formData[formIndex]?.dateAndTimePicker && (
						<div className='flex flex-col mb-4'>
							{/* <label className="mb-1">{option.displayText}</label> */}

							<div className='relative max-w-sm datetime-box border ml-7 border-gray-400 p-2 w-full mb-4 rounded-md'>
								<Datetime
									dateFormat='YYYY-MM-DD' // Use uppercase 'DD' for day of the month
									timeFormat={false}
									value={dateOfBirth}
									inputProps={{ placeholder: "Date of Birth" }}
									placeholderText='Date of Birth'
									onChange={(value) => {
										const formattedDate = moment(value).format("YYYY-MM-DD");
										if (moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
											setDateOfBirth(formattedDate);
											updateThisOption(
												formData[formIndex]?.dateOfBirth,
												formattedDate
											);
										} else {
											setDateOfBirth(""); // Set to an empty string or a default value
										}
									}}
								/>
							</div>
							<div className='relative max-w-sm mt-2  datetime-box border ml-7 border-gray-400 p-2 w-full rounded-md'>
								<Datetime
									dateFormat={false}
									timeFormat='HH:mm' // Use uppercase 'A' for AM/PM
									value={timeOfBirth}
									placeholderText='Time of Birth'
									inputProps={{ placeholder: "Time of Birth" }}
									onChange={(value) => {
										const formattedTime = moment(value, "HH:mm", true).format(
											"HH:mm"
										);
										if (moment(formattedTime, "HH:mm", true).isValid()) {
											setTimeOfBirth(formattedTime);
											updateThisOption(
												formData[formIndex]?.timeOfBirth,
												formattedTime
											);
										} else {
											setTimeOfBirth(""); // Set to an empty string or a default value
										}
									}}
								/>
							</div>
						</div>
					)}
				</div>
				{/* navigation buttons */}
				<div className='mt-6 flex rounded-b-lg bg-gray-400'>
					{!formData[formIndex]?.showPrevious && (
						<button
							onClick={goHome}
							className=' text-white  hover:text-gray-800  rounded-bl-lg font-bold py-2 px-4  mr-auto'
						>
							Home
						</button>
					)}
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
							onKeyDown={handleKeyDown}
							className=' text-white hover:text-gray-800  rounded-br-lg font-bold py-2 px-4  ml-auto'
						>
							Next
						</button>
					)}
					{formData[formIndex]?.isSubmit && (
						<button
							onClick={submitForms}
							// onKeyDown={handleKeyDownForSubmit}
							className=' text-white hover:bg-gray-300 hover:text-gray-800 bg-gray-500  rounded-br-lg font-bold py-2 px-4  ml-auto'
						>
							Submit
						</button>
					)}
				</div>
			</div>
			<div className='flex flex-col bottom-[4%] absolute font-light inset-x-0 mt-10 animate-bounce items-center justify-center'>
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
