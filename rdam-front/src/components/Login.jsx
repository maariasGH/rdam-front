import React, { useState, useEffect } from 'react';
// Supongamos que tienes estos componentes creados
import AdminDashboard from './AdminDashboard';
import OperatorDashboard from './OperadorDashboard';

const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user'); // Asegúrate de haber guardado el objeto como string
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit presionado");
    
    // 1. Agrega esto para ver qué está pasando antes del fetch
    console.log("Credenciales a enviar:", credentials);

    setError(null);

    try {
        console.log("Intentando realizar fetch a: http://localhost:8000/api/auth/login");
        
        const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        });

        console.log("Respuesta recibida, status:", response.status);

        const data = await response.json();
        console.log("JSON parseado:", data);

        localStorage.setItem('user', JSON.stringify({
            id: data.user.id, // Muy importante que el ID esté aca
            login: data.user.login,
            rol: data.user.rol,
            nombre: data.user.nombre
        }));

        // Guardamos en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.access_token);
        
        // AVISAMOS A APP QUE EL USUARIO CAMBIÓ
        setUser(data.user);
    } catch (err) {
        // 2. FORZAR LOG EN CASO DE ERROR
        console.error("SE CAPTURÓ UN ERROR:");
        console.error(err);
        setError(err.message);
    }
    };

  // --- LÓGICA DE PANTALLAS ---
  
  // 1. Si ya tenemos un usuario en el estado, mostramos su pantalla correspondiente
// Obtenemos el string desde localStorage
    const userString = localStorage.getItem('user');

    // Intentamos parsearlo solo si existe
    const user = userString ? JSON.parse(userString) : null;

    if (user) {
        if (user.rol === 'ADMINISTRADOR') {
            return <AdminDashboard nombre={user.nombre} />;
        } else if (user.rol === 'OPERADOR') {
            return <OperatorDashboard nombre={user.nombre} />;
        }
    }

  // 2. Si no hay usuario, mostramos el formulario de login (tu diseño actual)
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Inicia Sesión</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="text" name="login" placeholder="Usuario" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;