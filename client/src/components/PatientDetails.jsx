import React, { useState, useEffect } from "react"
import axios from "axios"
import "react-toastify/dist/ReactToastify.css"
import API_BASE_URL from "../config"

const PatientDetails = ({ patientId, onClose }) => {
  const [patientDetails, setPatientDetails] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const apiUrl = `${API_BASE_URL}/api/patient-details/${patientId}`

    axios
      .get(apiUrl)
      .then((response) => {
        setPatientDetails(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching patient details:", error)
        setIsLoading(false)
      })
  }, [patientId])

  const closeDetails = () => {
    if (onClose) {
      onClose() // Call the onClose function passed as a prop
    }
  }

  const columnNames = {
    patient_id: "Patient Id",
    obs_index: "Obs Index",
    previous_cesarean: "Previous Cesarean",
    fetus_type: "Fetus Type",
    weeks: "Weeks",
    pog: "POG",
    presentation_single: "Presentation Single",
    presentation_twin: "Presentation Twin",
    ripening: "Ripening",
    induced_augmented: "Induced Augmented",
    delivery: "Delivery",
    indication_ovd: "Indication OVD",
    indication_caesarean: "Indication Caesarean",
    B1Gender: "B1 Gender",
    B1Weight: "B1 Weight",
    b1apgar1: "B1 Apgar1",
    b1apgar5: "B1 Apgar5",
    b1outcome: "B1 Outcome",
    b1final_outcome: "B1 Final Outcome",
    indication_for_induction: "Indication For Induction",
    b1_date_of_birth: "B1 DOB",
    b1_time_of_birth: "B1 TOB",
    created_by: "Created By",
    created_on: "Created On",
    group_name: "Group Name",
    review: "Review",
    B2Gender: "B2 Gender",
    B2Weight: "B2 Weight",
    b2_date_of_birth: "B2 DOB",
    b2_time_of_birth: "B2 TOB",
    department: "Department",
    b2apgar1: "B2 Apgar1",
    b2apgar5: "B2 Apgar5",
    b2outcome: "B2 Outcome",
    b2final_outcome: "B2 Final Outcome",
    indication: "Indication",
  }

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-gray-600 bg-opacity-50">
      <div className="bg-white p-4 rounded-xl shadow-md text-center h-3/4 relative sm:w-96 lg:w-auto">
        <div className="max-h-full mb-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Column Name</th>
                  <th className="px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(patientDetails).map(
                  ([columnName, columnValue]) => (
                    <tr key={columnName}>
                      <td className="border hover:bg-slate-50 font-semibold px-4 py-2">
                        {columnNames[columnName] || columnName}
                      </td>
                      <td className="border hover-bg-slate-50 px-4 py-2">
                        {columnValue}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
        <button
          className="mt-4 mb-4 px-4 py-2 bg-zinc-700 hover:bg-gray-300 hover:text-black hover:cursor-pointer text-white rounded-md"
          onClick={closeDetails}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default PatientDetails
