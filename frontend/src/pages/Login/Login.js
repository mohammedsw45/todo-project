import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../AuthContext/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (!result.success) {
      setError(result.message);
    } else {
      setError('');
      if (result.user && result.user.is_staff) {
        navigate('/dashboard/');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className='login'>
      <div className="login-contents">
        <h1>Login</h1>
        <form className='login-form' onSubmit={handleSubmit}>
          <div className='form-div'>
            <input
              name='username'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Email'
            />
          </div>
          <div className='form-div'>
            <input
              name='password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />
          </div>
          {error && <div className='error-login' style={{ color: 'red' }}>{error}</div>}
          <div className='form-div'>
            <input type="submit" className="login-btn" value="Sign In" />
          </div>
          <p className='register-login'>
            Don't have an account? <Link className='hyper-link' to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
