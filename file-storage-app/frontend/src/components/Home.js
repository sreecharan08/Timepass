import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    } else {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchFiles = async () => {
        try {
          const res = await api.get('/files');
          setFiles(res.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchFiles();
    }
  }, [user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFiles([...files, res.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const res = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      setFiles(files.filter((file) => file._id !== fileId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <button onClick={handleLogout} className="btn btn-delete">Logout</button>
      <div className="upload-section">
        <h3>Upload File</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} className="btn">Upload</button>
      </div>
      <div>
        <h3>Your Files</h3>
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              <span>{file.filename}</span>
              <div>
                <button onClick={() => handleDownload(file._id, file.filename)} className="btn">
                  Download
                </button>
                <button onClick={() => handleDelete(file._id)} className="btn btn-delete">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
