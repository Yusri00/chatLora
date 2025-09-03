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
    const token = localStorage.getItem('token');

    const [user, setUser] = useState(null) /* eftersom user är ett objekt (id, username, avatar), inte en text*/
    const [sideNavOpen, setSideNavOpen] = useState(false);
    // Inputfältets innehåll
    const [newMessages, setNewMessages] = useState("");
    const [messages, setMessages] = useState([]);
    const [fakeMessages] = useState([
      {
        fakeId: 1,
        text: 'Hej Sofia, så roligt att få prata med dig!',
        username: 'Marcus',
        avatar: "https://i.pravatar.cc/100?img=14",
      },

      {
        fakeId: 2,
        text: 'Hallåååå, svaraaaa. Var inte så trög :(',
        username: 'Marcus',
        avatar: "https://i.pravatar.cc/100?img=14",
      },
    ]);

  useEffect(() => {
    if(!token) return navigate("/login");
        try {
        const decoded = jwtDecode(token);

        setUser({
          userId: decoded.id,
          username: decoded.user,
          avatar: decoded.avatar
        });
      } catch (error){
        console.error("Token error", error);
        navigate('/login');
    }
  }, [token, navigate]);


  useEffect(() => {
    if(!user) return; //väntar tills användaren är inloggad

    axios.get('https://chatify-api.up.railway.app/messages', { 
      headers: { Authorization: `Bearer ${token}` } 
  })
    .then(response => setMessages(response.data))
    .catch(error => {
        console.error("Kunde inte hämta meddelanden", error);
        if(error.response?.status === 403) logOut();
  });
}, [user, token]);
    
    function logOut() {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    };
    
    //Postar till APIet.
    const handleSendBtn = () => {
      if(!newMessages.trim()) return;

      axios.post(
          'https://chatify-api.up.railway.app/messages',
          { text: DOMPurify.sanitize(newMessages) },
          { headers: { Authorization: `Bearer ${token}` } }
      )
        //Uppdaterar state med nya meddelandet från API
        .then(response => {
          const newMsg = { ...response.data.latestMessage, userId: user.userId };
          setMessages(prev => [...prev, newMsg]);
          setNewMessages('');
        })
        .catch(error => console.error('Kunde inte skicka meddelandet', error));
      };
    

    const handleDeleteMsg = async (msgID) => {
      if (!msgID) return alert("Meddelandet kan inte tas bort");  
      try {
        await axios.delete(
          `https://chatify-api.up.railway.app/messages/${msgID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Tar bort meddelandet från state efter lyckad delete
        setMessages(prev => prev.filter(msg => msg.id !== msgID));
      } catch (error){
        console.error('Kunde inte ta bort meddelandet', error);
        }
      };
  
    // Lägg till en funktion som hanterar Enter
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); 
        handleSendBtn();   
        }
      };
      
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
          onClick={() => setSideNavOpen(!sideNavOpen)}
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
        {[...fakeMessages, ...messages].map((msg, index) => (
          <div 
            key={msg.id || msg.fakeId || `msg-${index}`}
            className={`message ${msg.userId === user?.userId ? 
              "my-message" : "fake-message"}`}
          > 
          {/* Avatar + namn bara på fejkade användare */}
          {msg.fakeId && ( 
            <div className="fake-user-info">
              <img 
                src={msg.avatar} 
                alt="avatar"
                className="avatar-img-chat" 
              />
              <span className="fake-username">
                <strong>{msg.username}</strong>
                </span>
            </div>
            )}
            {/* Texten */}
            <p>{msg.text}</p>
          {/* Delete-knapp */}
          {msg.userId === user?.userId &&  (
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteMsg(msg.id)}
                >Delete</button>
              )}
          </div>
        ))}
      </div>
    </main>

    {/* Skriv-rutan ligger direkt i page-wrapper-chat */}
    <div className="write-message-box">
      <input 
        type="text" 
        id="message-input" 
        placeholder="Write a message.." 
        value={newMessages}
        onChange={(e) => setNewMessages(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button className="send-btn" onClick={handleSendBtn}>Send</button>
    </div>
  </div>
  );
};

export default Chat