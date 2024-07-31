import React, {useContext, useEffect, useState } from "react";
import { AuthContext } from '../../AuthContext/AuthContext';
import Popup from 'reactjs-popup';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog'
import './Home.css'
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { jsPDF } from 'jspdf';


import deleteIcon from '../../icons/delete.png'
import startIcon from '../../icons/play.png'
import editIcon from '../../icons/editing.png'
import addIcon from '../../icons/add.png'
import finishIcon from '../../icons/finish.png'
import startStepIcon from '../../icons/play_step.png'
import archive from '../../icons/archive.png'
// import processingStepIcon from '../../icons/hourglass.png'
import endedStepIcon from '../../icons/accept.png'
import TaskStar from '../../icons/star.png'
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
    const { startTaskStep } = useContext(AuthContext);
    const { getTaskById } = useContext(AuthContext);






    const [filteredtasks, setFilteredTasks] = useState([]);
     
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

     
    const handleStatusChange = (e, newStatus) =>{
      if (newStatus == "All") {
        setTaskStatus(newStatus);
        setFilteredTasks(tasks);
        // console.log(tasks)
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
    const handleGetTaskById = async (id) => {
        try {
          const res = await getTaskById(id);
          // Clear the input fields or update the UI as needed
          // Optionally, you can reload the page to see the updated tasks
          console.log("res" , res)
          return res.data;
          // window.location.reload();
        } catch (error) {
          console.error('Error getting task by id:', error.message);
          // Handle the error, e.g., display an error message to the user
        
      };
    };

    const DeleteTask = async() => {
        try {
          const res = await deleteTask(selectedTaskId);
          // Clear the input fields or update the UI as needed
          setTasks(tasks.filter((task) => task.id !== selectedTaskId));
          setFilteredTasks(filteredtasks.filter((task) => task.id !== selectedTaskId))
          setShowDialog(false);
          // Optionally, you can reload the page to see the updated tasks
          // window.location.reload();
          
        } catch (error) {
          console.error('Error deleting task:', error.message);
          // Handle the error, e.g., display an error message to the user
        }
      };
    
    const handleCancelDelete = () => {
      setShowDialog(false);
    };
    const handleChangeTaskStatus = (id,taskState) => {
        var res1 = "";

        if(taskState == "To Do"){
          res1 = "In Progress"
        }
        else if(taskState == "In Progress"){
          res1 = "Done"
        } 
        else {
          console.log("No change")
          return;
        }
        const _startTask = async () => {
            try {
              const res = await startTask(id,taskState); 
              // Clear the input fields or update the UI as needed
              // Optionally, you can reload the page to see the updated tasks
              // Update the local state with the new status
              const updatedTasks = tasks.map((task) =>(
                task.id == id ? { ...task, status: res1, } : task
              )
              );
              const updatedFilteredTasks = filteredtasks.map((task) =>(
                task.id == id ? { ...task, status: res1, } : task
              )
              );

              // Update the tasks state
              setTasks(updatedTasks);
              setFilteredTasks(updatedFilteredTasks)
              // setFilteredTasks(tasks)
            } catch (error) {
              console.error('Error changing task state:', error.message);
              // Handle the error, e.g., display an error message to the user
            }
          };
          _startTask();
    }
    const handleEditTask = (id) => {
      if(taskTitle == "" || taskDescription == "") {
        alert('Task title and description should not be empty!')
        return;
      }
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

              // console.log(res)

              const updatedTasks = [...tasks,res];
              setTasks(updatedTasks); 


              if(taskStatus == 'All' || taskStatus == 'To Do'){
              const updatedFilteredTasks = [...filteredtasks,res];
              setFilteredTasks(updatedFilteredTasks)
              }

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

      const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true

      });

      function handleAddStep(id) {
        if (stepTitle.length > 0 && stepDescription.length > 0) {

          const addStep = async () => {
            try {
              const res = await createStep(stepTitle, stepDescription, id);
              // console.log(res)
              // Clear the input fields or update the UI as needed
              setStepTitle('');
              setStepDescription('');
              // Optionally, you can reload the page to see the updated tasks

              // console.log("res:")
              // console.log(res)
              const updatedTasks = tasks.map((task) =>(
                task.id == id ? res.task : task
              )
              );
              const updatedFilteredTasks = filteredtasks.map((task) =>(
                task.id == id ?  res.task : task
              )
              );

              // Update the tasks state
              setTasks(updatedTasks);
              setFilteredTasks(updatedFilteredTasks)
              // console.log("filtered tasks: ");
              // console.log(filteredtasks)
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
          setFilteredTasks(allTasks);

        };
        fetchTasks();

       
      }, []);
      
      
      useEffect(() => {
        
        
      }, [filteredtasks]);
  

      const generatePDF = async (id) => {

     const task = await handleGetTaskById(id)
        console.log(task)
        const doc = new jsPDF();
    
        doc.text('Task List', 10, 10);
        
        let yPosition = 20;

          doc.text(`ID: ${task.id}`, 10, yPosition);
          doc.text(`Title: ${task.title}`, 10, yPosition + 10);
          doc.text(`Description: ${task.description}`, 10, yPosition + 20);
          doc.text(`step: ${task.steps}`, 10, yPosition + 30)
          yPosition += 40; // Adjusting the position for the next task

    
        doc.save('tasks.pdf');
      };
    

      // useEffect(() => {
      //   setFilteredTasks(tasks);
      //     }, [])

      // function handleClickClosure(i) {
      //   return function(event) {
      //     handleClick(i, event);
      //   };
      // }
      
      // function handleClick(i, event) {
      //   var coll = document.getElementsByClassName("collapsible");
      //   console.log(coll)
      //   console.log(i)
      //   coll[i].classList.toggle("active");
      //   var content = coll[i].nextElementSibling;
        
      //   console.log(content.style.maxHeight)
      
      //   if(content.style.maxHeight != null)
      //   if (parseFloat(content.style.maxHeight) > 0){
      //     content.style.maxHeight = 0;
      //   } else {
      //     content.style.maxHeight = content.scrollHeight + "px";
      //   } 
      // }
    function handleChangeStepStatus(task_id, task_step_id, taskStepState){
      var res1 = "";

        if(taskStepState == "To Do"){
          res1 = "Started"
        }
        else if(taskStepState == "Started"){
          res1 = "Finished"
        } 
        else {
          // console.log("No change")
          return;
        }
      const _startTaskStep = async () => {
        try {
          const res = await startTaskStep(task_id,task_step_id,taskStepState);
          // Clear the input fields or update the UI as needed
          // Optionally, you can reload the page to see the updated tasks
          // Clear the input fields or update the UI as needed
          // Optionally, you can reload the page to see the updated tasks
          // Update the local state with the new status
          const updatedTasks = tasks.map((task) =>(
            task.id == task_id ? res.task : task
          )
          );
          const updatedFilteredTasks = filteredtasks.map((task) =>(
            task.id == task_id ?  res.task : task
          )
          );

          // Update the tasks state
          setTasks(updatedTasks);
          setFilteredTasks(updatedFilteredTasks)
        } catch (error) {
          console.error('Error updating task step:', error.message);
          // Handle the error, e.g., display an error message to the user
        }
      };
      _startTaskStep();
    }
    // const ref = React.useRef();
    const handleButtonClick = (item) => {
        item.classList.toggle("active");
        var content = item.nextElementSibling;

        // if(content.style.height < 40)
        //   content.style.minHeight = 60+"px";
              
        if(content.style.maxHeight != null)
        if (parseFloat(content.style.maxHeight) > 0){
          content.style.maxHeight = 0;
        } else {
          content.style.maxHeight = "1000px";
        } 

        // return {
        //   console.log("Removed!")
        // }
      //}
    }

    useEffect(() => {
      var coll = document.getElementsByClassName("collapsible");

      for (var i = 0; i < coll.length; i++) {
        var content = coll[i].nextElementSibling;
        content.style.maxHeight = 0;  
      }
      
      
      }
      
      , [filteredtasks]);


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
            {tasks == null || tasks == [] || tasks == undefined ? <></> :
            <ToggleButtonGroup 
                    className="buttons"
                    value={taskStatus}
                    exclusive
                    onChange={handleStatusChange}
                  >
                    <ToggleButton value="All">
                        <span>All {tasks == null || tasks == [] ? (0) : '('+(tasks.length)+')'}</span>
                    </ToggleButton>
                    <ToggleButton value="To Do">
                        <span>To Do ({tasks == null || tasks == [] ? (0) : tasks.filter(task => task.status.includes('To Do')).length})</span>
                    </ToggleButton>
                    <ToggleButton value="In Progress">
                        <span>In Progress ({tasks == null || tasks == [] ? (0) : tasks.filter(task => task.status.includes('In Progress')).length})</span>
                    </ToggleButton>
                    <ToggleButton value="Done">
                        <span>Done ({tasks == null || tasks == [] ? (0) : tasks.filter(task => task.status.includes('Done')).length})</span>
                    </ToggleButton>
                </ToggleButtonGroup>
                }
                <div className="tasks">
                    {filteredtasks != null ? 
                    filteredtasks.map((task,index) => {
                        return (
                        <>
                        <button onClick={(event) => handleButtonClick(event.currentTarget)} className="collapsible">
                          <div className="button-contents">
                           
                          
                          <span  className=" task-title">{task.title}</span>
                          {task.owner.id != user.user_id ? <img src={TaskStar} className="star" alt="star"/> : <></>}
                          <span className="task-hours">
                            {task.implementation_duration_hours+"  Hours"}
                          </span>
                          <p>
                        
                            <progress animated variant="success" value={task.status == "Done" ? 1 : task.steps.length != 0 ? ((task.steps.filter((step) => step.status === "Finished").length / task.steps.length)).toFixed(2) : 0} style={{height: "5px"}}/>
                          </p>
                          <div className={task.status === "To Do" ? "task-status todo" : task.status === "In Progress" ? "task-status inProgress": task.status === "Done" ? "task-status Done": "task-status Cancelled"}>{task.status}
                          </div>
                          <h4 className="task-owner">
                                {task.owner.first_name} {task.owner.last_name}

                          </h4>
                         
                          {
                          task.begin_time == null ? <></> :
                           <h6 className="task-began-at">started at: {dateTimeFormatter.format((Date.parse(task.begin_time)))}</h6>
                          }
                          {
                          task.end_time == null ? <></> :
                           <h6 className="task-ended-at">ended at: {dateTimeFormatter.format((Date.parse(task.end_time)))}</h6>
                          }
                          </div>
                            
                          </button>

                        <div className="task task-content">
                          
                          <div className="padding-top-bottom-10">

                          
                          <div className="task-section1">
                            <div className="width70percent">
                              <h2>{task.body === null ? "**" : task.body}</h2>
                              <h2 className="task-title width70percent">{task.title === null ? "**" : <></>}</h2>
                              
                              

                              
                                {/* <ProgressBar now={60} />; */}
                               {/* <p>Progress: {task.steps.length != 0 ? ((task.steps.filter((step) => step.status === "Finished").length / task.steps.length) * 100).toFixed(2) : 0}%</p> */}
                              

                              {/* <span>{task.implementation_duration_hours === null ? "**" : task.implementation_duration_hours}</span> */}
                            </div>  
                            <ul className="unordered-list content width70percent">
                              {task.steps.map((step, index) => (
                                <li className="step-li" key={index}>
                                  <span className="step-title">
                                    {<><img onClick={() => handleChangeStepStatus(task.id,step.id,step.status)} className="step-icon" src={step.status=="To Do" ? startStepIcon : step.status=="Started" ? finishIcon : endedStepIcon}/><span>{step.title}</span></>}
                                  </span>
                                  <ul>
                                    <li className="step-description">{step.body}</li>
                                  </ul>
                                </li>
                              ))}
                            </ul>
                            {/* handleGetTaskById(task.id) */}
                          </div>
                          <div className="task-section2">
                          <img onClick={() =>generatePDF(task.id)} src={archive} className="icon"/>  

                          <img onClick={() => handleDeleteTask(task.id)} src={deleteIcon} className="icon"/>         
                              {task.status != "Done" ?
                              <Popup position="right center" trigger= {<img src={addIcon} className="icon"/>} modal nested> 
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
                              :<></>}

                              {task.status != "Done" ?
                              <Popup position="right center" 
                              trigger= {<img src={editIcon} className="icon"/>}
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
                              : <></>}
              
                              
                              {task.status === "To Do" ? 
                                 <img onClick={() => handleChangeTaskStatus(task.id,task.status)} src={startIcon} className="icon"/>:
                                 task.status === "In Progress" ? <img onClick={() => handleChangeTaskStatus(task.id,task.status)} src={finishIcon} className="icon"/>  : <></>       
                                                          }
                              {/* <img src={addIcon} className="add-icon"/>          */}
                          </div>
                          </div>
                            
                              
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