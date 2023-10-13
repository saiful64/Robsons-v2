import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "./config";
import { useNavigate } from "react-router-dom";
import PatientDetails from "./PatientDetails";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const PatientLog = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [patientIdToView, setPatientIdToView] = useState(null);
  const [isPatientDetailsVisible, setIsPatientDetailsVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchPatients = () => {
    axios
      .get(`${API_BASE_URL}/api/patients`)
      .then((response) => {
        const sortedPatients = response.data.sort((a, b) => {
          const dateA = new Date(a.created_on);
          const dateB = new Date(b.created_on);
          return dateB - dateA;
        });
        setPatients(sortedPatients);
      })
      .catch((error) => {
        console.error("Error fetching patient IDs:", error);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

  const filteredPatients = patients.filter((patient) =>
    (patient.patient_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const handleEditClick = (patient) => {
    toast.success(`Editing patient with ID : ${patient.patient_id}`, {
      className: "",
    });
  };

  const handleViewClick = (patient) => {
    setPatientIdToView(patient.patient_id);
    setIsPatientDetailsVisible(true);
  };

  const closePatientDetails = () => {
    setIsPatientDetailsVisible(false);
    setPatientIdToView(null);
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setIsDeleteConfirmationVisible(true);
  };

  const confirmDelete = (patient_id) => {
    axios
      .delete(`${API_BASE_URL}/api/patients/${patient_id}`)
      .then((response) => {
        if (response.status === 200) {
          toast.success(
            `Patient with ID : ${patient_id} deleted successfully.`
          );
          fetchPatients();
        } else {
          toast.error(`Error deleting patient with ID ${patient_id}.`);
        }
      })
      .catch((error) => {
        toast.error(`Network error: ${error.message}`);
      })
      .finally(() => {
        setTimeout(() => {
          setIsDeleteConfirmationVisible(false);
          setPatientToDelete(null);
        }, 1000);
      });
  };

  const cancelDelete = () => {
    setIsDeleteConfirmationVisible(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const navigateHome = () => {
    navigate("/home-view");
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h1 className="text-3xl font-bold mb-4 text-center">Patient Log</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Patient ID"
              className="w-full border p-2 rounded"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {filteredPatients.length === 0 ? (
            <p className="text-center text-gray-600">
              No patient IDs found for the search.
            </p>
          ) : (
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
                    <td className="border px-4 py-2 hover:bg-slate-50">
                      {patient.patient_id}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded-md mr-2"
                        onClick={() => handleEditClick(patient)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold px-2 py-1 rounded-md mr-2"
                        onClick={() => handleViewClick(patient)}
                      >
                        View
                      </button>
                      <button
                        className="bg-rose-500 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded-md"
                        onClick={() => handleDeleteClick(patient)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="pagination text-center mt-4">
            <button
              onClick={navigateHome}
              className="bg-zinc-500 hover:bg-gray-300 hover:text-black text-white hover:cursor-pointer font-bold px-2 py-1 rounded-md mr-2"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="disabled:hidden bg-zinc-600 hover:bg-gray-300 hover:text-black text-white hover:cursor-pointer font-bold px-2 py-1 rounded-md mr-2"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={indexOfLastPatient >= filteredPatients.length}
              className="bg-zinc-700 hover:bg-gray-300 hover:text-black hover:cursor-pointer font-bold text-white px-2 py-1 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isPatientDetailsVisible && (
        <PatientDetails
          patientId={patientIdToView}
          onClose={closePatientDetails}
        />
      )}

      {isDeleteConfirmationVisible && (
        <DeleteConfirmationDialog
          patient={patientToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default PatientLog;
