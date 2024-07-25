import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewUser.css';
import {destination} from '../../../AuthContext/General.js'


const NewUser = () => {
  const navigate = useNavigate();

  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [UserType, setUserType] = useState('');

  const createUser = async (FirstName, LastName, Email, Password, UserType) => {
    try {

      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      await axios.post(
        `${destination}/account/profiles/add/`,
        { 
          "first_name": FirstName,
          "last_name": LastName,
          "email": Email,
          "password": Password,
          "user_type": UserType
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");

    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("ddddddddddddddddddddddddddddd");
      await createUser(FirstName, LastName, Email, Password, UserType);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setUserType('');
      console.log("ggggggggggggggggggggggggg");
      navigate('/dashboard/users');
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <>
      <div className="Header">
        <h1>Add New User</h1>
      </div>

      <div className="create-user">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <label htmlFor="first_name">First Name: </label>
            <input
              className="field"
              type="text"
              id="first_name"
              value={FirstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First Name"
            />

            <label htmlFor="last_name">Last Name: </label>
            <input
              className="field"
              type="text"
              id="last_name"
              value={LastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last Name"
            />

            <label htmlFor="email">Email: </label>
            <input
              className="field"
              type="email"
              id="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />

            <label htmlFor="password">Password: </label>
            <input
              className="field"
              type="password"
              id="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              autoComplete="current-password"
            />

            <label htmlFor="user_type">User Type: </label>
            <div className="user_type">
              <input
                type="radio"
                id="admin"
                name="userType"
                value="admin"
                checked={UserType === 'admin'}
                onChange={(e) => setUserType(e.target.value)}
              />
              <label htmlFor="admin">Admin</label><br />
              <input
                type="radio"
                id="employee"
                name="userType"
                value="employee"
                checked={UserType === 'employee'}
                onChange={(e) => setUserType(e.target.value)}
              />
              <label htmlFor="employee">Employee</label><br />
            </div>
          </div>

          <div className="add-button">
            <button className="submit" type="submit">Add</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewUser;
