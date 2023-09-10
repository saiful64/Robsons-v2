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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ObsIndexForm() {
	const [formIndex, setFormIndex] = useState(0);
	const [formData, setFormData] = useState({ dateOfBirth: null });
	const [selectedOptions, setSelectedOptions] = useState({});
	const [weeks, setWeeks] = useState("");
	const [patientId, setPatientId] = useState("");
	const [textareaValue, setTextareaValue] = useState(null);
	const [b1DateOfBirth, setB1DateOfBirth] = useState(null);
	const [b1TimeOfBirth, setB1TimeOfBirth] = useState(null);
	const [b2DateOfBirth, setB2DateOfBirth] = useState(null);
	const [b2TimeOfBirth, setB2TimeOfBirth] = useState(null);
	const [prevFormIndex, setPrevFormIndex] = useState(-1);
	const [apgar1, setApgar1] = useState(null);
	const [apgar5, setApgar5] = useState(null);
	const auth = useAuth();
	const [patientExists, setPatientExists] = useState(false);
	const [selectedRadioButton, setSelectedRadioButton] = useState(null);
	const [group, setgroup] = useState(null);
	const [formIndexStack, setFormIndexStack] = useState([]);
	const [isClicked, setIsClicked] = useState(false);
	const navigate = useNavigate();
	const [showTextInput, setShowTextInput] = useState(false);
	const [textInputValue, setTextInputValue] = useState(null);
	const [b1Weight, setB1Weight] = useState(null);
	const [b2Weight, setB2Weight] = useState(null);

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
			const prevFormIndex = formIndexStack.pop();
			setFormIndex(prevFormIndex);
			setPrevFormIndex((prevForm) => prevForm - 1);
		}
	};

	const goToNextForm = () => {
		console.log(selectedOptions.fetus_type);
		if (formIndex == 0) {
			checkPatientExists();
		}
		if (
			formData[formIndex]?.title == "obs_index" &&
			selectedOptions.obs_index == "Primi"
		) {
			setFormIndex((prevForm) => prevForm + 1);
			setPrevFormIndex(formIndex);
		}
		if (
			formData[formIndex]?.title == "b1_gender" &&
			selectedOptions.fetus_type == "Single"
		) {
			setFormIndex((prevForm) => prevForm + 1);
			setPrevFormIndex(formIndex);
		}
		if (
			formData[formIndex]?.title == "final_outcome" &&
			selectedOptions.labour == "spontaneous"
		) {
			setFormIndex((prevForm) => prevForm + 1);
			setPrevFormIndex(formIndex);
		}
		console.log(selectedOptions.labour);
		if (selectedOptions.labour == "Pre Labour" && formIndex == 19) {
			setFormIndex((prevForm) => prevForm + 1);
			setPrevFormIndex(formIndex);
		}
		if (!isClicked) {
			const conditions = formData[formIndex]?.conditions;
			if (conditions) {
				let foundMatch = false;
				conditions.forEach((condition) => {
					const optionValue = condition.option;
					const targetValue = condition.target;
					if (selectedRadioButton === optionValue || "null" === optionValue) {
						const targetFormIndex = formData.findIndex(
							(item) => item.title === targetValue
						);
						setFormIndex(targetFormIndex);
						setPrevFormIndex(formIndex);
						foundMatch = true;
					}
				});
				if (!foundMatch) {
					setFormIndex((prevForm) => prevForm + 1);
					setPrevFormIndex(formIndex);
				}
			} else {
				setFormIndex((prevForm) => prevForm + 1);
				setPrevFormIndex(formIndex);
			}
			setFormIndexStack((prevStack) => [...prevStack, formIndex]);
		}
	};

	const checkPatientExists = async () => {
		try {
			const response = await axios.get(
				`${API_BASE_URL}/api/check_id/${patientId}`
			);
			const { exists } = response.data;

			if (exists) {
				// Patient ID already exists, show a Toast warning
				toast.warning("Patient ID already exists");
				setFormIndex((prevForm) => prevForm - 1);
				setPrevFormIndex(formIndex);
			}
		} catch (error) {
			console.error("Error checking patient existence:", error);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			goToNextForm();
		}
		if (event.key === "Backspace") {
			goToPreviousForm();
		}
	};

	const updateThisOption = (title, option) => {
		setSelectedOptions((prevState) => ({
			...prevState,
			[title]: option,
		}));
	};

	const goHome = () => {
		navigate("/home-view");
	};

	const submitForms = () => {
		let created_by = auth.user;
		selectedOptions["created_by"] = created_by;
		axios
			.post(`${API_BASE_URL}/submit-form`, selectedOptions)
			.then((response) => {
				console.log(response.data);
				let groupDetails = response.data;
				if (groupDetails && groupDetails.group) {
					setgroup(groupDetails.group);
					toast.success("Form Submitted Successfully");
					setIsClicked(true);
				} else {
					toast.error("Group Logic Error");
					setIsClicked(false); // Reset the isClicked state to false in case of error
				}
			})
			.catch((error) => {
				if (error.response && error.response.status === 400) {
					// Show toast message for 400 (Bad Request) error
					console.error("Error response:", error.response.data); // Log the error response for debugging
					toast.warning("Group Logic Error kindly verify it again");
				} else {
					// Show toast message for other errors
					console.error("Unexpected error:", error);
					toast.error("Unexpected error occurred");
				}
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
				<div className=' bg-gray-300 rounded-t-lg  pl-2 py-3'>
					<h2 className='text-2xl relative  text-gray-700 font-bold text-center'>
						Robsons Classification
					</h2>
				</div>
				<div className='flex form-title mb-4 pr-20 pl-2'>
					<h3 className='text-lg font-semibold'>
						{formData[formIndex]?.displayText}
					</h3>
				</div>

				<div className='flex form-content  bg-white mb flex-col justify-between pr-20 pl-2 max-h-80'>
					{formData[formIndex]?.options.map((option, index) => (
						<div key={index}>
							<label
								key={index}
								className={`inline-flex text-gray-600 hover:text-gray-900 hover:cursor-pointer hover:text-2xl items-center ${
									option.displayText ===
									selectedOptions[formData[formIndex]?.title]
										? "text-gray-900 text-xl" // If selected, make the text blue
										: "" // Otherwise, no additional class
								}`}
							>
								<input
									type='radio'
									className='form-radio hover:cursor-pointer '
									name='radio'
									value={option.value}
									checked={
										option.displayText ===
										selectedOptions[formData[formIndex]?.title]
									}
									onChange={(event) => {
										setSelectedRadioButton(event.target.value);
										if (formData[formIndex]?.title === "indication_cesarean") {
											if (event.target.value === "others") {
												setShowTextInput(true);
											} else setShowTextInput(false);
										}
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
					{showTextInput &&
						formData[formIndex]?.title == "indication_cesarean" && (
							<div>
								<input
									type='text'
									className='border ml-7 border-gray-400 p-2 w-full rounded-md'
									value={textInputValue}
									onChange={(e) => {
										setTextInputValue(e.target.value);
										updateThisOption(
											formData[formIndex]?.title,
											e.target.value
										);
									}}
									zz
									placeholder='Enter your text here...'
								/>
							</div>
						)}
				</div>
				<div className='mt-6 flex'>
					{formData[formIndex]?.type == "id" && (
						<div className='flex flex-col mb-4'>
							{/* <label className="mb-1">{option.displayText}</label> */}
							<input
								type='text'
								className='border ml-7 border-gray-400 p-2 w-full rounded-md'
								value={patientId}
								placeholder={"Enter Patient Id"}
								onChange={(e) => {
									setPatientId(e.target.value);
									updateThisOption(formData[formIndex]?.title, e.target.value);
								}}
							/>
						</div>
					)}
				</div>
				<div className='mt-6 flex'>
					{formData[formIndex]?.type == "weeks" && (
						<div className='flex flex-col mb-4'>
							{/* <label className="mb-1">{option.displayText}</label> */}
							<input
								type='number'
								className='border ml-7 border-gray-400 p-2 w-full rounded-md'
								value={weeks}
								placeholder={"Enter Weeks"}
								onChange={(e) => {
									setWeeks(e.target.value);
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
								className='border hover:cursor-pointer ml-7 border-gray-400 p-2 w-full rounded-md'
								value={apgar1}
								onChange={(e) => {
									setApgar1(e.target.value);
									updateThisOption("apgar1", e.target.value);
								}}
							/>
							<p className='m-4 '>At 5 min: {apgar5}</p>
							<input
								type='range'
								min={0}
								max={10}
								className='border ml-7 hover:cursor-pointer border-gray-400 p-2 w-full rounded-md'
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
							<label htmlFor='message' className='mb-1 ml-1 text-sm font-bold'>
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
				<div className='mt-3 flex justify-start'>
					{formData[formIndex]?.b1 && (
						<div className='flex flex-col mb-4'>
							<div className='relative max-w-sm datetime-box border ml-7 border-gray-400 p-2 w-80 mb-4 rounded-md'>
								Weight (in kg) :
								<input
									type='number'
									className='border m-1 p-2 w-full rounded-md'
									value={b1Weight}
									placeholder=' Enter Weight'
									onChange={(e) => {
										setB1Weight(e.target.value);
										updateThisOption("b1_weight", e.target.value);
									}}
								/>
							</div>
							<div className='relative max-w-sm datetime-box border ml-7 border-gray-400 p-2 w-80 mb-4 rounded-md'>
								Date :
								<DatePicker
									className='border m-2 p-2 w-full rounded-md'
									dateFormat='YYYY-MM-DD'
									timeFormat={false}
									value={b1DateOfBirth}
									inputProps={{ placeholder: "Date of Birth" }}
									placeholderText='Enter Date of Birth'
									maxDate={new Date()}
									onChange={(value) => {
										const formattedDate = moment(value).format("YYYY-MM-DD");
										if (moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
											setB1DateOfBirth(formattedDate);
											updateThisOption(
												formData[formIndex]?.b1_dateOfBirth,
												formattedDate
											);
										} else {
											setB1DateOfBirth("");
										}
									}}
								/>
							</div>
							<div className='relative max-w-sm datetime-box border ml-7 border-gray-400 p-2 w-80 mb-4 rounded-md'>
								Time (in hrs) :
								<Datetime
									className='border m-1 p-2 w-full rounded-md'
									dateFormat={false}
									timeFormat='HH:mm' // Use uppercase 'A' for AM/PM
									value={b1TimeOfBirth}
									placeholderText=' Time of Birth'
									inputProps={{ placeholder: "Enter Time of Birth" }}
									onChange={(value) => {
										const formattedTime = moment(value, "HH:mm", true).format(
											"HH:mm"
										);
										if (moment(formattedTime, "HH:mm", true).isValid()) {
											setB1TimeOfBirth(formattedTime);
											updateThisOption(
												formData[formIndex]?.b1_timeOfBirth,
												formattedTime
											);
										} else {
											setB1TimeOfBirth(""); // Set to an empty string or a default value
										}
									}}
								/>
							</div>
						</div>
					)}
				</div>
				<div className='mt-0 flex justify-start'>
					{formData[formIndex]?.b2 && (
						<div className='flex flex-col mb-4'>
							<div className='relative max-w-sm datetime-box border ml-7 border-gray-400 p-2 w-80 mb-4 rounded-md'>
								Weight:
								<input
									type='number'
									className='border m-1 p-2 w-full rounded-md'
									value={b2Weight}
									placeholder=' Enter Weight'
									onChange={(e) => {
										setB2Weight(e.target.value);
										updateThisOption("b2_weight", e.target.value);
									}}
								/>
							</div>
							<div className='relative max-w-sm datetime-box border ml-7 border-gray-400 p-2 w-80 mb-4 rounded-md'>
								Date :
								<DatePicker
									className='border m-2 p-2 w-full rounded-md'
									dateFormat='YYYY-MM-DD'
									timeFormat={false}
									value={b2DateOfBirth}
									inputProps={{ placeholder: "Date of Birth" }}
									placeholderText='Enter Date of Birth'
									maxDate={new Date()}
									onChange={(value) => {
										const formattedDate = moment(value).format("YYYY-MM-DD");
										if (moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
											setB2DateOfBirth(formattedDate);
											updateThisOption(
												formData[formIndex]?.b2_dateOfBirth,
												formattedDate
											);
										} else {
											setB2DateOfBirth("");
										}
									}}
								/>
							</div>
							<div className='relative max-w-sm datetime-box border ml-7 border-gray-400 p-2 w-80 mb-4 rounded-md'>
								Time :
								<Datetime
									className='border m-1 p-2 w-full rounded-md'
									dateFormat={false}
									timeFormat='HH:mm' // Use uppercase 'A' for AM/PM
									value={b2TimeOfBirth}
									placeholderText=' Time of Birth'
									inputProps={{ placeholder: "Enter Time of Birth" }}
									onChange={(value) => {
										const formattedTime = moment(value, "HH:mm", true).format(
											"HH:mm"
										);
										if (moment(formattedTime, "HH:mm", true).isValid()) {
											setB2TimeOfBirth(formattedTime);
											updateThisOption(
												formData[formIndex]?.b2_timeOfBirth,
												formattedTime
											);
										} else {
											setB2TimeOfBirth(""); // Set to an empty string or a default value
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
		</div>
	);
}

export default ObsIndexForm;
