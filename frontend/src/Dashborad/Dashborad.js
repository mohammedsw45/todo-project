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
            <Link to="/dashboard/tasks">Tasks</Link>
          </div>

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
