import { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Apuntamos al puerto 8000 que es donde Docker expone tu FastAPI
    axios.get('http://localhost:8000/api/admin/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        console.error("Error al conectar con la API:", err);
        setError("No se pudo conectar con el backend. ¿CORS configurado?");
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Usuarios Registrados</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user.usuario_id}>
                <td>{user.usuario_id}</td>
                <td>{user.nombre_completo}</td>
                <td>{user.rol}</td>
                <td>{user.estado}</td>
                </tr>
            ))}
        </tbody>
      </table>
      
      {users.length === 0 && !error && <p>Cargando usuarios o lista vacía...</p>}
    </div>
  );
};

export default UserList;