import React, {useContext, useEffect, useState } from "react";
import { AuthContext } from '../../AuthContext/AuthContext';
import './Home.css'

import deleteIcon from '../../icons/delete.png'
import startIcon from '../../icons/play.png'
import editIcon from '../../icons/editing.png'
import addIcon from '../../icons/add.png'
// import myData from '../../data.json';
export default function Home(){
    const { user } =  useContext(AuthContext);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState(1);

    const onTitleChange = (event) => {
        setTitle(event.target.value);
      };
    const onDescriptionChange = (event) => {
    setDescription(event.target.value);
    };
    const onTimeChange = (event) => {
        setTime(event.target.value);
    };

    const { createTask } = useContext(AuthContext);
    const { getAllTasks } = useContext(AuthContext);
    const { deleteTask } = useContext(AuthContext);
    const { startTask } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);

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
    
    const handleDeleteTask = (id) =>{
        const _deleteTask = async () => {
            try {
              const res = await deleteTask(id);
              // Clear the input fields or update the UI as needed

              // Optionally, you can reload the page to see the updated tasks
              window.location.reload();
            } catch (error) {
              console.error('Error deleting task:', error.message);
              // Handle the error, e.g., display an error message to the user
            }
          };
          _deleteTask();
    }
    const handleStartTask = (id) => {
        const _startTask = async () => {
            try {
              const res = await startTask(id);
              // Clear the input fields or update the UI as needed

              // Optionally, you can reload the page to see the updated tasks
              window.location.reload();
            } catch (error) {
              console.error('Error deleting task:', error.message);
              // Handle the error, e.g., display an error message to the user
            }
          };
          _startTask();
    }
    function handleAddTask() {
        if (title.length > 0 && description.length > 0 && time > 0) {
          const addTask = async () => {
            try {
              const res = await createTask(title, description, time);
              // Clear the input fields or update the UI as needed
              setTitle('');
              setDescription('');
              setTime(1);

              // Optionally, you can reload the page to see the updated tasks
              // window.location.reload();
            } catch (error) {
              console.error('Error creating task:', error.message);
              // Handle the error, e.g., display an error message to the user
            }
          };
          addTask();
        }
      }
    useEffect(() => {
        const fetchTasks = async () => {
          const allTasks = await getAllTasks();
          console.log('allTasks', allTasks === null)
          setTasks(allTasks);
        };
        fetchTasks();
      }, []);

    return(
        <div className="container--home">
            <div className="home-container">
            {/* <h1 className="title">My Todos {user.username}</h1> */}
            <div className="task-controller">
                
                <div>
                    <h2>Title</h2>
                    <input 
                        type="text" 
                        id="title"
                        name="title"
                        value={title}
                        onChange={onTitleChange}/>
                </div>
                <div>
                    <h2>Description</h2>  
                    <input
                        type="text" 
                        id="description"
                        name="description"
                        value={description}
                        onChange={onDescriptionChange}/>
                </div>
                <div>
                <h2></h2>
                <button style={{cursor: "pointer"}} onClick={handleAddTask}>+</button>


                </div>
              

                <div>
                <h4 id='time'>Time (Hours)</h4>
                <input
                    type="number" 
                    id="time"
                    name="time"
                    min={1}
                    max = {200}
                    value={time}
                    onChange={onTimeChange}/>

                </div>

            </div>
            <div>

                <div className="buttons">
                    <div style={{backgroundColor: "#46663B"}} className="button">
                        <span>To Do</span>
                    </div>
                    <div className="button">
                        <span>In Progress</span>
                    </div>
                    <div className="button">
                        <span>Done</span>
                    </div>
                    {/* <input type="search" id="gsearch1" name="gsearch" placeholder='Search...' onInput={handleChange} /> */}

                    {/* <input type="search" id="gsearch" name="gsearch" placeholder='Search...' onInput={handleChange} /> */}

                </div>

                <div className="tasks">
                    {filteredtasks != null ? 
                    filteredtasks.map(task => {
                        console.log(task.steps)
                        return (
                        <div className="task">
                            <h2 className="task-title width70percent">{task.title === null ? "**" : <><span>{task.title}</span><span style={{fontSize: "12px", color: "#fff", border: "1px solid black", marginLeft: "1em",textWrap: "nowrap",padding: ".3em",borderRadius: "12px", backgroundColor: "#463B3B"}}>{task.implementation_duration_hours+"  Hours"}</span></>}</h2>
                            <div className="width70percent">
                              <span>{task.body === null ? "**" : task.body}</span>
                              {/* <span>{task.implementation_duration_hours === null ? "**" : task.implementation_duration_hours}</span> */}
                            </div>
                            <div className={task.status === "To Do" ? "task-status todo" : task.status === "In Progress" ? "task-status inProgress": task.status === "Done" ? "task-status Done": "task-status Cancelled"}>{task.status}</div>
                            <ul className="unordered-list width70percent">
                            {task.steps.map(step => {
                                return (<li>{step.title}</li>)
                            })}
                            </ul>
                                <img onClick={() => handleDeleteTask(task.id)} src={deleteIcon} className="delete-icon"/>         
                                <img onClick={() => handleDeleteTask(task.id)} src={editIcon} className="edit-icon"/>         
                                <img onClick={() => handleStartTask(task.id)} src={startIcon} className="start-icon"/>         
                                <img onClick={() => handleDeleteTask(task.id)} src={addIcon} className="add-icon"/>         
                        </div>
                    )})  : 
                    <h2>You have no tasks...</h2>

                    }
                </div>


            </div>
        </div>       
        </div>
    )
}