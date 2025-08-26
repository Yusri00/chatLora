import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chatImg from '../assets/chat.png';

const Chat = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null) /* eftersom user är ett objekt (id, username, avatar), inte en text*/
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState("");
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

    function logOut() {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }


  return (
    <>
    {/* Welcome page */}
    <div className="page-wrapper">
      <h1 className="chatlora-title">
        ChatLora 
        <img src={chatImg} alt="chatimage" id="chatImg"  />
      </h1>
    <h1 className="chatlora-title"></h1>
    {user && (
    <div>
      <h2> Welcome {user.username}</h2>
      <img src={user.avatar} alt="avatar" width={50} height={50} />
    </div>
    )}
    
    {/* Sidenav */}
    <div className="sidenav">
      <div className="user-profile">
        <div className="avatar-circle">
          <img src={user.avatar} alt="avatar" />   
        </div> 
        <h3 className="profile-name">{user.username}</h3>
        <button className='logout-btn' onClick={logOut}>
          Logga ut
        </button>
        </div>
      </div>
    </div>

    {/* Chat area */}
    </>
  )
}

export default Chat