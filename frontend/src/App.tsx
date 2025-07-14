import './App.css';

import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth/Auth';
import Feed from './pages/Feed/Feed';
import Popular from './pages/Popular/Popular';
import User from './pages/User/User';
import About from './pages/About/About';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/user" element={<User />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </Provider>
  )
}