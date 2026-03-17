import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CitizenFlow from './components/CitizenFlow';
import MisTramites from './components/MisTramites';
import Login from './components/Login';
import LogoutButton from './components/LogoutButton';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.homeContainer}>
      <header style={styles.heroSection}>
        <h1 style={styles.mainTitle}>RDAM Santa Fe</h1>
        <p style={styles.mainSubtitle}>Gestión Digital de Trámites y Certificados</p>
      </header>
      
      <div style={styles.grid}>
        <div style={styles.glassCard} onClick={() => navigate("/sol-cert")}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>📄</div>
          <h2 style={styles.cardTitle}>Solicitar Certificado</h2>
          <p style={styles.cardText}>Iniciá un nuevo trámite de forma digital en pocos pasos.</p>
          <button style={styles.cardButtonPrimary}>Comenzar</button>
        </div>

        <div style={styles.glassCard} onClick={() => navigate("/mis-tramites")}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔍</div>
          <h2 style={styles.cardTitle}>Consultar Solicitudes</h2>
          <p style={styles.cardText}>Revisá el estado de tus trámites y descargá tus certificados.</p>
          <button style={styles.cardButtonSecondary}>Ver mis trámites</button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  
  return (
    <Router>
      <div style={styles.appWrapper}>
        <nav style={styles.navbar}>
          <Link to="/" style={styles.brand}>
            <span style={styles.brandDot}></span> RDAM <span style={styles.brandTag}>Santa Fe</span>
          </Link>

          <div style={styles.navLinks}>
            {user ? (
              <div style={styles.userInfo}>
                <span style={styles.userIcon}>👤</span>
                <LogoutButton />
              </div>
            ) : (
              <Link to="/login" style={styles.loginLink}>Acceso Personal</Link>
            )}
          </div>
        </nav>

        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/sol-cert" element={<CitizenFlow />}/>
            <Route path="/mis-tramites" element={<MisTramites />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  appWrapper: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0f172a', // Fondo azul muy oscuro
    color: '#f8fafc',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 50px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  brand: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '1px'
  },
  brandDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    display: 'inline-block'
  },
  brandTag: {
    fontSize: '14px',
    fontWeight: '300',
    color: '#94a3b8'
  },
  loginLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #3b82f6',
    transition: 'all 0.3s'
  },
  homeContainer: {
    padding: '60px 20px',
    maxWidth: '1000px',
    margin: 'auto',
    textAlign: 'center'
  },
  heroSection: {
    marginBottom: '60px'
  },
  mainTitle: {
    fontSize: '56px', // Lo subí un poco para que destaque
    fontWeight: '800',
    marginBottom: '10px',
    padding: '10px 0', // <--- Agregamos padding arriba y abajo para que no corte
    background: 'linear-gradient(to right, #ffffff, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block', // <--- Esto ayuda a que el fondo se limite al texto
    lineHeight: '1.2', // <--- Evita que se encimen las líneas
  },
  mainSubtitle: {
    fontSize: '18px',
    color: '#94a3b8',
    fontWeight: '300'
  },
  grid: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '40px',
    width: '300px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  cardTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#fff'
  },
  cardText: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.6',
    marginBottom: '25px'
  },
  cardButtonPrimary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    width: '100%',
    cursor: 'pointer'
  },
  cardButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    width: '100%',
    cursor: 'pointer'
  }
};

export default App;