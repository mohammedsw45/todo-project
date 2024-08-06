import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashborad.css';

const Dashborad = (props) => {
  return (
    <div className='Dashboard'>
      <div className='SideBar'>
        <div className='title'>
          <h1>Admin Dashboard</h1>
        </div>
        <div className='links'>
        <div className='TasksLink'>
          <Link to="/dashboard/main">Main</Link>
        </div>
        <div className='TasksLink'>
          <Link to="/dashboard/projects">Projects</Link>
        </div>
        <div className='TasksLink'>
          <Link to="/dashboard/tasks">Tasks</Link>
        </div>
        <div className='In Progress'>
          <Link to="/dashboard/progress">In Progress</Link>
        </div>
          {/* <div className='TasksLink'>
            <Link to="/dashboard/tasks" style={{color: "white", backgroundColor: "#0569ff"}}>Ongoing Tasks</Link>
          </div>
          <div className='TasksLink'>
            <Link to="/dashboard/tasks" style={{color: "white", backgroundColor: "#056955"}}>Finished Tasks</Link>
          </div>
          <div className='TasksLink'>
            <Link to="/dashboard/tasks" style={{color: "white", backgroundColor: "#0690ff"}}>Cancelled Tasks</Link>
          </div> */}

          <div className='UsersLink'>
            <Link to="/dashboard/users">Users</Link>
          </div>
        </div>
      </div>

      <div className='Container'>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashborad;
