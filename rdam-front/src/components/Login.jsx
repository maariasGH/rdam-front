import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import OperatorDashboard from './OperadorDashboard';

const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.access_token);
      
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (user) {
    if (user.rol === 'ADMINISTRADOR') {
      return <AdminDashboard nombre={user.nombre} />;
    } else if (user.rol === 'OPERADOR') {
      return <OperatorDashboard nombre={user.nombre} />;
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>🔑</div>
        <h2 style={styles.title}>Acceso Personal</h2>
        <p style={styles.subtitle}>Panel de Administración y Operadores</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorBadge}>
              ⚠️ {error}
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <input 
              type="text" 
              name="login" 
              placeholder="Usuario" 
              onChange={handleChange} 
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              type="password" 
              name="password" 
              placeholder="Contraseña" 
              onChange={handleChange} 
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Ingresar al Sistema
          </button>
        </form>
        
        <p style={styles.footerText}>
          RDAM Santa Fe - Sistema de Gestión Interna
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '85vh',
    backgroundColor: '#0f172a',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    padding: '50px 40px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  iconContainer: {
    fontSize: '40px',
    marginBottom: '20px',
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
    marginBottom: '30px',
    fontWeight: '300',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    fontSize: '16px',
    color: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
    transition: 'transform 0.2s ease',
  },
  errorBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    marginBottom: '10px',
  },
  footerText: {
    marginTop: '30px',
    fontSize: '12px',
    color: '#475569',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  }
};

export default Login;