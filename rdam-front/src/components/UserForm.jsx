import React, { useState } from 'react';

const UserForm = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    user || { login: '', nombre_completo: '', rol: 'OPERADOR', password: '', registrador_id: 1 }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h3 style={styles.title}>{user ? 'Editar Usuario' : 'Crear Usuario'}</h3>
          <button onClick={onClose} style={styles.btnCloseIcon}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID de Usuario (Login)</label>
            <input 
              style={{...styles.input, ...(user ? styles.inputDisabled : {})}}
              placeholder="Login" 
              value={formData.login} 
              onChange={(e) => setFormData({...formData, login: e.target.value})} 
              disabled={!!user} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre y Apellido</label>
            <input 
              style={styles.input}
              placeholder="Nombre Completo" 
              value={formData.nombre_completo} 
              onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rol asignado</label>
            <select 
              style={styles.select}
              value={formData.rol} 
              onChange={(e) => setFormData({...formData, rol: e.target.value})}
            >
              <option value="OPERADOR">Operador</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Seguridad</label>
            <input 
              style={styles.input}
              type="password" 
              placeholder={user ? "Nueva contraseña (opcional)" : "Password"} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
            {user && <small style={styles.hint}>Deja vacío si no deseas cambiarla</small>}
          </div>

          <div style={styles.buttonContainer}>
            <button type="button" onClick={onClose} style={styles.btnCancel}>
              Cancelar
            </button>
            <button type="submit" style={styles.btnSave}>
              {user ? 'Actualizar' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '35px',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '450px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  title: {
    margin: 0,
    color: '#fff',
    fontSize: '22px',
    fontWeight: '700',
  },
  btnCloseIcon: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '18px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '600',
    marginLeft: '4px',
  },
  input: {
    padding: '12px 16px',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
  },
  inputDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#64748b',
    cursor: 'not-allowed',
  },
  select: {
    padding: '12px 16px',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
  },
  hint: {
    fontSize: '11px',
    color: '#475569',
    marginTop: '2px',
    marginLeft: '4px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  btnCancel: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSave: {
    flex: 2,
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  }
};

export default UserForm;