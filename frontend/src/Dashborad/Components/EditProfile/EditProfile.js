import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [UserType, setUserType] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
                const response = await axios.get(`http://192.168.1.98:8000/account/profiles/${id}`, {
                  headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
                });
                const profile = response.data;
                setFirstName(profile.user.first_name);
                setLastName(profile.user.last_name);
                setEmail(profile.user.email);
                setUserType(profile.user_type);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        fetchProfile();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
            await axios.put(
                `http://192.168.1.98:8000/account/profiles/${id}/update`,
                {
                    "user": {
                        "first_name": FirstName,
                        "last_name": LastName,
                        "email": Email,
                    },
                    "user_type": UserType,
                },
                {
                  headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
                }
            );
            navigate('/dashboard/users'); 
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
      <>
        <div className="Header">
           <h1>Edit User Profile</h1>
        </div>

          <div className="edit-profile">
              <form onSubmit={handleSubmit}>
                  <div className="field">
                      <label htmlFor="first_name">First Name:</label>
                      <input
                          type="text"
                          id="first_name"
                          value={FirstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                      />
                  </div>
                  <div className="field">
                    <label htmlFor="last_name">Last Name:</label>
                        <input
                            type="text"
                            id="last_name"
                            value={LastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                  </div>
                  <div className="field">
                      <label htmlFor="email">Email:</label>
                      <input
                          type="email"
                          id="email"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                  </div>

                  <div className="field">

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave empty to keep current password"
                    />
                  </div>

                  <div className='field'>
                  <label>User Type:</label>
                    <div className='user_type'>                    
                      <input
                          type="radio"
                          id="admin"
                          name="userType"
                          value="admin"
                          checked={UserType === 'admin'}
                          onChange={(e) => setUserType(e.target.value)}
                      />
                      <label htmlFor="admin">Admin</label>
                      <input
                          type="radio"
                          id="employee"
                          name="userType"
                          value="employee"
                          checked={UserType === 'employee'}
                          onChange={(e) => setUserType(e.target.value)}
                      />
                      <label htmlFor="employee">Employee</label>
                    </div>
                  </div>
                  <div className="update-button">
                    <button className="submit" type="submit">Update</button>
                  </div>
              </form>
          </div>
        </>
    );
};

export default EditProfile;
