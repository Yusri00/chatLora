import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://chatify-api.up.railway.app/auth/csrf")
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
        {
          headers: {
            'Content-type': 'application/json',
          } 
        }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate("/chat");
    } catch (error){
      setError(error.response?.data?.message  || 'Något gick fel');
    }
  };

  return (
    <div>
    <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
   
        <input
          type='text'
          placeholder='Användarnamn'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input 
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type='text'
          placeholder='Avatar URL'
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      
      <button type="submit">Registrera dig</button>
      </form>
    </div>
  );
}

export default Register