import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from 'dompurify';
import chatImg from '../assets/chat.png';
import SideNav from "./SideNav";
import sideNavIcon from '../assets/sidenav.png';
import '../styles/chat.css';

const Chat = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null) /* eftersom user är ett objekt (id, username, avatar), inte en text*/
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

  useEffect(() => {
    if(!user) return; //väntar tills användaren är inloggad

    async function fetchMessages (){
      try {
        const res = await axios.get('https://chatify-api.up.railway.app/messages',{
          headers: { Authorization: `Bearer ${token}`}
      });
      setMessages(res.data);
    } catch (error){
      console.error("Kunde inte hämta meddelanden", error);
      if(error.response?.status === 403){
        logOut();
      }
    }
  }
    fetchMessages();
  }, [user, token]);
    
  
    function logOut() {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }

    function toggleSideNav() {
      setSideNavOpen(!sideNavOpen);
    }
    
    //Postar till APIet.
    async function handleSendBtn() {
      if(!newMessages.trim()) return;

      try {
        const res = await axios.post(
          'https://chatify-api.up.railway.app/messages',
          {
            text: DOMPurify.sanitize(newMessages),
            username: user?.username,
            avatar: user?.avatar
        },
          { headers: { Authorization: `Bearer ${token}`}}
      );
      
      //Uppdaterar state med nya meddelandet från API
      setMessages(prev=> [...prev, res.data]);
      setNewMessages('');
      } catch (error) {
        console.error('Kunde inte skicka meddelandet', error);
      }
  }

    async function handleDeleteMsg(id) {
      try {
        await axios.delete(`https://chatify-api.up.railway.app/messages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
    });

    // Tar bort meddelandet från state efter lyckad delete
        setMessages(prev => prev.filter(msg => msg.id !== id));
      } catch (error){
        console.error('Kunde inte ta bort meddelandet', error);
        }
      }

    // Inputfältets innehåll
    const [newMessages, setNewMessages] = useState("");

    // State för riktiga meddelanden 
    const [messages, setMessages] = useState([]);

    const [fakeMessages, setFakeMessages] = useState([

      {
        id: 1,
        text: 'Hej Sofia, så roligt att få prata med dig!',
        username: 'Marcus',
        avatar: "https://i.pravatar.cc/100?img=14",
        userId: 1
      },

      {
        id: 2,
        text: 'Hallåååå, svaraaaa. Var inte så trög :(',
        username: 'Marcus',
        avatar: "https://i.pravatar.cc/100?img=14",
        userId: 1
      },

      {
        id: 3,
        text: 'Omg, ta det lugnt. Vad ska du göra idag?',
        username: user?.username,
        avatar: user?.avatar,
        userId: user?.userId
      }

    ]);

        
  return (
    <div className="page-wrapper-chat">
      {/* HEADER */}
      <div className="chat-title-container">
      <header className="chat-header">
         {/* Hamburger Menu - alltid synlig */}
        <img 
          src={sideNavIcon} 
          id='sidenav-icon' 
          alt="sidenavicon"
          onClick={toggleSideNav}
        />
        <h1 className="chatlora-title-chat">
          ChatLora 
        <img src={chatImg} alt="chatimage" id="chatImg"  />
        </h1>
      </header>
      </div>

      {/* MAIN CHAT */}
       {/* SideNav visas när isOpen=true */}
        {user && (
          <SideNav 
          user={user} 
          onLogout={logOut} 
          isOpen = {sideNavOpen}
          onClose ={() => setSideNavOpen(false)}
          />
        )}

      <main className="chat-main-wrapper">
      <div className="conversations">
        {/* Messages */}
        {[...messages, ...fakeMessages].map(msg => (
          <div 
            key={msg.id}
            className={`message ${msg.userId === user?.userId ? 'my-message' : 'fake-message'}`}
          >
            <img 
              src={msg.avatar} 
              alt={msg.username} 
              className="avatar-img-chat" 
            />
            <p><strong>{msg.username}: </strong>{msg.text}</p>
             {/* Delete-knapp */}
            {msg.userId === user?.userId && ( // visar delete-knapp endast för egna meddelanden
              <button 
                className="delete-btn"
                onClick={() => handleDeleteMsg(msg.id)}
                >Delete</button>
            )}
          </div>
            ))}
        </div>
      </main>
    {/* {user && (
      <div className="welcome-message">
        <h2> Welcome {user.username}</h2>
      </div>
      )}
    */}

    {/* Skriv-rutan ligger direkt i page-wrapper-chat */}
    <div className="write-message-box">
      <input 
        type="text" 
        id="message-input" 
        placeholder="Write a message.." 
        value={newMessages}
        onChange={(e) => setNewMessages(e.target.value)}
      />
      <button className="send-btn" onClick={handleSendBtn}>Send</button>
    </div>
  </div>
  );
}

export default Chat