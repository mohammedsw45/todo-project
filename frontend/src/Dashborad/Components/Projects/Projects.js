import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../../../components/ConfirmationDialog/ConfirmationDialog'; // Import the dialog component
import './Projects.css';
import {destination} from '../../../AuthContext/General.js'


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const AllProjects = await getAllProjects();
      setProjects(AllProjects || []);
    };
    
    fetchProjects();
  }, []);

  const getAllProjects = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.get(`${destination}/section/projects/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      return [];
    }
  };

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const handleChange = (e) => {
    const filter = projects.filter(
        project => project.user.name.includes(e.target.value)
    );
    setFilteredProjects(filter);
  };

  const handleDeleteClick = (projectId) => {
    setSelectedProjectId(projectId);
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    console.log(selectedProjectId)

    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const res = await axios.delete(`${destination}/section/projects/${selectedProjectId}/delete`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setProjects(projects.filter(project => project.id !== selectedProjectId));
      setFilteredProjects(filteredProjects.filter(project => project.id !== selectedProjectId));
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
        <Link className='hyper-link create-Task' to="/dashboard/create-new-project">Create new Project</Link>
      </div>

      <div className='main'>
        <table className='data-view'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Color</th>
              <th>Days</th>
              <th></th>
              <th></th>

            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? 
              filteredProjects.map(project => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td><div style={{width: "20px", height: "20px", backgroundColor: project.color, margin: "auto"}}></div></td>
                  <td>{project.implementation_duration_days} D</td>
                  <td>
                    <Link to={`/dashboard/edit-project/${project.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteClick(project.id)}>Delete</button>
                  </td>
                </tr>
              )) : 
              <tr>
                <td colSpan="8"><h2>You have no Projects...</h2></td>
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

export default Projects;
