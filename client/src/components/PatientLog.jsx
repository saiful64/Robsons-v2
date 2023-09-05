import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "./config";
import { useNavigate } from "react-router-dom";

const PatientLog = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const navigate = useNavigate();

  // Fetch patient IDs from the API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/patients`)
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
      })
      .catch((error) => {
        console.error("Error fetching patient IDs:", error);
      });
  }, []);

  // Calculate the index of the last patient on the current page
  const indexOfLastPatient = currentPage * patientsPerPage;
  // Calculate the index of the first patient on the current page
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  // Get the current patients for the current page
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goHome = () => {
		navigate("/home-view");
	};

  return (
    <>
      <div className="flex items-center justify-center h-screen ">
        <div className="bg-white p-6 rounded-lg shadow-md w-96 ">
          <h1 className="text-3xl font-bold mb-4 text-center">Patient Log</h1>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Patient ID</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient.patient_id}>
                  <td className="border px-4 py-2">{patient.patient_id}</td>
                  <td className="border px-4 py-2 text-right">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold justify-end px-2 py-1 items-end rounded-md mr-2">
                      Edit
                    </button>
                    <button className="bg-rose-500 hover:bg-rose-700 text-white font-bold px-2 py-1 justify-end items-end rounded-md">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination text-center mt-4">
          <button
              onClick={goHome}
              className="bg-gray-300 hover:cursor-pointer hover:bg-gray-400 font-bold px-2 py-1 rounded-md mr-2"
            >
              Home
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="disabled:hidden bg-gray-300 hover:cursor-pointer   hover:bg-gray-400 font-bold px-2 py-1 rounded-md mr-2"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastPatient >= patients.length}
              className="bg-blue-500 hover:cursor-pointer  hover:bg-blue-700 font-bold text-white px-2 py-1 rounded-md"
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
