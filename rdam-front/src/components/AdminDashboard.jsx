import React, { useEffect, useState } from 'react';
import OperadorDashboard from './OperadorDashboard'; 
import UserForm from './UserForm';

const AdminDashboard = ({ nombre }) => {
  const [tab, setTab] = useState('tramites');
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
    fetchUsuarios();
  };

  useEffect(() => {
    if (tab === 'usuarios') fetchUsuarios();
  }, [tab]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Panel de Administración</h1>
          <p style={styles.welcome}>Bienvenido, {nombre}</p>
        </div>
        <nav style={styles.nav}>
          <button 
            onClick={() => setTab('tramites')} 
            style={tab === 'tramites' ? styles.tabActive : styles.tab}
          >
            Gestión Trámites
          </button>
          <button 
            onClick={() => setTab('usuarios')} 
            style={tab === 'usuarios' ? styles.tabActive : styles.tab}
          >
            Gestión Usuarios
          </button>
        </nav>
      </header>

      <main style={styles.mainContent}>
        {tab === 'tramites' ? (
          <OperadorDashboard nombre={nombre} />
        ) : (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Usuarios del Sistema</h2>
              <button 
                onClick={() => { setEditingUser(null); setShowForm(true); }}
                style={styles.btnNuevo}
              >
                + Nuevo Usuario
              </button>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Login</th>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Rol</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                {usuarios.map(u => (
                    <tr key={u.usuario_id} style={styles.tr}>
                      <td style={styles.td}>
                        <code style={styles.code}>{u.login}</code>
                      </td>
                      <td style={styles.td}>{u.nombre_completo}</td>
                      <td style={styles.td}>
                        <span style={u.rol === 'ADMINISTRADOR' ? styles.rolAdmin : styles.rolOp}>
                          {u.rol}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {u.nombre_completo != 'Admin Sistema' && (
                        <button 
                          onClick={() => { setEditingUser(u); setShowForm(true); }}
                          style={styles.btnEdit}
                        >
                          Editar
                        </button>)}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>

            {showForm && (
              <div style={styles.modalOverlay}>
                <UserForm user={editingUser} onClose={() => setShowForm(false)} onSave={handleSaveUser} />
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: "'Inter', sans-serif",
    padding: '40px 5% 20px 5%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '20px',
    marginBottom: '30px'
  },
  title: { fontSize: '28px', fontWeight: '800', margin: 0, color: '#fff' },
  welcome: { color: '#94a3b8', margin: '5px 0 0 0', fontSize: '14px' },
  nav: { display: 'flex', gap: '10px' },
  tab: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  tabActive: {
    padding: '10px 20px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.3)'
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px'
  },
  sectionTitle: { fontSize: '20px', fontWeight: '700', margin: 0 },
  btnNuevo: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'center',
    padding: '15px',
    color: '#64748b',
    fontSize: '13px',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.02)' },
  td: { padding: '15px', fontSize: '15px', color: '#cbd5e1' },
  code: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '4px 8px',
    borderRadius: '6px',
    color: '#3b82f6',
    fontFamily: 'monospace'
  },
  rolAdmin: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    color: '#a78bfa',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  rolOp: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    color: '#2dd4bf',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  btnEdit: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  }
};

export default AdminDashboard;