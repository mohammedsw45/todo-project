import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// import {logout} from './AuthContext.js'
import { destination } from './General';


test('Login State', async () => {
  try {
    const username = 'sam9a@gmail.com';
    const password = '12345678';
    const response = await axios.post(`${destination}/account/token/`, { username, password });
    const access = JSON.parse(atob(response.data.access.split('.')[1]));
    // return { success: true, access };
    expect(access).toBeDefined();
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('Login failed');
  }
});

// test('Get All tasks', async () => {
//   try {
//     const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
//     const response = await axios.get(`${destination}/todo/tasks`, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
//       }
//     });
//     expect(response.data.tasks).toBeDefined();
//   } catch (error) {
//     throw new Error('Test failed due to error fetching tasks');
//   }
// });

// test('Get All tasks', async () => {
//   try {
//     const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
//     const response = await axios.get(`${destination}/todo/tasks`, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
//       }
//     });
//     return response.data.tasks;
//   }catch (error){
//     console.error(error.message)
//   }
// })

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