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
    const [taskStatus, setTaskStatus] = useState('');


    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');


    const [stepTitle, setStepTitle] = useState('');
    const [stepDescription, setStepDescription] = useState('');


    const [activeIndex, setActiveIndex] = useState(null);

    const toggleCollapsible = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    }

    const onTaskTitleChange = (event) => {
      setTaskTitle(event.target.value)
    }
    const onTaskDescriptionChange = (event) => {
      setTaskDescription(event.target.value)
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
          return res;
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

              console.log(res)
              const updatedTasks = tasks.map((task) =>(
                task.id == id ?  res  : task
              )
              );
              const updatedFilteredTasks = filteredtasks.map((task) =>(
                task.id == id ? res : task
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
          const updatedTasks = tasks.map((task) =>(
            task.id == id ?  res  : task
          ));
          const updatedFilteredTasks = filteredtasks.map((task) =>(
            task.id == id ? res : task
          ));
          // Update the tasks state
          setTasks(updatedTasks);
          setFilteredTasks(updatedFilteredTasks)
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

          setTaskStatus('All')

        };
        fetchTasks();

       
      }, []);

      const generatePDF = async (id) => {

        /* HERE WE SHOULD GET THE PROJECT COLOR AND PROJECT BACKGROUND COLOR*/

     const res = await handleGetTaskById(id)
      const task = res.task
        const doc = new jsPDF();
          
        let yPosition = 0;
        const maxWidth = 190; 

        // Add the logo

        var logoData = new Image();

        logoData.src = 'data:../../icons/logo-transparent:image/png;base64,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';


        const logoX = 175; // X position of the logo
        const logoY = 0; // Y position of the logo
        const logoWidth = 30; // Width of the logo
        const logoHeight = 30; // Height of the logo
        //Report Header:
        doc.setFillColor(27, 94, 5);
        doc.rect(0, yPosition, 300, 30, 'F');
        
        doc.setFillColor(255,255,255);
        doc.rect(logoX-4, logoY, 45, 30, 'F');

        doc.setFontSize(28);
        doc.setFont('helvetica' ,'bold')

        doc.setTextColor(255,255,255);

        doc.text(`<Project Name>`, 10, yPosition+18)
        
        doc.setTextColor(0,0,0);
        doc.setFontSize(14);


        doc.addImage(logoData, 'png', logoX, logoY, logoWidth, logoHeight);



        
        //Report Content...
        yPosition+=40;
        // console.log(task.task.id)
        doc.setFontSize(14);
        doc.setFont('helvetica' ,'bold')
        doc.text(`Task ID: ${task.id}`, 10, yPosition);yPosition+=10;
        doc.text(`Task Title: ${task.title}`, 10, yPosition);yPosition+=10;
        if(task.implementation_duration_hours != null){
          doc.setFont('helvetica' ,'bold')
          doc.text(`Estimated Time:`, 10, yPosition);
          doc.setFont('helvetica' ,'normal')
          doc.text(task.implementation_duration_hours+" Hours", 50, yPosition);
          yPosition+=10;
        }
        if(task.begin_time != null){
          doc.setFont('helvetica' ,'bold')
          doc.text(`Start Date:`, 10, yPosition);
          doc.setFont('helvetica' ,'normal')
          doc.text(dateTimeFormatter.format((Date.parse(task.begin_time))), 40, yPosition);
          yPosition+=10;
        }
        if(task.end_time != null){
          doc.setFont('helvetica' ,'bold')
          doc.text(`End Date:`, 10, yPosition);
          doc.setFont('helvetica' ,'normal')
          doc.text(dateTimeFormatter.format((Date.parse(task.end_time))), 40, yPosition);
          yPosition+=10;
        }
        doc.setFont('helvetica' ,'bold')
        doc.text(`Task status:`, 10, yPosition);
        doc.setFont('helvetica' ,'normal')

        if(task.status=="To Do"){
          doc.setTextColor(255,255,255);
          doc.setFillColor(27, 94, 5);}
        else if(task.status=="In Progress")
          doc.setFillColor(206, 172, 19);
        else if(task.status=="Cancelled"){
          doc.setTextColor(255,255,255);
          doc.setFillColor(194, 17, 17);}
        else if(task.status=="Done"){
          doc.setTextColor(255,255,255);
          doc.setFillColor(17,0,255);}

        const textWidth = doc.getStringUnitWidth(task.status) * doc.internal.getFontSize() / doc.internal.scaleFactor;

        doc.rect(40, yPosition - 5, textWidth+2, 7, 'F')
        doc.text(`${task.status}`, 41, yPosition);
        doc.setTextColor(0,0,0);
        doc.setFont('helvetica', 'normal')

        yPosition+=10;
        const lines_description = doc.splitTextToSize(task.body, maxWidth);

        // doc.text(`Description: ${task.body}`, 10, yPosition + 20);
        // console.log(task.)

        lines_description.forEach((line) => {
          doc.setFont('helvetica', 'normal')
          doc.text(line, 10, yPosition);
          yPosition += 10;
        });

        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold')
        doc.text(`Team Members:`, 10, yPosition)
        doc.setFontSize(10);
        yPosition+=10;
        doc.text(`${task.owner.first_name+" "+task.owner.last_name}`, 10, yPosition)

        doc.setFont('helvetica', 'normal')
        yPosition+=10;

        task.viewers.map((viewer, index)=>{
          if(viewer.is_staff == false){
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal')
            doc.text(`${viewer.first_name+" "+viewer.last_name}`, 10, yPosition);
            yPosition+=10;
          }
          
        });
        yPosition+=10;
        task.steps.map((step, index)=>{
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold')
          const stepWidth = doc.getStringUnitWidth(step.title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
          doc.text(`- ${step.title}`, 10, yPosition)
          if(step.status == "To Do")
            doc.setTextColor(27, 94, 5)
          else if(step.status=="Started")
            doc.setTextColor(206, 172, 19);
          else if(step.status=="Done")
            doc.setTextColor(17,0,255);

          doc.text(`(${step.status})`, 14 + stepWidth, yPosition)
          doc.setTextColor(0,0,0)
          const lines = doc.splitTextToSize(step.body, maxWidth);
          // doc.text(`step Description: ${lines}`, 10, yPosition + 40)
          lines.forEach((line) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal')
            yPosition+=10;
            doc.text(line, 12, yPosition);
          });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold')       

        yPosition += 10; // Adjusting the position for the next task
      })
        doc.save(task.id + ' - ' + new Date().toLocaleString("en-GB", { day: '2-digit', month: '2-digit', year: "numeric"}) +' - ' + task.title +'.pdf');
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
        console.log(content.style.maxHeight) 
      }
      
      
      }
      
      , [taskStatus]);


      //for deletion purposes:
      // function closeTaskContentByIndex(index){
      //   var coll = document.getElementsByClassName("collapsible");
      //   var content = coll[index].nextElementSibling;
      //   content.style.maxHeight = 0; 
      // }


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
                           
                          
                          <span  className=" task-title">
                            {task.title}
                            {user.is_staff == false && task.owner.id != user.user_id ? <img src={TaskStar} className="star" alt="star"/> : <></>}
                            <span className="task-hours">{task.implementation_duration_hours+"  Hours"}</span>
                          </span>
                          
                          {/* <span className="task-hours">
                            {task.implementation_duration_hours+"  Hours"}
                          </span> */}
                          <p>
                            <progress className="task-progress" animated variant="success" value={task.status == "Done" ? 1 : task.steps.length != 0 ? ((task.steps.filter((step) => step.status === "Finished").length / task.steps.length)).toFixed(2) : 0}/>
                          </p>
                          <div className={task.status === "To Do" ? "task-status todo" : task.status === "In Progress" ? "task-status inProgress": task.status === "Done" ? "task-status Done": "task-status Cancelled"}>{task.status}
                          </div>
                          <h4 className="task-owner">
                                {task.owner.first_name} {task.owner.last_name}
                          </h4>
                          <p>
                            {task.viewers.map((viewer, index) => (
                              viewer.is_staff === false && (
                                <span style={{marginRight: "2px"}} key={index}>
                                  {viewer.first_name} {viewer.last_name}
                                  {index == task.viewers.length - 1 ? "" : "-"}
                                </span>
                              )
                            ))}
                          </p>
                         
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