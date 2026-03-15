import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import UserList from './UserList';
import CitizenFlow from './components/CitizenFlow';
import MisTramites from './components/MisTramites';
import Login from './components/Login';
import LogoutButton from './components/LogoutButton';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido a RDAM Santa Fe</h1>
      <p>Gestiona tus trámites de forma rápida.</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
        <button 
          onClick={() => navigate("/sol-cert")} 
          style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Solicitar Certificado
        </button>

        <button 
          onClick={() => navigate("/mis-tramites")} 
          style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Consultá tus Solicitudes
        </button>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  return (
    <Router>
      <nav style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}><strong>RDAM</strong></Link>

        {user ? (
          <LogoutButton />
        ) : (
          <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>Login Admin/Operador</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/admin" element={<UserList />} />
        <Route path="/sol-cert" element={<CitizenFlow />}/>
        <Route path="/mis-tramites" element={<MisTramites />}/>
      </Routes>
    </Router>
  );
}

export default App;