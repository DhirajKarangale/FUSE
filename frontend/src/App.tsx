import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Authentication from './pages/Auth/Auth';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
        {/* <Route path="/authentication" element={<Authentication />} /> */}
      </Routes>
    </Router>
  )
}