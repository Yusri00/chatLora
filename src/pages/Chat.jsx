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

    </>
  )
}

export default Chat