import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthorList from './components/AuthorList';
import AuthorDetail from './components/AuthorDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authors" element={<AuthorList />} />
        <Route path="/author/:id" element={<AuthorDetail />} />
      </Routes>
    </Router>
  );
}

export default App; 