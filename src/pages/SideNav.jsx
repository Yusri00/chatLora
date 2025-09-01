import '../styles/chat.css';

const SideNav = ({user, onLogout, isOpen, onClose}) => {
  // Om inte öppen, visa ingenting
    if (!isOpen) return null;

  return (
    <>
      {/* Click outside to close sidenav */}
    <div className="sidenav-overlay" onClick={onClose}></div>

    <div className={`sidenav ${isOpen ? "sidenav-open" : ""}`}>
      {/* x button to close sideNav */}
      <button className="close-btn" onClick={onClose}>X</button>
      
      <div className="profile-section">
        <img 
          src={user.avatar} 
          className= 'avatar-img' 
          alt="avatar" 
        />   
        <h3 className="profile-name">{user.username}</h3>
        <button className='logout-btn' onClick={onLogout}>
          Logga ut
        </button>
        </div> 
      </div>
    </>
  );
};

export default SideNav