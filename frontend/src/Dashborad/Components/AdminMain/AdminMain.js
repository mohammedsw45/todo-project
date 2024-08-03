import React, {useContext, useEffect, useState } from "react";
import { AuthContext } from '../../../AuthContext/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminMain.css';
// import { destination } from '../../AuthContext/General.js';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)


export default function AdminMain(){
  const [tasks, setTasks] = useState([]);
  const { user } =  useContext(AuthContext);

  const { getAllAdminTasks } = useContext(AuthContext);


  const fetchTasks = async () => {
    const allTasks = await getAllAdminTasks();
    console.log('allTasks', allTasks === null)
    setTasks(allTasks);
  };
  useEffect(() => { 
    fetchTasks();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 5000); // 30 seconds

    return () => clearInterval(interval);
  }, []);
  
  const global_data = {
    labels: ['To Do', 'In Progress','Done', 'Cancelled'],
    datasets: [
      {
        data: [ tasks.filter(task=>task.status=='To Do').length,
                tasks.filter(task=>task.status=='In Progress').length,
                tasks.filter(task=>task.status=='Done').length,
                tasks.filter(task=>task.status=='Cancelled').length
        ],
        backgroundColor: ['blue', 'yellow', 'green','red']
      }
    ]
  }
  const data = {
    labels: ['To Do', 'In Progress','Done', 'Cancelled'],
    datasets: [
      {
        data: [ tasks.filter(task=>task.status=='To Do'&& (new Date(task.created_at)).getDate()==(new Date()).getDate()).length,
                tasks.filter(task=>task.status=='In Progress').length,
                tasks.filter(task=>task.status=='Done'&& (new Date(task.end_time)).getDate()==(new Date()).getDate()).length,
                tasks.filter(task=>task.status=='Cancelled' && (new Date(task.updated_at)).getDate()==(new Date()).getDate()).length
        ],
        backgroundColor: ['blue', 'yellow', 'green','red']
      }
    ]
  }
  const options = {

  };
    
  
return(
        <div className="AdminMain">
          <div className="AdminMain-content">
            
            <div className="AdminMain-content-section">
              <div className="AdminMain-content-section-grid">
                <div className="AdminMain-content-section-grid-content">
                  <h1 className="task-summary-h1">
                    Summary of tasks today
                  </h1>
                  <div className="summary-table">
                    <h2 className="task-summary-title">Tasks Created: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>(new Date(task.created_at)).getDate()==(new Date()).getDate()).length!=0? tasks.filter(task=>(new Date(task.created_at)).getDate()==(new Date()).getDate()).length:''} {tasks.filter(task=>(new Date(task.created_at)).getDate()==(new Date()).getDate()).length == 0 ? 'No Tasks.' : tasks.filter(task=>(new Date(task.created_at)).getDate()==(new Date()).getDate()).length==1 ? 'Task.' : 'Tasks.'}</span>
                    <h2 className="task-summary-title">Tasks To Do: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>task.status=='To Do'&& (new Date(task.created_at)).getDate()==(new Date()).getDate()).length!=0? tasks.filter(task=>task.status=='To Do'&&(new Date(task.created_at)).getDate()==(new Date()).getDate()).length:''} {tasks.filter(task=>task.status=='To Do'&&(new Date(task.created_at)).getDate()==(new Date()).getDate()).length == 0 ? 'No Tasks.' : tasks.filter(task=>task.status=='To Do'&&(new Date(task.created_at)).getDate()==(new Date()).getDate()).length==1 ? 'Task.' : 'Tasks.'}</span>

                    <h2 className="task-summary-title">Tasks In Progress: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>task.status=='In Progress').length!=0? tasks.filter(task=>task.status=='In Progress').length:''} {tasks.filter(task=>task.status=='In Progress').length == 0 ? 'No Tasks.' : tasks.filter(task=>task.status=='In Progress').length==1 ? 'Task.' : 'Tasks.'}</span>
                    <h2 className="task-summary-title">Tasks Done Today: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>task.status=='Done').length!=0? tasks.filter(task=>task.status=='Done'&&(new Date(task.end_time)).getDate()==(new Date()).getDate()).length:''} {tasks.filter(task=>task.status=='Done'&&(new Date(task.end_time)).getDate()==(new Date()).getDate()).length == 0 ? 'No Tasks.' : tasks.filter(task=>task.status=='Done'&&(new Date(task.end_time)).getDate()==(new Date()).getDate()).length==1 ? 'Task.' : 'Tasks.'}</span>
                    <h2 className="task-summary-title">Cancelled Today: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>task.status=='Cancelled'&& (new Date(task.end_time)).getDate()==(new Date()).getDate()).length!=0? tasks.filter(task=>task.status=='Cancelled'&&(new Date(task.end_time)).getDate()==(new Date()).getDate()).length:''} {tasks.filter(task=>task.status=='Cancelled'&&(new Date(task.end_time)).getDate()==(new Date()).getDate()).length == 0 ? 'No Tasks.' : tasks.filter(task=>task.status=='Cancelled'&&(new Date(task.end_time)).getDate()==(new Date()).getDate()).length==1 ? 'Task.' : 'Tasks.'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="AdminMain-content-section">
              <div className="AdminMain-content-section-grid"> 
                <div className="AdminMain-content-section-grid-content">
                  <h1 className="task-summary-h1">
                    Visualization of Today's Tasks
                  </h1>
                  <div className="AdminMain-content-piechart">
                    <Pie
                    data={data}
                    options={options}
                    />
                  </div>
              </div>
            </div>
          </div>

            <div className="AdminMain-content-section">
              <div className="AdminMain-content-section-grid">
                <div className="AdminMain-content-section-grid-content">
                  <h1 className="task-summary-h1">
                    Summary of tasks overtime
                  </h1>
                  <div className="summary-table">
                    <h2 className="task-summary-title">Tasks Created: </h2>
                    <span className="task-summary-content">{tasks.length==0?'':tasks.length} {tasks.length == 0 ? 'No Tasks.' : tasks.length==1 ? 'Task.' : 'Tasks.'}</span>
                    <h2 className="task-summary-title">Tasks To Do: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>task.status=='To Do').length!=0? tasks.filter(task=>task.status=='To Do').length:''} {tasks.filter(task=>task.status=='To Do').length == 0 ? 'No Tasks.' : tasks.filter(task=>task.status=='To Do').length==1 ? 'Task.' : 'Tasks.'}</span>

                    <h2 className="task-summary-title">Tasks In Progress: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>task.status=='In Progress').length!=0? tasks.filter(task=>task.status=='In Progress').length:''} {tasks.filter(task=>task.status=='In Progress').length == 0 ? 'No Tasks.' : tasks.filter(task=>task.status=='In Progress').length==1 ? 'Task.' : 'Tasks.'}</span>
                    <h2 className="task-summary-title">Tasks Done: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>task.status=='Done').length!=0? tasks.filter(task=>task.status=='Done').length:''} {tasks.filter(task=>task.status=='Done').length == 0 ? 'No Tasks.' : tasks.filter(task=>task.status=='Done').length==1 ? 'Task.' : 'Tasks.'}</span>
                    <h2 className="task-summary-title">Cancelled Tasks: </h2>
                    <span className="task-summary-content">{tasks.filter(task=>task.status=='Cancelled').length!=0? tasks.filter(task=>task.status=='Cancelled').length:''} {tasks.filter(task=>task.status=='Cancelled').length == 0 ? 'No Tasks.' : tasks.filter(task=>task.status=='Cancelled').length==1 ? 'Task.' : 'Tasks.'}</span>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="AdminMain-content-section">
              <div className="AdminMain-content-section-grid">
                <div className="AdminMain-content-section-grid-content">

                  <h1 className="task-summary-h1">
                    Visualization of tasks overtime
                  </h1>
                  <div className="AdminMain-content-piechart">
                    <Pie
                    data={global_data}
                    options={options}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
}
