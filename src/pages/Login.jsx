import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hämtar CSRF-token när komponenten mountas
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
        'https://chatify-api.up.railway.app/auth/login',
        {username, password, csrfToken}, //Här skickas all data
        {
          headers: {
            'Content-type': 'application/json',
          } 
          
        }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));  // sparar avatar, id etc

      navigate('/chat');
    } catch (error){
      setError(error.response?.data?.message || 'Något gick fel');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit ={handleSubmit}>

      <input
        type="text"
        id="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Logga in</button>
        <button type="button" onClick={() => navigate('/register')}>Registrera dig</button>
      </form>
    </div>
  );
}

export default Login