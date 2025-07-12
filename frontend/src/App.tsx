import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth/Auth';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        {/* <Route path="/authentication" element={<Authentication />} /> */}
      </Routes>
    </Router>
  )
}