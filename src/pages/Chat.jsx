import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chatImg from '../assets/chat.png';
import SideNav from "./SideNav";
import sideNavIcon from '../assets/sidenav.png';

const Chat = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null) /* eftersom user är ett objekt (id, username, avatar), inte en text*/
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState("");
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const token = localStorage.getItem('token');


  useEffect(() => {
      if(token){
        try {
        const decoded = jwtDecode(token);

        setUser({
          userId: decoded.id,
          username: decoded.user,
          avatar: decoded.avatar
        });
      } catch (error) {
        console.error('Token error:', error);
        navigate('/login');
      }
    }else{
        navigate("/login");
    }
  }, [navigate, token]);

    function logOut() {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }

    function toggleSideNav() {
            setSideNavOpen(!sideNavOpen);
    }

  return (
    <div className="page-wrapper-chat">
      <div className="chat-container">
      <header className="chat-header">
         {/* Hamburger Menu - alltid synlig */}
        <img 
          src={sideNavIcon} 
          id='sidenav-icon' 
          alt="sidenavicon"
          onClick={toggleSideNav}
        />
        <h1 className="chatlora-title">
          ChatLora 
        <img src={chatImg} alt="chatimage" id="chatImg"  />
        </h1>
      </header>
      
      <main className="chat-main-wrapper">
        {/* SideNav visas när isOpen=true */}
        {user && (
          <SideNav 
          user={user} 
          onLogout={logOut} 
          isOpen = {sideNavOpen}
          onClose ={() => setSideNavOpen(false)}
          />
        )}
    
    <div className="chat-main">
      <div className="conversations">
        {/* Messages */}

    </div>
    <div className="write-message-box">
      <input 
        type="text" 
        id="message-input" 
        placeholder="Skriv ett meddelande" 
      />
      <button className="send-btn">Send</button>
    </div>
    {user && (
    <div className="welcome-message">
      <h2> Welcome {user.username}</h2>
    </div>
    )}
      </div>
    </main>
    </div>
  </div>
  );
}

export default Chat