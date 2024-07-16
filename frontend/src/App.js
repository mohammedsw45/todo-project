import React, { useContext} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext, AuthProvider } from './AuthContext/AuthContext';
import "./App.css";
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import Cookies from 'js-cookie';

const App = () => {
   // remember the default state by user's device.
   const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
   const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
 
   //initial State:
   const [darkMode, setDarkMode] = React.useState(isDarkMode);
   const [language, setLanguage] = React.useState('en');

  const { user } = useContext(AuthContext);

  
  React.useEffect(() => {
    const savedDarkMode = Cookies.get('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
   
  }, []);
  React.useEffect(() => {
    const savedLanguage= Cookies.get('language');
        if (savedLanguage === 'en'||savedLanguage === 'ar' || savedLanguage === 'ku') {
          setLanguage(savedLanguage);
        }
  },[]);

  function toggleDarkMode(){
    setDarkMode(prevMode => !prevMode)
    Cookies.set('darkMode', !darkMode);
  }
  function changeLanguage(languageCode){
    setLanguage(languageCode);
    Cookies.set('language', languageCode);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className='container'>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} changeLanguage={changeLanguage} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
      <Main darkMode={darkMode} language={language} toggleSidebar={toggleSidebar}/>
      <Footer darkMode={darkMode} language={language} toggleSidebar={toggleSidebar}/>
    </div>
  );
};

export default App;