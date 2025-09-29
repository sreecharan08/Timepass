import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      onUploadSuccess(res.data);
      setFile(null);
      setError('');
      setProgress(0);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="file-input-wrapper">
        <input type="file" onChange={handleFileChange} id="file" className="file-input"/>
        <label htmlFor="file" className="file-label">
          {file ? file.name : 'Choose File'}
        </label>
      </div>
      <button onClick={handleUpload} className="upload-button">Upload</button>
      {error && <p className="error-message">{error}</p>}
      {progress > 0 && <div className="progress-bar" style={{ width: `${progress}%` }}>{progress}%</div>}
    </div>
  );
};

export default FileUpload;