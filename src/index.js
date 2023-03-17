import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LensAuthContextProvider } from './context/LensContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfileCreate from './lens/profile/create-profile-modal';
import Profile from './lens/profile/ProfileModal';
import NewdisplayPublication from './lens/getPost/NewdisplayPublication';
import DisplayMirror from './lens/Mirror/DisplayMirror';
import UploadModal from './componant/createPost-Modal';
import ProfileDetail from './lens/ExploreProfile/profileDetail';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LensAuthContextProvider>
      <BrowserRouter>
        <Routes>
          < Route path='/' element={<App />} />
          <Route path='/Createprofile' element={<ProfileCreate />} />
          <Route path='profile' element={<Profile/>}/>
          <Route path='publications' element={<NewdisplayPublication/>}/>
          <Route path='createPost' element={<UploadModal/>}/>
          <Route path="/newprofile/:id" element={<ProfileDetail />} />
          
        </Routes>
      </BrowserRouter>
    </LensAuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
