import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import Logo from '../components/Logo';
import './HomePage.css';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchFiles();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/files', {
        headers: {
          'x-auth-token': token,
        },
      });
      setFiles(res.data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const onUploadSuccess = () => {
    fetchFiles();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <Logo />
        <div className="header-right">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      <main className="main-content">
        <FileUpload onUploadSuccess={onUploadSuccess} />
        <FileList files={files} onFilesUpdate={fetchFiles} />
      </main>
    </div>
  );
};

export default HomePage;