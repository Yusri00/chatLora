import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import chatImg from '../assets/chat.png';
import eyeOpen from '../assets/eye-open.png';
import eyeClosed from '../assets/eye-closed.png';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.patch("https://chatify-api.up.railway.app/csrf")
    .then(res => setCsrfToken(res.data.csrfToken))
    .catch(error => console.log("CSRF error", error));
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        'https://chatify-api.up.railway.app/auth/register',
        {username, password, email, avatar, csrfToken },
        {headers: {'Content-type': 'application/json'}}
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("You are registered!")

      navigate("/login");
    } catch (error){
      setError(error.response?.data?.error  || 'Please fill in the missing fields');
    }
  };

  return (
    <div>
      <div className='page-wrapper'>
        <h1 className="chatlora-title">
        ChatLora 
        <img src={chatImg}alt="chatimage" id="chatImg"  />
      </h1>
    
    <form onSubmit ={handleSubmit}>
      <div className="form-container">
        <h3 className="signup-title">Sign Up</h3>
        {error && <p className='error'>{error}</p>}
        
        <div className="form-input">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

          <div className="form-input">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img src={showPassword ? eyeOpen: eyeClosed}
            className='eye-icon'
            onClick={() => setShowPassword(!showPassword)}
            alt='Toggle password visibility'
            />
          </div>

          <div className="form-input">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-input">
            <label htmlFor="avatar">Avatar URL</label>
            <input
              id="avatar"
              type="text"
              placeholder="Avatar URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
        
        <div className="auth-button-container">
          <button type="submit" className='auth-button'>
            Register
          </button>
          
          <p className="login-link">
            Already have an account?{""}
            <Link to="/login"> Log in </Link>
          </p>
            </div>  
          </div>
      </form>
      </div>
    </div>
  );
}

export default Register