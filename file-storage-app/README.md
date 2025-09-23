# MERN File Storage App

This is a simple file storage management system built with the MERN stack (MongoDB, Express, React, Node.js). It uses Google Identity Services for authentication.

## Features

- Google Sign-In for user authentication.
- Users can upload, view, download, and delete their files.
- Each user can only see their own files.

## Prerequisites

- Node.js and npm
- MongoDB
- A Google Client ID for Google Sign-In

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd mern-file-storage-app
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```
MONGO_URI=mongodb://localhost:27017/file-storage-app
PORT=5000
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Open `frontend/src/index.js` and replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID.

```javascript
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

Also, add a proxy to the `frontend/package.json` file to proxy API requests to the backend:

```json
"proxy": "http://localhost:5000"
```

### 4. Run the application

You will need two terminals to run the backend and frontend servers.

In the first terminal, run the backend server:

```bash
cd backend
npm start
```

In the second terminal, run the frontend server:

```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`.

## How to get a Google Client ID

1.  Go to the [Google API Console](https://console.developers.google.com/).
2.  Create a new project.
3.  Go to **Credentials** and click **Create credentials** > **OAuth client ID**.
4.  Select **Web application** as the application type.
5.  Add `http://localhost:3000` to the **Authorized JavaScript origins**.
6.  Add `http://localhost:3000/login` to the **Authorized redirect URIs**.
7.  Click **Create** and you will get your Client ID.
