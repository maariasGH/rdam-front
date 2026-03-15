import React, { useEffect, useState } from 'react';
import OperadorDashboard from './OperadorDashboard'; // Reutilizamos la lógica de trámites
import UserForm from './UserForm';

const AdminDashboard = ({ nombre }) => {
  const [tab, setTab] = useState('tramites'); // 'tramites' o 'usuarios'
  const [usuarios, setUsuarios] = useState([]);
  const token = localStorage.getItem('token');
  

  const fetchUsuarios = async () => {
    const res = await fetch('http://localhost:8000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setUsuarios(data);
    };

    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleSaveUser = async (userData) => {
    const url = editingUser 
        ? `http://localhost:8000/api/admin/users/${editingUser.usuario_id}`
        : `http://localhost:8000/api/usuarios`;
        
    await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData),
    });
    
    setShowForm(false);
    setEditingUser(null);
    fetchUsuarios(); // Recarga la lista
    };

  useEffect(() => {
    if (tab === 'usuarios') fetchUsuarios();
  }, [tab]);

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee' }}>
        <h1>Panel de Administración</h1>
        <nav>
          <button onClick={() => setTab('tramites')}>Gestión Trámites</button>
          <button onClick={() => setTab('usuarios')}>Gestión Usuarios</button>
        </nav>
      </header>

      {tab === 'tramites' ? (
        <OperadorDashboard nombre={nombre} />
      ) : (
        <section>
          <h2>Usuarios del Sistema</h2>
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Login</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
            {usuarios.map(u => (
                <tr key={u.usuario_id}>
                <td>{u.login}</td>
                <td>{u.nombre_completo}</td>
                <td>{u.rol}</td>
                <td>
                    <button onClick={() => { setEditingUser(u); setShowForm(true); }}>Editar</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
            
            <button onClick={() => { setEditingUser(null); setShowForm(true); }}>+ Nuevo Usuario</button>

            {showForm && <UserForm user={editingUser} onClose={() => setShowForm(false)} onSave={handleSaveUser} />}
          
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;