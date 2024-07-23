import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

import axios from 'axios';
import './NewTask.css';

const NewTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [viewers, setViewers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      console.log(allUsers);
      setAllUsers(allUsers || []);
    };

    fetchUsers();
  }, []);

  const createTask = async (title, description, time, viewers) => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      console.log(accessToken);
      await axios.post(
        'http://192.168.1.163:8000/todo/admin/tasks/create/',
        { 
          "title": title,
          "body": description,
          "implementation_duration_hours": time,
          "viewers": viewers,
          "steps": []
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}` 
          }
        }
      );
    } catch (error) {
      console.error('Error creating task:', error.message);
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.get('http://192.168.1.163:8000/account/profiles', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return [];
    }
  };

  const isChecked = (id) => viewers.includes(id);

  const handleCheckboxChange = (id) => {
    setViewers((prevViewers) =>
      prevViewers.includes(id)
        ? prevViewers.filter((viewerId) => viewerId !== id)
        : [...prevViewers, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(title, description, time, viewers);
      // Clear the input fields or update the UI as needed
      setTitle('');
      setDescription('');
      setTime('');
      setViewers([]);
      navigate('/dashboard/tasks')
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <>
      <div className="Header">
        <h1>Create New Task</h1>
      </div>

      <div className="create-task">
        <form onSubmit={handleSubmit} className="form">
          <div className="title">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter Task Title"
            />
          </div>
          <div className="description">
            <label htmlFor="description">Description: </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter Description"
            />
          </div>
          <div className="time">
            <label htmlFor="time">Time in Hours:</label>
            <input
              type="number"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <h1>Excuters:</h1>
          <div className="viewers">
            
            <>
            {allUsers.map((profile) => (
              <div key={profile.user.id}>
                <input
                  type="checkbox"
                  id={`viewer-${profile.user.id}`}
                  checked={isChecked(profile.user.id)}
                  onChange={() => handleCheckboxChange(profile.user.id)}
                />
                <label htmlFor={`viewer-${profile.user.id}`}>
                  {profile.user.first_name} {profile.user.last_name}
                </label>
              </div>
            ))}
            </>
          </div>
          <div className="create-button">
              <button className="submet" type="submit">Create</button>
          </div>
          
        </form>
      </div>
    </>
  );
};

export default NewTask;
