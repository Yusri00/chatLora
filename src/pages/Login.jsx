import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import chatImg from '../assets/chat.png';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hämtar CSRF-token när komponenten mountas
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
        'https://chatify-api.up.railway.app/auth/token',
        {username, password, csrfToken}, //Här skickas all data för att generera token
        {
          headers: {
            'Content-type': 'application/json',
          } 
        }
      );
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));  // sparar avatar, id etc.

      navigate('/chat');
    } catch (error){
      console.log(error.response?.data);
      setError(error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="chatlora-title">
        ChatLora 
        <img src={chatImg}alt="chatimage" id="chatImg"  />
      </h1>
      {error && <p className='error'>{error}</p>}
    
    <form onSubmit ={handleSubmit}>
      <div className="form-container">
        <h3 className="login-title">Login</h3>
        {error && <p className='error'>{error}</p>}
        <div className="form-input">
        <label>
          Username
        <input
          type="text"
          placeholder="username"
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
        
          <div className="auth-button-container">
          <button type="submit" className="auth-button">Login</button>
          <button type="button" onClick={() => navigate('/')} className="auth-button">Register
          </button>
          </div>
        </div>
        </div>
      </form>
    </div>
  );
}

export default Login