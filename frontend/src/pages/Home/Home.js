import React, {useContext, useEffect, useState } from "react";
import { AuthContext } from '../../AuthContext/AuthContext';
import Popup from 'reactjs-popup';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog'
import './Home.css'
import { ToggleButton, ToggleButtonGroup } from '@mui/material';


import deleteIcon from '../../icons/delete.png'
import startIcon from '../../icons/play.png'
import editIcon from '../../icons/editing.png'
import addIcon from '../../icons/add.png'
import finishIcon from '../../icons/finish.png'
// import myData from '../../data.json';
export default function Home(){
  const [tasks, setTasks] = useState([]);

    const { user } =  useContext(AuthContext);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState(1);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [taskStatus, setTaskStatus] = useState('All');


    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');


    const [stepTitle, setStepTitle] = useState('');
    const [stepDescription, setStepDescription] = useState('');


    const [activeIndex, setActiveIndex] = useState(null);

    const toggleCollapsible = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    }

    const onTaskTitleChange = (event) => {
      console.log(event.target.value)
      setTaskTitle(event.target.value)
    }
    const onTaskDescriptionChange = (event) => {
      console.log(event.target.value)
      setTaskTitle(event.target.value)
    }

    const onTitleChange = (event) => {
        setTitle(event.target.value);
      };
    const onDescriptionChange = (event) => {
    setDescription(event.target.value);
    };
    const onTimeChange = (event) => {
        setTime(event.target.value);
    };

    const onStepTitleChange = (event) => {
      setStepTitle(event.target.value);
    };
    
    const clearNewStepInputs = () => {
      setStepTitle('')
      setStepDescription('')
    }
    const onStepDescriptionChange = (event) => {
      setStepDescription(event.target.value);
    };

    const { createTask } = useContext(AuthContext);
    const { getAllTasks } = useContext(AuthContext);
    const { deleteTask } = useContext(AuthContext);
    const { startTask } = useContext(AuthContext);
    const { createStep } = useContext(AuthContext);
    const { editTask } = useContext(AuthContext);






    const [filteredtasks, setFilteredTasks] = useState([]);
    useEffect(() => {
        setFilteredTasks(tasks)
        }, [])
    
    
        // useEffect(() => {
        //   console.log("HHH")
        //   var coll = document.getElementsByClassName("collapsible");
        //   console.log(coll)

        //   var i;
          
        //   for (i = 0; i < coll.length; i++) {
        //     console.log(coll[i])

        //     coll[i].addEventListener("click", function() {
        //       this.classList.toggle("active");
        //       var content = this.nextElementSibling;
        //       content.classList.toggle("shown")
        //     });
        //   }

      //     return () => {
      //       var i;
          
      //     for (i = 0; i < coll.length; i++) {
      //       console.log(coll[i])

      //       coll[i].removeEventListener("click", function() {
      //       });

      //     }
      // }}, [])

      
      const changeActiveStatus = () =>{
        
      }

    const handleChange = (e) =>{
        const filter = tasks.filter(
        task => task.title.includes(e.target.value)
        )
        setFilteredTasks(filter);
    }

    const handleStatusChange = (e, newStatus) =>{
      if (newStatus === "All") {
        setTaskStatus(newStatus);
        setFilteredTasks(tasks);
      } else if (newStatus !== null) {
        setTaskStatus(newStatus);
        const filter = tasks.filter((task) => task.status.includes(newStatus));
        setFilteredTasks(filter);
      }
    }
    
    const handleDeleteTask = (id) =>{
      setSelectedTaskId(id);
      setShowDialog(true);
    }

    const DeleteTask = async() => {
        try {
          const res = await deleteTask(selectedTaskId);
          // Clear the input fields or update the UI as needed
          setTasks(filteredtasks.filter((task) => task.id !== selectedTaskId));
          setShowDialog(false);
          // Optionally, you can reload the page to see the updated tasks
          window.location.reload();
          
        } catch (error) {
          console.error('Error deleting task:', error.message);
          // Handle the error, e.g., display an error message to the user
        }
      };
    
    const handleCancelDelete = () => {
      setShowDialog(false);
    };
    const handleChangeTaskStatus = (id,taskState) => {
        const _startTask = async () => {
            try {
              const res = await startTask(id,taskState);
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
    const handleEditTask = (id) => {
      const _editTask = async() => {
        try{
          const res = await editTask(id,taskTitle, taskDescription);
          window.location.reload();
          } catch (error) {
            console.error('Error editing task:', error.message);
            // Handle the error, e.g., display an error message to the user
          }
        };
        _editTask();
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

      function handleAddStep(id) {
        console.log("hhh")
        if (stepTitle.length > 0 && stepDescription.length > 0) {
          console.log("ggg")

          const addStep = async () => {
            try {
              const res = await createStep(stepTitle, stepDescription, id);
              console.log(res)
              // Clear the input fields or update the UI as needed
              setStepTitle('');
              setStepDescription('');
              // Optionally, you can reload the page to see the updated tasks
              // window.location.reload();
            } catch (error) {
              console.error('Error creating task:', error.message);
              // Handle the error, e.g., display an error message to the user
            }
          };
          addStep();
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



    useEffect(() => {
      var coll = document.getElementsByClassName("collapsible");
      var i;

      for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
          this.classList.toggle("active");
          var content = this.nextElementSibling;
          if (content.style.maxHeight){
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          } 
        })}
      
      }, [tasks]);


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

                <ToggleButtonGroup 
                    className="buttons"
                    value={taskStatus}
                    exclusive
                    onChange={handleStatusChange}
                  >
                    <ToggleButton value="All">
                        <span>All ({tasks.length})</span>
                    </ToggleButton>
                    <ToggleButton value="To Do">
                        <span>To Do ({tasks.filter(task => task.status.includes('To Do')).length})</span>
                    </ToggleButton>
                    <ToggleButton value="In Progress">
                        <span>In Progress ({tasks.filter(task => task.status.includes('In Progress')).length})</span>
                    </ToggleButton>
                    <ToggleButton value="Done">
                        <span>Done ({tasks.filter(task => task.status.includes('Done')).length})</span>
                    </ToggleButton>
                    {/* <input type="search" id="gsearch1" name="gsearch" placeholder='Search...' onInput={handleChange} /> */}

                    {/* <input type="search" id="gsearch" name="gsearch" placeholder='Search...' onInput={handleChange} /> */}

                </ToggleButtonGroup>

                <div className="tasks">
                    {filteredtasks != null ? 
                    filteredtasks.map((task,index) => {
                        return (
                        <>
                        <button onClick={changeActiveStatus} className="collapsible">
                          <span className="task-title">{task.title}</span>
                          <span style={{display: "inline-block", width: "fit-content", fontSize: "12px", color: "#fff", border: "1px solid black", marginLeft: "1em",textWrap: "nowrap",padding: ".3em",borderRadius: "12px", backgroundColor: "#463B3B"}}>
                            {task.implementation_duration_hours+"  Hours"}
                          </span>
                          <div className={task.status === "To Do" ? "task-status todo" : task.status === "In Progress" ? "task-status inProgress": task.status === "Done" ? "task-status Done": "task-status Cancelled"}>{task.status}</div>

                          </button>

                        <div className="task task-content">
                            <h2 className="task-title width70percent">{task.title === null ? "**" : <></>}</h2>
                            <div className="width70percent">
                              <h2>{task.body === null ? "**" : task.body}</h2>
                              {/* <span>{task.implementation_duration_hours === null ? "**" : task.implementation_duration_hours}</span> */}
                            </div>
                            <ul className="unordered-list content width70percent">
                              {task.steps.map((step, index) => (
                                <li key={index}>
                                  <span className="step-title">
                                    {step.title}
                                  </span>
                                  <ul>
                                    <li className="step-description">{step.body}</li>
                                  </ul>
                                </li>
                              ))}
                            </ul>
                              <img onClick={() => handleDeleteTask(task.id)} src={deleteIcon} className="delete-icon"/>         
                              <Popup position="right center" trigger= {<img src={addIcon} className="add-icon"/>} modal nested> 
                                <div className="popup">
                                  <div className="popup-content">
                                    <h2>Step Name:</h2>
                                    <input 
                                        type="text" 
                                        name="stepTitle"
                                        value={stepTitle}
                                        onChange={onStepTitleChange}/>
                                  </div>
                                  <div className="popup-content">
                                    <h2>Step Description:</h2>
                                    <textarea 
                                        type="text" 
                                        name="stepDescription"
                                        value={stepDescription}
                                        cols="40"
                                        rows="5"
                                        onChange={onStepDescriptionChange}/>
                                  </div>
                                  <button onClick={()=>handleAddStep(task.id)}>Submit</button>
                                </div>
                              </Popup>

                              <Popup position="right center" 
                              trigger= {<img src={editIcon} className="edit-icon"/>}
                              onOpen={()=>{setTaskTitle(task.title);setTaskDescription(task.body)}}
                              modal
                              nested> 
                                <div className="popup">
                                  <div className="popup-content">
                                    <h2>Task Name:</h2>
                                    <input 
                                        type="text" 
                                        name="taskTitle"
                                        value={taskTitle}
                                        onChange={onTaskTitleChange}/>
                                  </div>
                                  <div className="popup-content">
                                    <h2>Task Description:</h2>
                                    <textarea 
                                        type="text" 
                                        name="taskDescription"
                                        value={taskDescription}
                                        cols="40"
                                        rows="5"
                                        onChange={onTaskDescriptionChange}/>
                                  </div>
                                  <button onClick={()=>handleEditTask(task.id)}>Submit</button>
                                </div>
                              </Popup>
              
                              
                              {task.status === "To Do" ? 
                                 <img onClick={() => handleChangeTaskStatus(task.id,task.status)} src={startIcon} className="start-icon"/>:
                                 task.status === "In Progress" ? <img onClick={() => handleChangeTaskStatus(task.id,task.status)} src={finishIcon} className="start-icon"/>  : <></>       
                                                          }
                              {/* <img src={addIcon} className="add-icon"/>          */}
                        </div>
                        </>  
                        
                    )})  : 
                    <h2>You have no tasks...</h2>

                    }
                </div>


            </div>
        </div> 
        <ConfirmationDialog
        message = "Are you sure you want to delete this task?"
        show={showDialog}
        onClose={handleCancelDelete}
        onConfirm={()=>DeleteTask(selectedTaskId)}
      />      
        </div>
        
    )
}