import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Add from './components/Add';
import Edit from './components/Edit';
import AdaugaCopil from './components/AdaugaCopil';
import EditCopil from './components/EditCopil';
import './App.css';

export default function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/edit/:id/copil/:idCopil" element={<EditCopil />} />
          <Route path="/add/:id/copil" element={<AdaugaCopil />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
