import React, { useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext/AuthContext';
import { Link, useNavigate} from "react-router-dom";
import "./Register.css"
const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(firstName.length < 5 || lastName.length < 5 || email.length === 0 || password.length< 5){
      setError('One or more fields are not in a correct form!');
      return;
    }
    try{
    const result = await register(firstName, lastName, email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        setError('');
        navigate('/');
      }
    }catch (e){
      setError('Something went wrong, try again later..');

    }
    
  };

  return (
    <div className='register'>
        <div className="register-contents">
        <h1>Register</h1>
            <form className='register-form' onSubmit={handleSubmit}>
                <div className='form-div'>
                  {/* <label htmlFor='username'>Username:</label> */}
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder='First Name'
                    />
                </div>
                <div className='form-div'>
                    {/* <label htmlFor='password'>Username:</label> */}
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder='Last Name'
                      />
                </div>
                <div className='form-div'>
                    {/* <label htmlFor='password'>Username:</label> */}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Email'
                    />
                </div>
                <div className='form-div'>
                    {/* <label htmlFor='password'>Username:</label> */}
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder='Password'
                    />
                </div>
                {error && <div className='error-register' style={{ color: 'red' }}>{error}</div>}
                <div className='form-div'>
                <input type="submit" className="register-btn" value="Sign Up" />
                </div>
                <p className='register-login'>
                  You have an account? <Link className='hyper-link' to="/login">Login</Link>
                </p>
            </form>
        </div>
       
    </div>
    // <div className='register'>
    //   <form className='register-form' onSubmit={handleSubmit}>
    //     <div>
    //       <input
    //         type="text"
    //         value={firstName}
    //         onChange={(e) => setFirstName(e.target.value)}
    //         placeholder='First Name'
    //       />
    //     </div>
    //     <div>
    //       <input
    //         type="text"
    //         value={lastName}
    //         onChange={(e) => setLastName(e.target.value)}
    //         placeholder='Last Name'
    //       />
    //     </div>
    //     <div>
    //       <input
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         placeholder='Email'
    //       />
    //     </div>
    //     <div>
    //       <input
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         placeholder='Password'
    //       />
    //     </div>
    //     {error && <div style={{ color: 'red' }}>{error}</div>}
    //     <input type="submit" className="register-btn" value="Register" />
    //     <p>
    //       You have an account? <Link to="/login">Login</Link>
    //     </p>
    //   </form>
    // </div>
  );
};

export default Register;