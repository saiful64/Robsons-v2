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

const Form = () => {
	const [formData, setformData] = useState([]);
	const [currentForm, setcurrentForm] = useState(0);
	const [completed, setcompleted] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState({});

	useEffect(() => {
		axios
			.get(`${API_BASE_URL}/api/form-data`)
			.then((response) => {
				setformData(response.data.formData);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);
	const handleChoice = (value) => {
		const question = formData.formData[currentForm];
		const { title } = question;
		setFormResponses((prevFormResponses) => ({
			...prevFormResponses,
			[title]: value,
		}));
	};

	const handleNext = () => {
		if (currentForm === formData.formData.length - 1) {
			setcompleted(true);
		} else {
			setcurrentForm((prevForm) => prevForm + 1);
		}
	};

	const handlePrevious = () => {
		setCurrentQuestion((prevForm) => prevForm - 1);
	};

	const updateThisOption = (title, option) => {
		setSelectedOptions((prevState) => ({
			...prevState,
			[title]: option,
		}));
	};
	const submitForms = () => {
		let created_by = auth.user;
		selectedOptions["created_by"] = created_by;
		axios
			.post(`${API_BASE_URL}/submit-form`, selectedOptions)
			.then((response) => {
				console.log(response.data);
				let groupDetails = response.data;
				if (groupDetails) {
					setFormId(groupDetails.formId);
					setgroup(groupDetails.group);
					toast.success("Form Submitted Successfully");
					setIsClicked(true);
					setgroup(groupDetails.group);
					console.log(groupDetails.group);
				}
			})
			.catch((error) => {
				console.error(error);
				toast.error("unexpected error occured");
			});
	};

	const renderFormData = () => {
		return (
			<>
				<h3>{formData[currentForm]?.displayText} new</h3>
				{formData[currentForm]?.options.map((choice) => (
					<div key={choice.value}>
						<input
							type='radio'
							id={choice.value}
							name={formData[currentForm]?.title}
							value={choice.value}
							onChange={() => handleChoice(choice.value)}
						/>
						<label htmlFor={choice.value}>{choice.displayText}</label>
					</div>
				))}
			</>
		);
	};

	const renderForm = () => {
		if (completed) {
			{
				submitForms();
			}
		} else {
			return (
				<div>
					{renderFormData()}
					<button onClick={handlePrevious} disabled={currentForm === 0}>
						Previous
					</button>
					<button onClick={handleNext}>Next</button>
				</div>
			);
		}
	};

	console.log(formData);

	return <div>{renderForm()}</div>;
};

export default Form;
