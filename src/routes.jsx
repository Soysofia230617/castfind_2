import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChooseProfile from './Choose_profile';
import Register from './register';
import Enterance from './Enterance';
import Manager from './Manager';
import App from './App';
import Company from './Choose_company'
import CreateCompany from './Create_company'

const AppRoutes = () => (
  <Router>
    <Routes>
         <Route path="/" element={<App />} />
         <Route path="/choose-profile" element={<ChooseProfile />} />
         <Route path="/register" element={<Register />} />
         <Route path="/enterance" element={<Enterance />} />
        <Route path='/manager' element={<Manager />} />
        <Route path='/company' element={<Company />} />
        <Route path='/create-company' element={<CreateCompany />} />
    </Routes>
  </Router>
);

export default AppRoutes;
