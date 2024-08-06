import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import {destination} from '../../../AuthContext/General.js'


import axios from 'axios';
import './NewProject.css';

const NewProject = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#4259CD");
  const [days, setDays] = useState(0);

  const createProject = async (name, color, days) => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      console.log(accessToken);
      console.log(name, color, days)
      await axios.post(
        `${destination}/section/projects/create`,
        { 
          "name": name,
          "color": color,
          "implementation_duration_days": days,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}` 
          }
        }
      );
    } catch (error) {
      console.error('Error creating project:', error.message);
      throw error;
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(name, color, days);
      // Clear the input fields or update the UI as needed
      setName('');
      setColor('#FFFFFF');
      setDays('');
      navigate('/dashboard/projects')
    } catch (error) {
      console.error('Error submitting project:', error.message);
    }
  };

  return (
    <>
      <div className="Header">
        <h1>Create New Project</h1>
      </div>

      <div className="create-task">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter Project Name"
            />
            <label htmlFor="days">Duration in Days:</label>
            <input
              type="number"
              id="days"
              value={days}
              min={1}
              onChange={(e) => setDays(e.target.value)}
              required
            />
            <label htmlFor="color">Color:</label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>

          <div className="create-button">
              <button className="submit" type="submit">Create</button>
          </div>
          
        </form>
      </div>
    </>
  );
};

export default NewProject;