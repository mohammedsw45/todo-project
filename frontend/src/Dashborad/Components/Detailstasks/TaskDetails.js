import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './TaskDetails.css';
import { destination } from '../../../AuthContext/General.js';


export default function TaskDetails(){
    const { id } = useParams(); 
    const [viewers,setViewers] = React.useState([]);
    // const navigate = useNavigate();
    console.log("HHH")
    
    const getTaskById = async () => {
        try {
          const accessToken = JSON.parse(localStorage.getItem('authTokens')).access;
          const response = await axios.get(`${destination}/todo/tasks/${id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}` // Assuming you store the token in localStorage
            }
          });

          return response.data.task.viewers;
        }catch (error){
          console.error(error.message)
        }
      }

    useEffect(() => {
    const fetchViewers = async () => {
        const _viewers = await getTaskById();
        console.log(_viewers)

        setViewers(_viewers || []);
        
    };

    fetchViewers();
    }, []);

    return (
            <>
            <div className="Header">

                <h1>Viewers</h1>

            </div>    
            <div class="taskviewers-content">
              <ul className="taskDetail-content">
                      {
                      viewers.map(viewer => 
                          <li className='taskDetail-content-li'>{viewer.id} {viewer.first_name} {viewer.last_name}</li>
                      )
                  }
                </ul>
                
            </div>
             
            </>
            );
    }
