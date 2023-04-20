import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import NavBar from './Components/NavBar';
import LoginForm from './Components/LoginForm';
import NotFound from './Components/NotFound';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/login' element={<LoginForm/>}/>
        <Route exact path='/test' element={<NotFound/>} />
      </Routes>
  </BrowserRouter>
  </React.StrictMode>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
