import React, { useContext } from "react";
import { AuthContext } from '../../AuthContext/AuthContext';
import { Navigate } from 'react-router-dom';

export default function NotFound(){
    const { user } =  useContext(AuthContext);

    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return(
        <>
         <h1>NotFound</h1>
        </>
       
        
    )
}