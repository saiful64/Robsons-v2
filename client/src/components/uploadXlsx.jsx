import React, { useState, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from "./config";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



function UploadXlsx() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [isUploading, setIsUploading] = useState(false); 
  const [showProgress, setShowProgress] = useState(false); 
  const [delayedStart, setDelayedStart] = useState(false); 
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true); 
      setDelayedStart(true); 

      
      setTimeout(async () => {
        setDelayedStart(false); 
        setShowProgress(true); 
        const formData = new FormData();
        formData.append('file', file);

        try {
          await axios.post(`${API_BASE_URL}/api/upload`, formData, {
            responseType: 'blob',
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            },
          }).then((response) => {
            setIsUploading(false); 
            if (response.data) {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              const randomNumber = Math.floor(Math.random() * 10000);
              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const month = String(currentDate.getMonth() + 1).padStart(2, '0');
              const day = String(currentDate.getDate()).padStart(2, '0');
              const hour = String(currentDate.getHours()).padStart(2, '0');
              const minute = String(currentDate.getMinutes()).padStart(2, '0');
              const second = String(currentDate.getSeconds()).padStart(2, '0');

              const fileName = `Excel_Report_${day}-${month}-${year}_${hour}:${minute}:${second}_${randomNumber}.xlsx`;
              link.href = url;
              link.setAttribute("download", fileName);
              document.body.appendChild(link);
              link.click();
            } else {
              toast.warning("No data found");
            }
          })
            .catch((error) => {
              setIsUploading(false); // Upload finished with error
              console.error(error);
              toast.error("No data available.");
            });
        } catch (error) {
          setIsUploading(false); // Upload finished with error
          console.error(error);
          toast.error("Error uploading file.");
        }
      }, 5000); 
    }
    setFile('');
    setUploadProgress(0); 
    setShowProgress(false); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };
  const navigateHome = () => {
		navigate("/home-view");
	};

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='bg-white  w-96 p-6 text-center h-2/5 rounded-lg drop-shadow-2xl flex flex-col justify-center'>
          <h1 className='text-2xl font-bold mb-4 font-space'>Upload XLSX File</h1>
          <div className='flex items-center justify-center mt-4'>
            <input
              className="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100"
              type="file"
              accept=".xlsx"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              className='bg-violet-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-violet-600'
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
          {delayedStart && (
            <div className="mt-4">
              <div className="animate-pulse bg-violet-200 text-black text-center py-2 rounded">
              Analyze the Group...
              </div>
            </div>
          )}
          {showProgress && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-violet-600 bg-violet-200">
                      Upload Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-violet-600">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-4 overflow-hidden text-xs bg-violet-200 rounded">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-500"
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className='mt-[30px]'>
        <button
							onClick={navigateHome}
							className='bg-zinc-500 hover:bg-gray-300 hover:text-black text-white hover:cursor-pointer font-bold px-2 py-1 rounded-md mr-2 mt-8'
						>
							Home
						</button>
            </div>
        </div>
        
      </div>
    </>
  );
}

export default UploadXlsx;
