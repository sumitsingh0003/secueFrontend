import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FormComponent from './FormComponent';
import SingleUser from './SingleUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<FormComponent />} />
        <Route path='/:id' element={<SingleUser />} />
      </Routes>
    </Router>
  );
}

export default App;