
import styles from "./forget.module.css"
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
const Forget = () => {
    const navigate = useNavigate();
    const [email,setEmail]=useState()
    const submitHandler = (event) => {
        event.preventDefault();
        //setds
        navigate("/reset")
    }
return (
    <div className={styles.page}>
        <form onSubmit={submitHandler} className={styles.form}>
            <h1>Forget Password</h1>
            <input onChange={(e)=>{setEmail(e.target.value)}} value={email} type='email' placeholder='Enter Email' required></input>
            <button type='submit'>Send</button>
        </form>
</div>
)
}

export default Forget