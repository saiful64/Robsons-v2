import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "./config";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

function UploadXlsx() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

     // try {
        await axios.post(`${API_BASE_URL}/api/upload`, formData, {
           responseType: 'blob' ,
        }).then(response => {
          // Create a blob URL to allow the user to download the file.
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'sample.xlsx';
          a.click();
        })
        .catch(error => {
          // Handle errors.
          console.error(error);
        });
        
      // } catch (error) {
      //   console.error('Error uploading file:', error);
      //   alert('Error uploading file');
      // }
    }
  };

  return (
    <>
    <ToastContainer/>
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
        onChange={handleFileChange}
      />
      <button
        className='bg-violet-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-violet-600'
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  </div>
</div>
</>
  );
}

export default UploadXlsx;
