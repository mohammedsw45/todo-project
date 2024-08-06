import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../../../components/ConfirmationDialog/ConfirmationDialog'; // Import the dialog component
import './Users.css';
import {destination} from '../../../AuthContext/General.js'


const Users = () => {
  const [profiles, setUsers] = useState([]);
  const [filtereduser, setFilteredUsers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

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
      const response = await axios.get(`${destination}/account/profiles/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log(response.data.profiles)
      return response.data.profiles;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return [];
    }
  };

  useEffect(() => {
    setFilteredUsers(profiles);
  }, [profiles]);

  const handleChange = (e) => {
    const filter = profiles.filter(
      profile => profile.user.first_name.includes(e.target.value) || profile.user.last_name.includes(e.target.value)
    );
    setFilteredUsers(filter);
  };

  const handleDeleteClick = (profileId) => {
    setSelectedProfileId(profileId);
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    console.log(selectedProfileId)

    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const res = await axios.delete(`${destination}/account/profiles/${selectedProfileId}/delete`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setUsers(profiles.filter(profile => profile.id !== selectedProfileId));
      setFilteredUsers(filtereduser.filter(profile => profile.id !== selectedProfileId));
      setShowDialog(false);
    } catch (error) {
      console.error('Error deleting profile:', error.message);
    }
  };

  const handleCancelDelete = () => {
    setShowDialog(false);
  };

  return (
    <>
      <div className='Header'>
        <input type="search" id="gsearch" name="gsearch" placeholder='Search' onChange={handleChange} />
        <Link className='hyper-link create-Task' to="/dashboard/create-new-user">Create new User</Link>
      </div>

      <div className='main'>
        <table className='data-view'>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>User Name</th>
              <th>User Type</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtereduser.length > 0 ? 
              filtereduser.map(profile => (
                <tr key={profile.user.id}>
                  <td>{profile.id}</td>
                  <td>{profile.user.first_name}</td>
                  <td>{profile.user.last_name}</td>
                  <td>{profile.user.email}</td>
                  <td>{profile.user.username}</td>
                  <td>{profile.user_type}</td>
                  <td>
                    <Link to={`/dashboard/edit-profile/${profile.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteClick(profile.user.id)}>Delete</button>
                  </td>
                </tr>
              )) : 
              <tr>
                <td colSpan="8"><h2>You have no Profiles...</h2></td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        message = "Are you sure you want to delete this user?"
        show={showDialog}
        onClose={handleCancelDelete}
        onConfirm={()=>handleConfirmDelete()}
      />
    </>
  );
};

export default Users;
