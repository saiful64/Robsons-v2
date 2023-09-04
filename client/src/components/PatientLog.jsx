import { React, useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useTable, useResizeColumns } from "react-table";
import API_BASE_URL from "./config";

const PatientLog = () => {
  const [patients, setPatients] = useState([]);

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

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md  sm:w-96">
        <h1 className="text-3xl font-bold mb-4 text-center">Patient Log</h1>
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patient_id}>
                <td>{patient.patient_id}</td>
                <td>
                  <button>Edit</button>
                </td>
                <td>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
};

export default PatientLog;
