import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "./config";

function UploadXlsx() {
  const [file, setFile] = useState(null);z

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post(`${API_BASE_URL}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('File uploaded successfully');

        // Reset the file input after successful upload
        // document.getElementById('fileInput').value = '';
        // setFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    }
  };

  return (
    <div>
      <h1>Upload XLSX File</h1>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadXlsx;
