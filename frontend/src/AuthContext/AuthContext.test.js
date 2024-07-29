import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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



test('True should be truthy', () => {
  expect(true).toBeTruthy();
});

test('Login State', async () => {
  try {
    const username = 'sam9@gmail.com';
    const password = '12345678';
    const response = await axios.post(`${destination}/account/token/`, { username, password });
    const access = JSON.parse(atob(response.data.access.split('.')[1]));
    console.log(response)
    return { success: true, access };
  } catch (error) {
    return new Error(error);
  }
});

