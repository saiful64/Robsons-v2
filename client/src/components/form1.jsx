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
  const [b1apgar1, setB1Apgar1] = useState(null);
  const [b1apgar5, setB1Apgar5] = useState(null);
  const [b2apgar1, setB2Apgar1] = useState(null);
  const [b2apgar5, setB2Apgar5] = useState(null);
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
    { key: "subText", displayText: "Made with 🧡 by PU MCA students" },
  ];

  const goToPreviousForm = () => {
    if (formIndexStack.length > 0) {
      const prevFormIndex = formIndexStack.pop();
      setFormIndex(prevFormIndex);
      setPrevFormIndex((prevForm) => prevForm - 1);
    }
  };

  const goToNextForm = () => {
    if (formIndex == 0) {
      if (
        selectedOptions["patient_id"] === undefined ||
        selectedOptions["patient_id"] === ""
      ) {
        toast.error("Please enter Patient ID");
        return;
      }
      checkPatientExists();
    }
    if (
      (formData[formIndex]?.title === "obs_index" &&
        selectedOptions["obs_index"] === undefined) ||
      (formData[formIndex]?.title === "fetus_type" &&
        selectedOptions["fetus_type"] === undefined) ||
      (formData[formIndex]?.title === "presentation_single" &&
        selectedOptions["presentation_single"] === undefined) ||
      (formData[formIndex]?.title === "presentation_twin" &&
        selectedOptions["presentation_twin"] === undefined) ||
      (formData[formIndex]?.title === "labour" &&
        selectedOptions["labour"] === undefined) ||
      (formData[formIndex]?.title === "delivery" &&
        selectedOptions["delivery"] === undefined)
    ) {
      toast.warning("Select any one");
      return;
    }

    if (formData[formIndex]?.title === "obs_index") {
      if (selectedOptions.obs_index == "Primi") {
        setFormIndex((prevForm) => prevForm + 1);
        setPrevFormIndex(formIndex);
        selectedOptions.previous_cesarean = undefined;
      }
    }

    if (
      (formData[formIndex]?.title === "weeks" &&
        selectedOptions["weeks"] === undefined) ||
      selectedOptions["weeks"] === ""
    ) {
      toast.warning("Please enter weeks");
      return;
    }

    if (formData[formIndex]?.title === "fetus_type") {
      if (selectedOptions.fetus_type == "Single") {
        selectedOptions.presentation_twin = undefined;
      } else if (selectedOptions.fetus_type == "Twins") {
        selectedOptions.presentation_single = undefined;
        setFormIndex((prevForm) => prevForm + 1);
        setPrevFormIndex(formIndex);
      }
    }
    if (formData[formIndex]?.title === "presentation_single") {
      setFormIndex((prevForm) => prevForm + 1);
      setPrevFormIndex(formIndex);
    }

    if (formData[formIndex]?.title == "labour") {
      if (selectedOptions.labour == "Spontaneous") {
        selectedOptions.ripening = undefined;
        setFormIndex((prevForm) => prevForm + 1);
        setPrevFormIndex(formIndex);
      } else if (selectedOptions.labour == "Pre Labour") {
        selectedOptions.ripening = undefined;
        selectedOptions.induced_augmented = undefined;
        selectedOptions.delivery = "Cesarean";
        setFormIndex((prevForm) => prevForm + 5);
        setPrevFormIndex(formIndex);
        setFormIndexStack((prevStack) => [...prevStack, formIndex]);
        return;
      }
    }

    if (formData[formIndex]?.title == "delivery") {
      if (selectedOptions.delivery == "SVD") {
        selectedOptions.indication_ovd = undefined;
        selectedOptions.indication_cesarean = undefined;
        selectedOptions.stage = undefined;
        setFormIndex((prevForm) => prevForm + 3);
        setPrevFormIndex(formIndex);
      } else if (selectedOptions.delivery == "Cesarean") {
        selectedOptions.indication_ovd = undefined;
        setFormIndex((prevForm) => prevForm + 1);
        setPrevFormIndex(formIndex);
      } else {
        selectedOptions.indication_cesarean = undefined;
        selectedOptions.stage = undefined;
      }
    }
    if (formData[formIndex]?.title == "indication_ovd") {
      setFormIndex((prevForm) => prevForm + 2);
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
      selectedOptions.fetus_type == "Single" &&
      formData[formIndex]?.title == "b1outcome"
    ) {
      console.log("enters");
      if (
        selectedOptions.b1outcome == "SB" ||
        selectedOptions.b1outcome == "M/S"
      ) {
        console.log("This");
        setFormIndex((prevForm) => prevForm + 2);
        setPrevFormIndex(formIndex);
      } else {
        console.log("Else");
        setFormIndex((prevForm) => prevForm + 1);
        setPrevFormIndex(formIndex);
      }
    }
    if (
      selectedOptions.fetus_type == "Twins" &&
      formData[formIndex]?.title == "b2outcome" &&
      (selectedOptions.b2outcome == "SB" || selectedOptions.b2outcome == "M/S")
    ) {
      setFormIndex((prevForm) => prevForm + 1);
      setPrevFormIndex(formIndex);
    }

    if (
      selectedOptions.fetus_type == "Single" &&
      formData[formIndex]?.title == "b1final_outcome"
    ) {
      if (selectedOptions.labour == "Spontaneous") {
        setFormIndex((prevForm) => prevForm + 2);
        setPrevFormIndex(formIndex);
      } else {
        setFormIndex((prevForm) => prevForm + 1);
        setPrevFormIndex(formIndex);
      }
    }
    if (
      selectedOptions.fetus_type == "Twins" &&
      formData[formIndex]?.title == "b2final_outcome"
    ) {
      setFormIndex((prevForm) => prevForm + 1);
      setPrevFormIndex(formIndex);
    }

    if (
      (formData[formIndex]?.title === "obs_index" &&
        selectedOptions["obs_index"] === undefined) ||
      (formData[formIndex]?.title === "fetus_type" &&
        selectedOptions["fetus_type"] === undefined) ||
      (formData[formIndex]?.title === "presentation_single" &&
        selectedOptions["presentation_single"] === undefined) ||
      (formData[formIndex]?.title === "presentation_twin" &&
        selectedOptions["presentation_twin"] === undefined) ||
      (formData[formIndex]?.title === "labour" &&
        selectedOptions["labour"] === undefined) ||
      (formData[formIndex]?.title === "delivery" &&
        selectedOptions["delivery"] === undefined)
    ) {
      toast.warning("Select any one");
      return;
    }

    if (!isClicked) {
      setFormIndex((prevForm) => prevForm + 1);
      setPrevFormIndex(formIndex);

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
    if (
      formData[formIndex]?.title === "labour" &&
      selectedOptions["labour"] === undefined
    ) {
      toast.warning("Select any one");
      return;
    }
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

  const clearSelection = () => {
    const currentFormTitle = formData[formIndex]?.title;
    if (
      currentFormTitle == "indication_cesarean" &&
      selectedRadioButton == "others"
    ) {
      setTextInputValue("");
      setShowTextInput(false);
    }
    setSelectedOptions((prevOptions) => {
      const updatedOptions = { ...prevOptions };
      delete updatedOptions[currentFormTitle];
      return updatedOptions;
    });
    setSelectedRadioButton(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer />
      {isClicked && <Modal group={group} />}
      <div
        className={` bg-white shadow-2xl rounded-lg lg:w-[450px] ${
          isClicked ? "hidden" : ""
        }`}
      >
        <div className=" bg-gradient-to-r from-indigo-100 to-black rounded-t-lg  pl-2 py-3">
          <h2 className="font-space text-2xl relative  text-gray-50 opacity-80 hover:opacity-100 font-bold text-center">
            Robsons Classification
          </h2>
        </div>
        <div className="flex form-title mb-4 mt-2 ml-4">
          <h3 className="text-lg text-gray-900 font-semibold">
            {formData[formIndex]?.displayText}
          </h3>
        </div>

        <div className="flex form-content mb-0 flex-col justify-center items-center max-h-80">
          <div style={{ maxHeight: "calc(100% - 40px)", overflowY: "auto" }}>
            {formData[formIndex]?.options.map((option, index) => (
              <div key={index} className="mb-2">
                <label
                  key={index}
                  className={`inline-flex text-center border-dashed border-2 border-black px-4 py-2 font-semibold rounded-md w-full  hover:shadow-2xl hover:border-2 hover:bg-gradient-to-br hover:from-gray-900 hover:to-gray-600  hover:text-white bg-slate-100 hover:cursor-pointer text-gray-900 ${
                    option.displayText ===
                    selectedOptions[formData[formIndex]?.title]
                      ? "bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 text-white"
                      : ""
                  }`}
                  style={{
                    minWidth: "100px",
                    width: "200px",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <input
                    type="radio"
                    className="opacity-0 absolute h-0 w-0"
                    name="radio"
                    value={option.value}
                    checked={
                      option.displayText ===
                      selectedOptions[formData[formIndex]?.title]
                    }
                    onChange={(event) => {
                      setSelectedRadioButton(event.target.value);
                      if (
                        formData[formIndex]?.title === "indication_cesarean"
                      ) {
                        if (event.target.value === "others") {
                          setShowTextInput(true);
                        } else {
                          setShowTextInput(false);
                        }
                      }
                      updateThisOption(
                        formData[formIndex]?.title,
                        option.displayText
                      );
                    }}
                    style={{
                      position: "absolute", // Add absolute positioning to the input
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                  <span>{option.displayText}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center">
          {showTextInput &&
            formData[formIndex]?.title === "indication_cesarean" && (
              <div className="w-64 mt-6">
                <input
                  type="text"
                  className="border shadow-md hover:shadow-xl border-gray-400 p-2 w-full rounded-md"
                  value={textInputValue}
                  onChange={(e) => {
                    setTextInputValue(e.target.value);
                    updateThisOption(
                      formData[formIndex]?.title,
                      e.target.value
                    );
                  }}
                  placeholder="Enter your text here..."
                />
              </div>
            )}
        </div>

        {formData[formIndex]?.type == "id" && (
          <div className="mt-6 justify-center items-center flex">
            <div className="flex flex-col mb-4">
              <label className="mb-1 italic text-sm">
                Please enter in the format JD0000
              </label>

              <input
                type="text"
                className="border shadow-md focus:shadow-xl border-gray-400 p-2 w-full rounded-md"
                value={patientId}
                placeholder={"Enter Patient Id"}
                onChange={(e) => {
                  setPatientId(e.target.value.toUpperCase());
                  updateThisOption(formData[formIndex]?.title, e.target.value);
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col justify-center items-center">
          {formData[formIndex]?.type == "weeks" && (
            <div className="flex flex-col mb-4">
              {/* <label className="mb-1">{option.displayText}</label> */}
              <input
                type="number"
                className="border shadow-lg bg-transparent border-gray-400 p-2 w-full rounded-md"
                value={weeks}
                placeholder={"Enter Weeks"}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (/^\d+$/.test(newValue) || newValue === "") {
                    // Input is a positive integer or an empty string
                    const numericValue = parseInt(newValue, 10);
                    if (
                      !isNaN(numericValue) &&
                      numericValue >= 0 &&
                      numericValue <= 100
                    ) {
                      setWeeks(numericValue);
                      updateThisOption(
                        formData[formIndex]?.title,
                        numericValue
                      );
                    } else if (numericValue < 0) {
                      // Value is less than 0, set it to the minimum (0)
                      setWeeks(0);
                      updateThisOption(formData[formIndex]?.title, 0);
                    } else if (numericValue > 100) {
                      // Value is greater than 100, set it to the maximum (100)
                      setWeeks(100);
                      updateThisOption(formData[formIndex]?.title, 100);
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
        <div className="mt-3 flex">
  {formData[formIndex]?.type === "twoInputs" && (
    <div className="flex flex-col mb-2 p-2">
      <div className="flex flex-row"> {/* Add a parent div for flex layout */}
        <div className="flex flex-col mb-2 p-2 mr-6">
          <p className="font-semibold">Baby 1 details</p>
          <p className="m-4">At 1 min: {b1apgar1}</p>
          <input
            type="range"
            min={0}
            max={10}
            className="border hover:cursor-pointer ml-7 border-gray-400 p-2 w-full rounded-md"
            value={b1apgar1}
            onChange={(e) => {
              setB1Apgar1(e.target.value);
              updateThisOption("b1apgar1", e.target.value);
            }}
          />
          <p className="m-4 ">At 5 min: {b1apgar5}</p>
          <input
            type="range"
            min={0}
            max={10}
            className="border ml-7 hover:cursor-pointer border-gray-400 p-2 w-full rounded-md"
            value={b1apgar5}
            onChange={(e) => {
              setB1Apgar5(e.target.value);
              updateThisOption("b1apgar5", e.target.value);
            }}
          />
        </div>

        {selectedOptions.fetus_type == "Twins" && (
          <><div className="border-l border-gray-300 h-64 mx-6"></div>
          <div className="flex flex-col mb-2 p-2 mx-6">
            <p className="font-semibold">Baby 2 Details</p> {/* Add a title for Baby 2 Details */}
            <p className="m-4">At 1 min: {b2apgar1}</p>
            <input
              type="range"
              min={0}
              max={10}
              className="border hover:cursor-pointer ml-7 border-gray-400 p-2 w-full rounded-md"
              value={b2apgar1}
              onChange={(e) => {
                setB2Apgar1(e.target.value);
                updateThisOption("b2apgar1", e.target.value);
              }}
            />
            <p className="m-4 ">At 5 min: {b2apgar5}</p>
            <input
              type="range"
              min={0}
              max={10}
              className="border ml-7 hover:cursor-pointer border-gray-400 p-2 w-full rounded-md"
              value={b2apgar5}
              onChange={(e) => {
                setB2Apgar5(e.target.value);
                updateThisOption("b2apgar5", e.target.value);
              }}
            />
          </div>
          </>
        )}
        
        
      </div>
    </div>
  )}
</div>



        <div className=" py-3 px-4 w-80 items-center relative justify-center">
          {formData[formIndex]?.type === "textarea" && (
            <div className="flex flex-col mb-4">
              <label htmlFor="message" className="mb-2 text-sm font-bold">
                Enter your message:
              </label>
              <textarea
                id="message"
                className="border h-28 w-full rounded-lg resize-none p-2 block text-sm text-gray-700 mb-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your text here..."
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
        <div className="flex justify-center items-center flex-wrap">
          {formData[formIndex]?.b1 && (
            <div className="flex flex-col mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="dateOfBirth" className="mr-2">
                  Date:
                </label>
                <DatePicker
                  id="dateOfBirth"
                  className="border ml-4 border-gray-500 px-2 py-1 rounded-md"
                  dateFormat="YYYY-MM-DD"
                  timeFormat={false}
                  value={b1DateOfBirth}
                  inputProps={{ placeholder: "YYYY-MM-DD" }}
                  placeholderText="Enter Date of Birth"
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
              <div className="flex items-center mb-2">
                <label htmlFor="timeOfBirth" className="mr-2">
                  Time:
                </label>
                <Datetime
                  id="timeOfBirth"
                  className="border ml-4 border-gray-500 px-2 py-1 rounded-md"
                  dateFormat={false}
                  timeFormat="HH:mm"
                  value={b1TimeOfBirth}
                  placeholderText="HH:mm"
                  inputProps={{ placeholder: "Enter Time in hrs" }}
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
                      setB1TimeOfBirth("");
                    }
                  }}
                />
              </div>
              <div className="flex items-center mb-2">
                <label htmlFor="weight" className="mr-2">
                  Weight:
                </label>
                <div className="flex">
                  <input
                    id="weight"
                    type="number"
                    step="0.01" //Allow decimal numbers with two decimal places
                    className="border border-gray-500 px-2 py-1 rounded-md"
                    value={b1Weight}
                    placeholder="Enter Weight in kg"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (/^\d+(\.\d+)?$/.test(newValue) || newValue === "") {
                        // Input is a positive number or an empty string
                        const numericValue = parseFloat(newValue);
                        if (
                          !isNaN(numericValue) &&
                          numericValue >= 0 &&
                          numericValue <= 10
                        ) {
                          setB1Weight(numericValue);
                          updateThisOption("b1_weight", numericValue);
                        } else if (numericValue < 0) {
                          // Value is less than 0, set it to the minimum (0)
                          setB1Weight(0);
                          updateThisOption("b1_weight", 0);
                        } else if (numericValue > 10) {
                          // Value is greater than 10, set it to the maximum (10)
                          setB1Weight(10);
                          updateThisOption("b1_weight", 10);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center flex-wrap">
          {selectedOptions.fetus_type == "Twins" &&
            formData[formIndex].title == "b2_gender" && (
              <div className="flex flex-col mb-4">
                <div className="flex items-center mb-2">
                  <label htmlFor="dateOfBirth" className="mr-2">
                    Date:
                  </label>
                  <DatePicker
                    id="dateOfBirth"
                    className="border ml-4 border-gray-500 px-2 py-1 rounded-md"
                    dateFormat="YYYY-MM-DD"
                    timeFormat={false}
                    value={b2DateOfBirth}
                    inputProps={{ placeholder: "YYYY-MM-DD" }}
                    placeholderText="Enter Date of Birth"
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
                <div className="flex items-center mb-2">
                  <label htmlFor="timeOfBirth" className="mr-2">
                    Time:
                  </label>
                  <Datetime
                    id="timeOfBirth"
                    className="border ml-4 border-gray-500 px-2 py-1 rounded-md"
                    dateFormat={false}
                    timeFormat="HH:mm"
                    value={b2TimeOfBirth}
                    placeholderText="HH:mm"
                    inputProps={{ placeholder: "Enter Time in hrs" }}
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
                        setB2TimeOfBirth("");
                      }
                    }}
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label htmlFor="weight" className="mr-2">
                    Weight:
                  </label>
                  <div className="flex">
                    <input
                      id="weight"
                      type="number"
                      step="0.01" // Allow decimal numbers with two decimal places
                      className="border border-gray-500 px-2 py-1 rounded-md"
                      value={b2Weight}
                      placeholder="Enter Weight in kg"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (/^\d+(\.\d+)?$/.test(newValue) || newValue === "") {
                          // Input is a positive number or an empty string
                          const numericValue = parseFloat(newValue);
                          if (
                            !isNaN(numericValue) &&
                            numericValue >= 0 &&
                            numericValue <= 10
                          ) {
                            setB2Weight(numericValue);
                            updateThisOption("b2_weight", numericValue);
                          } else if (numericValue < 0) {
                            // Value is less than 0, set it to the minimum (0)
                            setB2Weight(0);
                            updateThisOption("b2_weight", 0);
                          } else if (numericValue > 10) {
                            // Value is greater than 10, set it to the maximum (10)
                            setB2Weight(10);
                            updateThisOption("b2_weight", 10);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
        <div className="flex justify-center items-center">
          <hr className="h-px my-0 border-100 w-80 rounded-md" />
        </div>
        {/* navigation buttons */}
        <div className="mt-2 mb-2 py-2 flex rounded-b-lg bg-white ">
          {!formData[formIndex]?.showPrevious && (
            <button
              onClick={goHome}
              className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 hover:bg-gradient-to-r hover:from-gray-200  hover:text-gray-900 hover:to-gray-400 text-gray-800  rounded-md font-bold py-2 px-4 ml-4 mr-auto"
            >
              Home
            </button>
          )}
          {formData[formIndex]?.showPrevious && (
            <button
              onClick={goToPreviousForm}
              className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 hover:bg-gradient-to-r hover:from-gray-200  hover:text-gray-900 hover:to-gray-400 text-gray-800  rounded-md font-bold py-2 px-4 ml-4 mr-auto"
            >
              Previous
            </button>
          )}
          {formData[formIndex]?.type !== "id" && ( // Add this condition
            <div className="">
              <button
                onClick={clearSelection}
                className="bg-gradient-to-r from-red-200 to-red-400 hover:bg-gradient-to-r hover:from-red-200  hover:text-red-900 hover:to-red-400 text-red-800  rounded-md font-bold py-2 px-4"
              >
                Clear
              </button>
            </div>
          )}
          {formData[formIndex]?.showNext &&
            !(
              formData[formIndex]?.title === "labour" &&
              auth.user === "department"
            ) && (
              <button
                onClick={goToNextForm}
                onKeyDown={handleKeyDown}
                className="bg-gradient-to-r from-gray-900 to-gray-600 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-900 hover:text-white text-gray-200 rounded-md font-bold py-2 px-4 mr-4 ml-auto"
              >
                Next
              </button>
            )}
          {(formData[formIndex]?.isSubmit ||
            (formData[formIndex]?.title === "labour" &&
              auth.user === "department")) && (
            <button
              onClick={submitForms}
              // onKeyDown={handleKeyDownForSubmit}
              className="bg-gradient-to-r from-gray-900 to-gray-600 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-900 hover:text-white text-gray-200 rounded-md font-bold py-2 px-4 mr-4 ml-auto"
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
