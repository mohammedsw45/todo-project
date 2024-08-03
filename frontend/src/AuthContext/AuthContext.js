import React, { createContext, useState } from 'react';
import axios from 'axios';
import { destination } from './General';


const AuthContext = createContext();
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
      setAuthTokens(response.data);
      const user = JSON.parse(atob(response.data.access.split('.')[1]));
      setUser(user);
      localStorage.setItem('authTokens', JSON.stringify(response.data));
      return { success: true, user };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, message: error.response.data.detail };
    }
  };

  const updateTask = async (id,status) => {
    try{
      var res = "";
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      if(status == "To Do"){
        res = "In Progress"
      }
      else if(status == "In Progress"){
        res = "Done"
      }
      else if(status == "Cancelled"){
        res = "Cancelled"
      } 
      const response = await axios.patch(`${destination}/todo/tasks/${id}/update/`,
        {
          "status": res,
        }, {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
        }
      });
       if (response && response.status === 200) 
        {
          return response.data;
        }
        } catch (error) {
          console.error('Task Start failed', error);
          return { success: false, message: error.response.data.detail };
        }
      };

      const startTaskStep = async (task_id,step_id,status) => {
        try{
          var res = "";
          const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
          if(status == "To Do"){
            res = "Started"
          }
          else if(status == "Started"){
            res = "Finished"
          } 
          else return;
          const response = await axios.put(`${destination}/todo/tasks/${task_id}/update/${step_id}/`,
            {
              "status": res,
            }, {
            headers: {
              'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
            }
          });
          return response.data;
            
            } catch (error) {
              console.error('Step ChangeStatus failed', error);
              return { success: false, message: error.response.data.detail };
            }
          };


      const editTask = async (id,title, desc) => {
        try{
          const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
 
          const response = await axios.patch(`${destination}/todo/tasks/${id}/update/`,
            {
              "title": title,
              "body": desc
            }, {
            headers: {
              'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
            }
          });
           if (response && response.status === 200) 
            {
              return response.data;
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
      var url = `${destination}/todo/tasks`;
      if(user.is_staff)
        url = `${destination}/todo/admin/tasks`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
        }
      });
      return response.data.tasks;
    }catch (error){
      console.error(error.message)
    }
  }

  const getAllAdminTasks = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.get(`${destination}/todo/admin/tasks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
        }
      });
      return response.data.tasks;
    }catch (error){
      console.error(error.message)
    }
  }

  const getTaskById = async (id) => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.get(`${destination}/todo/tasks/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
        }
      });
      return response.data;
    }catch (error){
      console.error(error.message)
    }
  }

  const createTask = async(title, description , time) =>
    {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      console.log(accessToken);
      const response = await axios.post(
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

      return response.data;
      // window.location.reload();
  
    } catch (error) {
      // Handle the error more gracefully
      console.error('Error creating task:', error.message);
      throw error;
    }
  };


  const createStep = async(title, description , taskId)=>
    {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      // console.log(accessToken);
      const response = await axios.post(
        `${destination}/todo/tasks/${taskId}/add/`,
        { 
          "title": title,
          "body": description,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}` 
          }
        }
      );
      // window.location.reload();
      console.log(response.data)
      return response.data;
  
    } catch (error) {
      // Handle the error more gracefully
      console.error('Error creating step:', error.message);
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
    <AuthContext.Provider value={{ authTokens, user, login, register, logout, getAllTasks,getAllAdminTasks, createTask, deleteTask, updateTask , createStep, editTask, startTaskStep , getTaskById}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

