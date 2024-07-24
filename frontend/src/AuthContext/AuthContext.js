import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const destination = "http://192.168.142.65:8000"
const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });
  const [user, setUser] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
 
    
    return tokens ? JSON.parse(atob(tokens.split('.')[1])) : null;
  });

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${destination}/account/token/`, { username, password });
      console.log("Login");
      console.log(response.data);
      setAuthTokens(response.data);
      setUser(JSON.parse(atob(response.data.access.split('.')[1])));
      localStorage.setItem('authTokens', JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, message: error.response.data.detail };
    }
  };

  const startTask = async (id) => {
    try{
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.patch(`${destination}/todo/tasks/${id}/update/`,
        {
          "status": "In Progress",


        }, {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
        }
      });
       if (response && response.status === 200) 
        {
          return { success: true };
        }
        } catch (error) {
          console.error('Task Start failed', error);
          return { success: false, message: error.response.data.detail };
        }
      };

  const deleteTask = async (id) => {
    try{
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.delete(`${destination}/todo/tasks/${id}/delete/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
        }
      });
       if (response && response.status === 200) 
        {
          return { success: true };
          window.location.reload();

        }
        } catch (error) {
          console.error('Deletion failed', error);
          return { success: false, message: error.response.data.detail };
        }
      };
    
  
  const getAllTasks = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.get(`${destination}/todo/tasks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
        }
      });
      return response.data.tasks;
    }catch (error){
      console.error(error.message)
    }
  }

  function createTask(title, description , time)
    {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      console.log(accessToken);
      const response = axios.post(
        `${destination}/todo/tasks/create/`,
        { 
          "title": title,
          "body": description,
          "implementation_duration_hours": time ,
          "steps" : []
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}` 
          }
        }
      );
      window.location.reload();
  
    } catch (error) {
      // Handle the error more gracefully
      console.error('Error creating task:', error.message);
      throw error;
    }
  };

  const register = async (firstName, lastName, email, password) => {
    console.log(`${destination}/account/register/`)
    try {
        const response = await axios.post(`${destination}/account/register/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });


      console.log("Register");
      console.log(response.data);
      
      if (response && response.status === 201) 
        {
          const login_response =  await login  (email, password)
          console.log(login_response)
          return { success: true };
          
        // setAuthTokens(response.data);
        // setUser(JSON.parse(atob(response.data.access.split('.')[1])));
        // localStorage.setItem('authTokens', JSON.stringify(response.data));
        // return { success: true };
        }
        } catch (error) {
          console.error('Registration failed', error);
          return { success: false, message: error.response.data.detail };
        }
      };
     
        
  
  

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };

  // useEffect for token refresh...

  return (
    <AuthContext.Provider value={{ authTokens, user, login, register, logout, getAllTasks, createTask, deleteTask, startTask }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

