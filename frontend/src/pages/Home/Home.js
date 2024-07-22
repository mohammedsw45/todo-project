import React, {useContext, useEffect, useState } from "react";
import { AuthContext } from '../../AuthContext/AuthContext';
import './Home.css'
// import myData from '../../data.json';
export default function Home(){
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

    const { logout } = useContext(AuthContext);
    const { createTask } = useContext(AuthContext);
    const { getAllTasks } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);

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
            <h1 className="title">My Todos</h1>
            <div className="task-controller">
                <h2>Title</h2>
                <h2>Description</h2>
                <h2></h2>

                <input 
                    type="text" 
                    id="title"
                    name="title"
                    value={title}
                    onChange={onTitleChange}/>
                <input
                    type="text" 
                    id="description"
                    name="description"
                    value={description}
                    onChange={onDescriptionChange}/>
                <button onClick={handleAddTask}>+</button>

                <div>
                <h4>Time (Hours)</h4>
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
                        <span>Completed</span>
                    </div>
                </div>
                <div className="tasks">
                    {tasks != null ? 
                    tasks.map(task => {
                        return (
                        <div className="task">
                            <h2 className="task-title">{task.title === null ? "**" : task.title}</h2>
                            <span>{task.body === null ? "**" : task.body}</span>
                            <div className="task-status">{task.status === null ? "**" : task.status}</div>
                            
                        </div>
                    )})  : 
                    <h2>You have no tasks...</h2>

                    }
                </div>


            </div>
            <button onClick={logout}>logout</button>
        </div>       
        </div>
    )
}