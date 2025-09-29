import React from 'react';
import axios from 'axios';

const FileList = ({ files, onFilesUpdate }) => {

  const handleDownload = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/files/download/${file._id}`, {
        headers: {
          'x-auth-token': token,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/files/${fileId}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      onFilesUpdate();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="file-list-container">
      <h2>Your Files</h2>
      {files.length === 0 ? (
        <p>You have no files uploaded.</p>
      ) : (
        <ul className="file-list">
          {files.map((file) => (
            <li key={file._id} className="file-item">
              <span className="file-name">{file.originalName}</span>
              <div className="file-actions">
                <button onClick={() => handleDownload(file)} className="download-button">Download</button>
                <button onClick={() => handleDelete(file._id)} className="delete-button">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;