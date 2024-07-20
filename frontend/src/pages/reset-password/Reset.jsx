import {useState}from 'react'
import styles from "./reset.module.css"

const Reset = () => {
    const [password, setPassword] = useState()
    const [confirmPassword, setconfirmPassword] = useState()
    const [error,setError]=useState()
    const submitHandler = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("password dosent match")
            return;
        }
        setError()
        //LTSPID
    }
return (
    <div className={styles.page}>
        <form onSubmit={submitHandler} className={styles.form}>
            <h1>Reset Password</h1>
            <input onChange={(e)=>{setPassword(e.target.value)}} vlaue={ password}type='password' placeholder='Password' required></input>
            <input onChange={(e)=>{setconfirmPassword(e.target.value)}} vlalue={confirmPassword}type='password' placeholder='Confirm Password' required></input>
            <button type='submit'>Save</button>
            <h4>{error}</h4>
        </form>
</div>)
}

export default Reset