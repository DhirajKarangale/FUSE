import './App.css';

import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth/Auth';
import Feed from './pages/Feed/Feed';
import Popular from './pages/Popular/Popular'
import CustomizeFeed from './pages/CustomizeFeed/CustomizeFeed';
import Post from './pages/Post/Post';
import User from './pages/User/User';
import About from './pages/About/About';

import AutoLogin from './components/AutoLogin';
import SetBG from './backgrounds/SetBG';
import LayoutNavbar from './components/LayoutNavbar';
import MessageBar from './components/MessageBar';
import Loader from './components/Loader';

import { routeAuth, routeFeed, routePopular, routeCustomizeFeed, routePost, routeUser, routeAbout } from './utils/Routes';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <SetBG />
        <AutoLogin />
        <MessageBar />
        <Loader />

        <Routes>
          <Route path={routeAuth} element={<Auth />} />

          <Route element={<LayoutNavbar />}>
            <Route path={routeFeed} element={<Feed />} />
            <Route path={routePopular} element={<Popular />} />
            <Route path={routeCustomizeFeed} element={<CustomizeFeed />} />
            <Route path={routePost} element={<Post />} />
            <Route path={routeUser} element={<User />} />
            <Route path={routeAbout} element={<About />} />
          </Route>

        </Routes>
      </Router>
    </Provider>
  )
};

// Dither, Ripple Grid, Particles, Dark Veil, Galaxy