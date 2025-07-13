import './App.css';

import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth/Auth';

export default function App() {

  return (

    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          {/* <Route path="/authentication" element={<Authentication />} /> */}
        </Routes>
      </Router>
    </Provider>
  )
}