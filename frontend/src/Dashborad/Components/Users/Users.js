import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import './Users.css'
const Users = () => {
  const [profiles, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const AllUsers = await getAllUsers();
      setUsers(AllUsers || []);
    };

    fetchUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.get('http://192.168.1.98:8000/account/profiles', {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Corrected template literal usage
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return [];
    }
  };



  const [filtereduser, setFilteredUsers] = useState([]);
  useEffect(() => {
    setFilteredUsers(profiles)
    }, [profiles])

  const handleChange = (e) =>{
    const filter = profiles.filter(
      profile => profile.user.first_name.includes(e.target.value) | profile.user.last_name.includes(e.target.value)
    )
    setFilteredUsers(filter);
  }


  return (
    <>
      <div className='Header'>
        <input type="search" id="gsearch" name="gsearch" placeholder='Search' onInput={handleChange} />
        <div className='create-Task'>
          <Link className='hyper-link' to="/dashboard/create-new-user">Create new User</Link>
        </div>
      </div>

      <div className='main'>
        <table className='data-view'>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>User name</th>
              <th>User Type</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtereduser.length > 0 ? 
              filtereduser.map(profile => (
                <tr key={profile.id}>
                  <td>{profile.id}</td>
                  <td>{profile.user.first_name}</td>
                  <td>{profile.user.last_name}</td>
                  <td>{profile.user.email}</td>
                  <td>{profile.user.username}</td>
                  <td>{profile.user_type}</td>
                  <td><button>Edit</button></td>
                  <td><button>Delete</button></td>
                </tr>
              )) : 
              <tr>
                <td colSpan="8"><h2>You have no Profiles...</h2></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Users;
