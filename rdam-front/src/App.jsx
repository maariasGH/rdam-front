import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserList from './UserList'; // Tu tabla actual
import CitizenFlow from './components/CitizenFlow';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Hook para navegar

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido a RDAM Santa Fe</h1>
      <p>Gestiona tus trámites de forma rápida.</p>
      
      {/* Al hacer click, ejecutamos navigate("/sol-cert") */}
      <button 
        onClick={() => navigate("/sol-cert")} 
        style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }}
      >
        Solicitar Certificado
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
        <strong>RDAM</strong>
        <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>Login Admin/Operador</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<h2>Pantalla de Login (Próximamente)</h2>} />
        <Route path="/admin" element={<UserList />} />
        <Route path="/sol-cert" element={<CitizenFlow />}/>
      </Routes>
    </Router>
  );
}

export default App;