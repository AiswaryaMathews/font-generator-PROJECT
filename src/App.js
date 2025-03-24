import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaDownload, FaFileImage } from 'react-icons/fa';
import './styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [fontGenerated, setFontGenerated] = useState(false);
  const [textFile, setTextFile] = useState(null); // State for text file
  const [preview, setPreview] = useState(null);  // State for file preview

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Set file preview
    } else {
      alert('Please upload a valid file (jpg, jpeg, png, or pdf).');
    }
  };

  const handleTextFileChange = (e) => {
    const selectedTextFile = e.target.files[0];
    const validTextTypes = ['text/plain', 'application/pdf', 'image/png'];

    if (selectedTextFile && validTextTypes.includes(selectedTextFile.type)) {
      setTextFile(selectedTextFile);
      setPreview(URL.createObjectURL(selectedTextFile)); // Set text file preview
    } else {
      alert('Please upload a valid text file (txt, pdf, or png).');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setFontGenerated(true);
        alert('File uploaded successfully!');
      }
    } catch (error) {
      alert('File upload failed');
      console.error(error);
    }
  };

  const handleUploadText = async () => {
    if (!textFile) {
      alert('Please select a text file first!');
      return;
    }

    const formData = new FormData();
    formData.append('textFile', textFile);

    try {
      const response = await axios.post('http://localhost:5000/upload-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        alert('Text or Image file uploaded successfully!');
      }
    } catch (error) {
      alert('Text file upload failed');
      console.error(error);
    }
  };

  const handleDownloadTemplate = () => {
    window.location.href = 'http://localhost:5000/download-template';
  };

  return (
    <div className="container">
      <h1 className="heading">Font Generator</h1>
      <button onClick={handleDownloadTemplate} className="btn download-btn">
        <FaDownload /> Download Template
      </button>

      <div className="upload-section-container">
        {/* Upload Text Section */}
        <div className="upload-section">
          <div className="upload-box">
            <h3>Upload Text or Image</h3>
            <input type="file" onChange={handleTextFileChange} />
            {preview && <p className="file-preview">Preview: {textFile ? textFile.name : 'No file selected'}</p>}
            {preview && textFile && <p className="preview-text">File: {textFile.name}</p>}
            {preview && textFile && textFile.type.includes('image') && (
              <img src={preview} alt="Preview" className="preview-image" />
            )}
            <button className="btn upload-btn" onClick={handleUploadText}>
              <FaUpload /> Upload Text or Image
            </button>
          </div>
        </div>

        {/* Upload and Generate Font Section */}
        <div className="upload-section">
          <div className="upload-box">
            <h3>Upload and Generate Font</h3>
            <input type="file" onChange={handleFileChange} />
            {preview && file && <img src={preview} alt="Preview" className="preview-image" />}
            <button className="btn upload-btn" onClick={handleUpload}>
              <FaUpload /> Upload and Generate Font
            </button>
          </div>
        </div>
      </div>

      {fontGenerated && (
        <a href="http://localhost:5000/download-font" className="download-link">
          <FaDownload /> Download Generated Font
        </a>
      )}
    </div>
  );
}

export default App;
