import React,{useContext} from 'react';
// import { AuthContext } from './AuthContext/AuthContext';

import './Main.css';
import {Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import NotFound from '../../pages/NotFound/NotFound';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import { AuthContext } from '../../AuthContext/AuthContext';
// import OurServices from './OurServices.js'
// import AboutUs from './AboutUs.js';
// import ContactUs from './ContactUs.js';
// import JoinUs from './JoinUs.js';
// import Academy from './Academy.js'
function Main(props){
    const { user } =  useContext(AuthContext);
    return(
        <div className="main-container">
        
        
        {user ?
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Home />} />

          <Route path="*" element={<Home />} />
          </Routes>
        :
        <Routes>
          <Route path="/register" element={<Register />}  />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
        }

        </div>
    )
}
export default Main;