import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null) /* eftersom user är ett objekt (id, username, avatar), inte en text*/
    const token = localStorage.getItem('token');

  useEffect(() => {
      if(token){
        const decoded = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          username: decoded.username,
          avatar: decoded.avatar
        });
      }else{
        navigate("/login");
        }
  }, [navigate]);

      


  return (
    <>
    {user && (
    <div>
      <h2> Welcome {user.username}</h2>
      <img src={user.avatar} alt="avatar" width={50} height={50} />
    </div>
    )}
    </>
  )
}

export default Chat