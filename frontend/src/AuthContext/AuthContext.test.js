import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// import {logout} from './AuthContext.js'
import { destination } from './General';



// jest.mock('../api/auth', () => ({
//   login: jest.fn((email, password) => {
//     if (email === 'valid@example.com' && password === 'password123') {
//       return { token: 'abc123' };
//     } else {
//       throw new Error('Invalid credentials');
//     }
//   })
// }));



// test('GET /tasks should return a list of users', async () => {
//   const response = await fetch(`${destination}/todo/tasks`);
//   expect(response.status).toBe(200);
//   const users = await response.json();
//   expect(users).toHaveLength(5);
// });

/*
    functions: 
        login,
        register, 
        logout, 
        getAllTasks, 
        createTask, 
        deleteTask, 
        startTask , 
        createStep, 
        editTask
*/
test('True should be truthy', () => {
  expect(true).toBeTruthy();
});

// test('Login State', async () => {
//   try {
//     const username = 'sam9@gmail.com';
//     const password = '12345678';
//     const response = await axios.post(`${destination}/account/token/`, { username, password });
//     const access = JSON.parse(atob(response.data.access.split('.')[1]));
//     console.log(response)
//     return { success: true, access };
//   } catch (error) {
//     return new Error(error);
//   }


//   try {
//     const username = 'sam9@gmail.com';
//     const password = '12345678';
//     const response = await axios.post(`${destination}/account/token/`, { username, password });
//     const user = JSON.parse(atob(response.data.access.split('.')[1]));
//     setUser(user);
//     localStorage.setItem('authTokens', JSON.stringify(response.data));
//     return { success: true, user };
//   } catch (error) {
//     console.error('Login failed', error);
//     return { success: false, message: error.response.data.detail };
//   }
// });

test('Login State', async () => {
  try {
    const username = 'sam9a@gmail.com';
    const password = '12345678';
    const response = await axios.post(`${destination}/account/token/`, { username, password });
    const access = JSON.parse(atob(response.data.access.split('.')[1]));
    console.log(response)
    return { success: true, access };
  } catch (error) {
    return new Error(error);
  }
});


test('Get All tasks', async () => {
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
})

test('Get All tasks', async () => {
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
})

// test('Logout', async () => {
//     logout();
// })


// jest.mock('../app', () => ({
//   setAuthTokens: jest.fn(),
//   setUser: jest.fn(),
// }));

// // Import the logout function
// import { logout } from './AuthContext';

// describe('logout', () => {
//   afterEach(() => {
//     // Reset the mock functions after each test
//     jest.clearAllMocks();
//   });

//   test('should clear auth tokens, user, and remove item from localStorage', () => {
//     // Spy on the localStorage.removeItem function
//     const removeItemSpy = jest.spyOn(global.localStorage, 'removeItem');

//     // Call the logout function
//     logout();

//     // Assertions
//     expect(setAuthTokens).toHaveBeenCalledWith(null);
//     expect(setUser).toHaveBeenCalledWith(null);
//     expect(removeItemSpy).toHaveBeenCalledWith('authTokens');
//   });
// });