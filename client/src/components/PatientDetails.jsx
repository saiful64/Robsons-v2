import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from './config';

const PatientDetails = ({ patientId, onClose }) => {
  const [patientDetails, setPatientDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `${API_BASE_URL}/api/patient-details/${patientId}`;
    console.log('API URL:', apiUrl); // Add this line to log the API URL
    axios.get(apiUrl)
      .then((response) => {
        setPatientDetails(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching patient details:', error);
        setIsLoading(false);
      });
  }, [patientId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const closeDetails = () => {
    if (onClose) {
      onClose(); // Call the onClose function passed as a prop
    }
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-gray-600 bg-opacity-50">
  <div className="bg-white p-4 rounded-xl shadow-md text-center h-3/4  relative sm:w-96 lg:w-auto">
    <div className="max-h-full mb-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Column Name</th>
            <th className="px-4 py-2">Value</th>
          </tr> 
        </thead>
        <tbody>
          {Object.entries(patientDetails).map(([columnName, columnValue]) => (
            <tr key={columnName}>
              <td className="border hover:bg-slate-50 font-semibold px-4 py-2">{columnName.toUpperCase()}</td>
              <td className="border hover:bg-slate-50 px-4 py-2">{columnValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
    <button
        className="mt-4  mb-4 px-4 py-2 bg-zinc-700 hover:bg-gray-300 hover:text-black hover:cursor-pointer text-white rounded-md"
        onClick={closeDetails}
      >
        Close
      </button>
  </div>
  
  </div>
  );
};

export default PatientDetails;