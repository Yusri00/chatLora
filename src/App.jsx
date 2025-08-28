import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from "./pages/Register";
import Chat from './pages/Chat';
import './styles/index.css';
import './styles/chat.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App
