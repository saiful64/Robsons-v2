import React, { useState ,useRef} from 'react';
import axios from 'axios';
import API_BASE_URL from "./config";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

function UploadXlsx() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

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
        }).then((response) => {
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
          console.error(error);
          toast.error("No data available.");
        });
       
    }
    setFile('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the input value to an empty string
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
  </div>
</div>
</>
  );
}

export default UploadXlsx;
