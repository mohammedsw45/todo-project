import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import {destination} from '../../../AuthContext/General.js'
import { Tooltip } from "@mui/material";

const InProgressTasks = () => {
  const [tasks, setTasks] = useState([]); 
  const [filteredtasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
        const response = await axios.get(`${destination}/todo/admin/tasks`, {
          headers: {
            'Authorization': `Bearer ${accessToken}` // Corrected template literal usage
          }
        });
        const allTasks = response.data.tasks;
        setTasks(allTasks || []);
  
        // Filter tasks with "In Progress" status
        const updatedTasks = allTasks.filter(task => task.status === "In Progress");
        setFilteredTasks(updatedTasks);
      } catch (error) {
        console.error(error.message);
        setTasks([]);
        setFilteredTasks([]);
      }
    };
  
    fetchTasks();
  }, []);

  const handleChange = (e) =>{
    const filter = tasks.filter(
      task => task.title.includes(e.target.value)
    )
    setFilteredTasks(filter);
  }
  return (
    <>
      <div className='main'>
        <table className='data-view'>
          <thead>
            <tr>
              <th>id</th>
              <th>Owner</th>
              <th>Title</th>
              <th>Estimated Hours</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredtasks.length > 0 ? 
              filteredtasks.map(task => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.owner.first_name} {task.owner.last_name}</td>
                  <td>{task.title}</td>
                  <td>{task.implementation_duration_hours} H</td>
                  <td>
                    <Tooltip title={task.steps.length != 0 ? ((task.steps.filter((step) => step.status === "Finished").length / task.steps.length)).toFixed(2)*100+'%' : 0+'%'}>
                      <progress className="task-progress" animated variant="success" style={{height: "30px"}} value={task.status == "Done" ? 1 : task.steps.length != 0 ? ((task.steps.filter((step) => step.status === "Finished").length / task.steps.length)).toFixed(2) : 0}/>
                    </Tooltip>
                  </td>                    
                </tr>
              )) : 
              <tr>
                <td colSpan="9"><h2>No tasks...</h2></td>
              </tr>
              }
          </tbody>
        </table> 
      </div>
        
    </>
    
  );
};

export default InProgressTasks;
