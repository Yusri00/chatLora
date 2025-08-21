import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import chatImg from '../assets/chat.png';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
          <label>
            Username
            <input
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label>
            Email
            <input 
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Avatar URL
            <input
              type='text'
              placeholder='Avatar URL'
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </label>
        
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
        </div>
      </form>
      </div>
    </div>
  );
}

export default Register