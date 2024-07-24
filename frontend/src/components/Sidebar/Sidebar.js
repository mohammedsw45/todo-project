import React, { useContext } from 'react';
import './Sidebar.css'

import OutsideClick from "../../OutsideClick.js";
import { useRef } from "react";

import CodeIcon from '../../icons/code.png'
import CodeIconDark from '../../icons/code-dark.png'

import LogoutIcon from '../../icons/logout.png'
import LogoutIconDark from '../../icons/logoutDark.png'

import Sun from '../../icons/sun.png';
import SunDark from '../../icons/sun-dark.png';

import Moon from '../../icons/moon.png';
import MoonDark from '../../icons/moon-dark.png';

import HomeIcon from '../../icons/home.png'
import HomeIconDark from '../../icons/home-dark.png'

import { getTranslation } from "../../i18n";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext.js';



function Sidebar(props) {


  const boxRef = React.useRef(null);
  const boxOutsideClick = OutsideClick(boxRef);

  const [sidebarItem_home,setSidebarHome] = React.useState("sidebar-item");
  const [sidebarItem_tasks,setSidebarTasks] = React.useState("sidebar-item");
  const [sidebarItem_contactUs,setSidebarContactUs] = React.useState("sidebar-item");
  const [sidebarItem_aboutUs,setSidebarAboutUs] = React.useState("sidebar-item");
  const [sidebarItem_joinUs,setSidebarJoinUs] = React.useState("sidebar-item");
  const [sidebarItem_ourServices,setSidebarOurServices] = React.useState("sidebar-item");
  const [sidebarItem_blog,setSidebarBlog] = React.useState("sidebar-item");
  const [sidebarItem_darkLightMode,setSidebarDarkLightMode] = React.useState("sidebar-item");
  const [sidebarItem_language,setSidebarLanguage] = React.useState("sidebar-item");

  const [isHovering_home,setIsHoveringHome] = React.useState(false);
  const [isHovering_tasks,setIsHoveringTasks] = React.useState(false);
  // const [isHovering_contactUs,setIsHoveringContactUs] = React.useState(false);
  // const [isHovering_aboutUs,setIsHoveringAboutUs] = React.useState(false);
  // const [isHovering_JoinUs,setIsHoveringJoinUs] = React.useState(false);
  // const [isHovering_ourServices,setIsHoveringOurServices] = React.useState(false);
  // const [isHovering_blog,setIsHoveringBlog] = React.useState(false);
  const [isHovering_darkLightMode,setIsHoveringDarkLightMode] = React.useState(false);
  // const [isHovering_language,setIsHoveringLanguage] = React.useState(false);
  const [darkModeChanged,setDarkModeChanged] = React.useState(0);

  // const [isClicked_language,setIsClickedLanguage] = React.useState(false);
  const { user } =  useContext(AuthContext);
  const { logout } = useContext(AuthContext);


  // function handleLanguageClick(){
  //   setIsClickedLanguage(prevState => !prevState)
  // }
  function handleClickDarkModeButton(){
    setDarkModeChanged((prev_val)=> {return prev_val+1});
    props.toggleDarkMode();
  }
  function changeSidebarItemLayoutEnter(i){
    if(i===1){
      setIsHoveringHome(()=> {return true});
      setSidebarHome(()=>{
        return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
      })

    }else if(i===2){
      setIsHoveringTasks(()=> {return true});
      setSidebarTasks(()=>{
        return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
      })
    }
    // else if(i===3){
    //   setIsHoveringOurServices(()=> {return true});
    //   setSidebarOurServices(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
    //   })
    // }
    // else if(i===4){
    //   setIsHoveringContactUs(()=> {return true});
    //   setSidebarContactUs(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
    //   })
    // }
    // else if(i===5){
    //   setIsHoveringJoinUs(()=> {return true});
    //   setSidebarJoinUs(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
    //   })
    // }else if(i===6){
    //   setIsHoveringBlog(()=> {return true});
    //   setSidebarBlog(()=>{
    //       return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
    //     })
    // }
    else if(i===7){
      setIsHoveringDarkLightMode(()=> {return true});
      setSidebarDarkLightMode(()=>{
          return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
        })
      }
    //   else if(i===8){
    //     setIsHoveringAboutUs(()=> {return true});
    //     setSidebarAboutUs(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
    //   })
    // }else if(i===9){
    //     setIsHoveringLanguage(()=> {return true});
    //     setSidebarLanguage(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-light` : `sidebar-item sidebar-item-dark`;
    //   })
    // }
  }

  function changeSidebarItemLayoutLeave(i){
    if(i===1){
      setIsHoveringHome(()=> {return false});
      setSidebarHome(()=>{
        return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
      })

    }else if(i===2){
      setIsHoveringTasks(()=> {return false});
      setSidebarTasks(()=>{
        return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
      })
    }
    // else if(i===3){
    //   setIsHoveringOurServices(()=> {return false});
    //   setSidebarOurServices(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
    //   })
    // }else if(i===4){
    //   setIsHoveringContactUs(()=> {return false});
    //   setSidebarContactUs(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
    //   })
    // }else if(i===5){
    //   setIsHoveringJoinUs(()=> {return false});
    //   setSidebarJoinUs(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
    //   })
    // }else if(i===6){
    //   setIsHoveringBlog(()=> {return false});
    //   setSidebarBlog(()=>{
    //       return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
    //     })
    // }
    else if(i===7){
      setIsHoveringDarkLightMode(()=> {return false});
      setDarkModeChanged(()=> {return 0});
      setSidebarDarkLightMode(()=>{
          return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
        })
      }
    //   else if(i===8){
    //     setIsHoveringAboutUs(()=> {return false});
    //     setSidebarAboutUs(()=>{
    //         return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
    //       })
    //     }else if(i===9){
    //     setIsHoveringLanguage(()=> {return false});
    //     setSidebarLanguage(()=>{
    //     return props.darkMode ? `sidebar-item sidebar-item-dark` : `sidebar-item sidebar-item-light`;
    //   })
    // }
  }


  React.useEffect(()=>{
    if( (boxOutsideClick && props.toggleClick) )
      if(props.isSidebarOpen){
         props.toggleSidebar();
        return;

      }
    },[boxOutsideClick , props.toggleClick]);


  return (
    <div ref={boxRef} className={`sidebar ${props.isSidebarOpen ? 'open' : ''} ${props.darkMode ? "dark-sidebar" : " "}`}>
      <div className={props.darkMode ? "sidebar-content dark-sidebar-content" : "sidebar-content"}>
        <ul className={props.language==='ar' ? "sidebar-items bidi-text" : "sidebar-items"}>
        <Link to='/' className={props.darkMode? 'white sidebar-link  show-800': 'black sidebar-link show-800'} onClick={()=>props.toggleSidebar()}>
            <li className={sidebarItem_home} onMouseEnter={() => changeSidebarItemLayoutEnter(1)} onMouseLeave={() => changeSidebarItemLayoutLeave(1)}>
              {isHovering_home^props.darkMode ? (<img loading="lazy" className='sidebar-icon' src={HomeIconDark} alt=''/>):( <img loading="lazy" className='sidebar-icon' alt='' src={HomeIcon}/>)}
              <span className='sidebar-icon-text'>{getTranslation(props.language).sidebar.home}</span>
            </li>
          </Link>
          {/* TO SHOW THE ACADEMY BUTTON PLEASE UNCOMMENT THE TEXT BELOW */}
          {/* <a href='/academy' className={props.darkMode? 'display-none white sidebar-link show-800': 'display-none black sidebar-link show-800'}> */}
          <Link to='/tasks' className={props.darkMode? 'white sidebar-link show-800': 'black sidebar-link show-800'} onClick={()=>props.toggleSidebar()}>
            <li className={sidebarItem_tasks} onMouseEnter={() => changeSidebarItemLayoutEnter(2)} onMouseLeave={() => changeSidebarItemLayoutLeave(2)}>
              {isHovering_tasks^props.darkMode ? (<img loading="lazy" className='sidebar-icon' src={CodeIconDark} alt=''/>):( <img loading="lazy" className='sidebar-icon' alt='' src={CodeIcon}/>)}
              <span className='sidebar-icon-text'>{getTranslation(props.language).sidebar.tasks}</span>
            </li>
          </Link>
          <li className={sidebarItem_darkLightMode} onMouseEnter={() => changeSidebarItemLayoutEnter(7)} onMouseLeave={() => changeSidebarItemLayoutLeave(7)} onClick={handleClickDarkModeButton} id='sidebar-darkmode-toggle'>
            {props.language === 'ar'?
            (
              <React.Fragment>
              <span className='light-dark-span'>{getTranslation(props.language).sidebar.dark}</span>
              {
                darkModeChanged%2 ===1 ? (
                  props.darkMode ? (
                    <img loading="lazy" className="sidebar-icon" src={MoonDark} alt="" />
                  ) : (
                    <img loading="lazy" className="sidebar-icon" alt="" src={Moon} />
                  )
                ) : (
                  isHovering_darkLightMode ^ props.darkMode ? (
                    <img loading="lazy" className="sidebar-icon" src={MoonDark} alt="" />
                  ) : (
                    <img loading="lazy" className="sidebar-icon" alt="" src={Moon} />
                  )
                )
              }
            </React.Fragment>
            )
            :(
                <React.Fragment>
                <span className='light-dark-span'>{getTranslation(props.language).sidebar.light}</span>
                {
                darkModeChanged%2 ===1 ? (
                  props.darkMode ? (
                    <img loading="lazy" className="sidebar-icon" src={SunDark} alt="" />
                  ) : (
                    <img loading="lazy" className="sidebar-icon" alt="" src={Sun} />
                  )
                ) : (
                  isHovering_darkLightMode ^ props.darkMode ? (
                    <img loading="lazy" className="sidebar-icon" src={SunDark} alt="" />
                  ) : (
                    <img loading="lazy" className="sidebar-icon" alt="" src={Sun} />
                  )
                )
              }
              </React.Fragment>
              )
            }
             <div className="dark-light-button" >
                <input type="checkbox" id="darkmode-toggle" checked={props.darkMode}/>
                <label id="darkmode-toggle-label" htmlFor="darkmode-toggle" onClick={handleClickDarkModeButton}/>
            </div>

            {props.language === 'ar'?
            (
              <React.Fragment>
              <span className='light-dark-span'>{getTranslation(props.language).sidebar.light}</span>
              {
                darkModeChanged%2 ===1 ? (
                  props.darkMode ? (
                    <img loading="lazy" className="sidebar-icon" src={SunDark} alt="" />
                  ) : (
                    <img loading="lazy" className="sidebar-icon" alt="" src={Sun} />
                  )
                ) : (
                  isHovering_darkLightMode ^ props.darkMode ? (
                    <img loading="lazy" className="sidebar-icon" src={SunDark} alt="" />
                  ) : (
                    <img loading="lazy" className="sidebar-icon" alt="" src={Sun} />
                  )
                )
              }
            </React.Fragment>
            )
            :(
                <React.Fragment>
                <span className='light-dark-span'>{getTranslation(props.language).sidebar.dark}</span>
                {
                darkModeChanged%2 ===1 ? (
                  props.darkMode ? (
                    <img loading="lazy" className="sidebar-icon" src={MoonDark} alt="" />
                  ) : (
                    <img loading="lazy" className="sidebar-icon" alt="" src={Moon} />
                  )
                ) : (
                  isHovering_darkLightMode ^ props.darkMode ? (
                    <img loading="lazy" className="sidebar-icon" src={MoonDark} alt="" />
                  ) : (
                    <img loading="lazy" className="sidebar-icon" alt="" src={Moon} />
                  )
                )
              }
              </React.Fragment>
              )
            }
          </li>
          {user ? 
          <Link to='/' className={props.darkMode? 'white sidebar-link': 'black sidebar-link'} onClick={()=>{props.toggleSidebar(); logout()}}>
            <li className={sidebarItem_home} onMouseEnter={() => changeSidebarItemLayoutEnter(1)} onMouseLeave={() => changeSidebarItemLayoutLeave(1)}>
              {isHovering_home^props.darkMode ? (<img loading="lazy" className='sidebar-icon' src={LogoutIconDark} alt=''/>):( <img loading="lazy" className='sidebar-icon' alt='' src={LogoutIcon}/>)}
              <span className='sidebar-icon-text'>Logout</span>
            </li>
          </Link>
          : <></> 
          }
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;