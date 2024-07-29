import React, { useContext } from 'react';
import './Main.css';
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import NotFound from '../../pages/NotFound/NotFound';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import { AuthContext } from '../../AuthContext/AuthContext';
import Dashborad from "../../Dashborad/Dashborad";
import Tasks from '../../Dashborad/Components/Tasks/Tasks';
import Users from '../../Dashborad/Components/Users/Users';
import NewTask from '../../Dashborad/Components/NewTask/NewTask';
import NewUser from '../../Dashborad/Components/NewUser/NewUser';
import Forget from '../../pages/forget-password/Forget';
import Reset from './../../pages/reset-password/Reset'; 
import TaskDetails from '../../Dashborad/Components/Detailstasks/TaskDetails';
import EditProfile from '../../Dashborad/Components/EditProfile/EditProfile';

function Main(props) {
  const { user } = useContext(AuthContext);
  return (
    <div className="main-container">
      {user ? (
        <Routes>
          {user.is_staff ? (
            <>
            <Route path="/dashboard/" element={<Dashborad />}>
              <Route index element={<Tasks />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="users" element={<Users />} />
              <Route path="create-new-task" element={<NewTask />} />
              <Route path="create-new-user" element={<NewUser />} />
              <Route path="task/details/:id" element={<TaskDetails />} />
              <Route path="edit-profile/:id" element={<EditProfile />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
            </>
          )}
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
}

export default Main;