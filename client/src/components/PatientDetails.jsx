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
  <div className="bg-white p-4 rounded-xl shadow-md text-center w-full max-w-screen-sm h-3/4 relative">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Patient Details</h1>
      <button
        className="px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
        onClick={closeDetails}
      >
        Close
      </button>
    </div>

    <div className="max-h-80 overflow-y-auto">
      <table className="table-auto">
        {/* ... Table content */}
      </table>
    </div>
  </div>
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
              <td className="border px-4 py-2">{columnName}</td>
              <td className="border px-4 py-2">{columnValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
        onClick={closeDetails}
      >
        Close
      </button>
    </div>
  </div>
  );
};

export default PatientDetails;
