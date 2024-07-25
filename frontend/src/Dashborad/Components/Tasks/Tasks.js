import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]); 

  useEffect(() => {
    const fetchTasks = async () => {
      const allTasks = await getAllTasks();
      setTasks(allTasks || []);
    };

    fetchTasks();
  }, []);

  const getAllTasks = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
      const response = await axios.get('http://192.168.1.98:8000/todo/admin/tasks', {
        headers: {
          'Authorization': `Bearer ${accessToken}` // Corrected template literal usage
        }
      });
      return response.data.tasks;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  };

  const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });


  const [filteredtasks, setFilteredTasks] = useState([]);
  useEffect(() => {
    setFilteredTasks(tasks)
    }, [tasks])

  const handleChange = (e) =>{
    const filter = tasks.filter(
      task => task.title.includes(e.target.value)
    )
    setFilteredTasks(filter);
  }
  return (
    <>
        <div className='Header'>
          {/* <input type="search" id="gsearch" name="gsearch" placeholder='Search...' onInput={handleChange} /> */}
            <Link className='hyper-link create-Task' to="/dashboard/create-new-task">Create new Task</Link>
        </div>

        <div className='main'>
        <table className='data-view'>
          <thead>
            <tr>
              <th>Owner</th>
              <th>#</th>
              <th>Title</th>
              <th>Created at</th>
              <th>Implementation Duration Hours</th>
              <th>Status</th>
              <th>Begin time</th>
              <th>End Time</th>
              <th>Viewers</th>
            </tr>
          </thead>
          <tbody>
            {filteredtasks.length > 0 ? 
              filteredtasks.map(task => (
                <tr key={task.id}>
                  <td>{task.owner.id}</td>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{dateTimeFormatter.format((Date.parse(task.updated_at)))}</td>
                  <td>{task.implementation_duration_hours} H</td>
                  <td>{task.status}</td>
                  <td>{task.begin_time === null ? "-" : dateTimeFormatter.format((Date.parse(task.begin_time)))}</td>
                  <td>{task.end_time === null ? "-" : task.end_time}</td>
                  <td> <button>Details</button> </td>
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

export default Tasks;
